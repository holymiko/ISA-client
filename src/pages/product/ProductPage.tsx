import React, {useEffect, useState} from 'react';
import {DataGrid, GridRenderCellParams} from '@mui/x-data-grid';
import {
    existsProductById,
    getProductDetailById,
    saveProductSeparately,
    updateLinkReference
} from "../../services/productService";
import {getIdFromUrl} from "../../util/parse";
import {Product} from "../../types/Product";
import {PageTitle} from "../../components/PageTitle";
import Box from "@mui/material/Box";
import {priceColumns} from "./priceColumns";
import {CartesianGrid, Legend, Line, Tooltip, XAxis, YAxis, LineChart, AreaChart, Area} from "recharts";
import {Price} from "../../types/Price";
import moment from "moment/moment";
import {Dealer} from "../../types/enums/dealer";
import {BoxChart} from "../../components/BoxChart";
import {SubTitle} from "../../components/SubTitle";
import {BoxRow} from "../../components/BoxRow";
import {Button, Modal, TextField, Typography} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {scrapProductById} from "../../services/scrapService";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import {ProductDetail} from "../../types/ProductDetail";
import {LinkPrice} from "../../types/LinkPrice";
import {ButtonISA} from "../../components/ButtonISA";
import {useNavigate} from "react-router-dom";
import {excludeNonDigits} from "../../util/utils";

interface lineChartData {
    dateTime: string;
    Bessergold?: number;
    "Bessergold.de"?: number;
    Zlataky?: number;
    Silverum?: number;
}

interface areaChartData {
    dateTime: string;
    Bessergold?: [number, number];
    "Bessergold.de"?: [number, number];
    Zlataky?: [number, number];
    Silverum?: [number, number];
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};

const sortedRoundedDeepCopy = (prices: Price[]): Price[] => {
    // Deep copy
    let deepPrices: Price[] = JSON.parse(JSON.stringify(prices));
    // Sort from latest => newest
    deepPrices = deepPrices.sort(
        (a: Price, b: Price) => moment(a.priceDateTime).isBefore(b.priceDateTime) ? -1 : 1
    );
    // Round dateTime on minutes
    deepPrices.forEach((p: Price) => {
        p.priceDateTime = new Date(new Date(p.priceDateTime).setSeconds(0, 0));
    });
    return deepPrices;
}

const getLineChartData = (prices: Price[]) => {
    const result: lineChartData[] = [];
    const deepPrices: Price[] = sortedRoundedDeepCopy(prices);
    let chartData: lineChartData = {dateTime: moment(deepPrices[0].priceDateTime).format('h:mm a, DD.MM.YYYY')}

    for (let i = 0; i < deepPrices.length; i++) {
        const price: Price = deepPrices[i];
        const priceMoment = moment(price.priceDateTime).format('h:mm a, DD.MM.YYYY')
        // Exclude zero
        if(price.price === 0) continue;
        // New price dateTime found
        if(chartData.dateTime !== priceMoment) {
            result.push(chartData);
            chartData = {dateTime: priceMoment};
        }

        switch (price.dealer) {
            case Dealer.BESSERGOLD_CZ: {chartData.Bessergold = price.price; break;}
            case Dealer.BESSERGOLD_DE: {chartData["Bessergold.de"] = price.price; break;}
            case Dealer.ZLATAKY: {chartData.Zlataky = price.price; break;}
            case Dealer.SILVERUM: {chartData.Silverum = price.price; break;}
        }
    }
    result.push(chartData);
    return result;
}

const getAreaChartData = (prices: Price[]) => {
    const result: areaChartData[] = [];
    const deepPrices: Price[] = sortedRoundedDeepCopy(prices);
    let chartData: areaChartData = {dateTime: moment(deepPrices[0].priceDateTime).format('h:mm a, DD.MM.YYYY')}

    for (let i = 0; i < deepPrices.length; i++) {
        const price: Price = deepPrices[i];
        const priceMoment = moment(price.priceDateTime).format('h:mm a, DD.MM.YYYY')
        // Exclude zero
        if(price.price === 0) continue;
        // New price dateTime found
        if(chartData.dateTime !== priceMoment) {
            result.push(chartData);
            chartData = {dateTime: priceMoment};
        }

        switch (price.dealer) {
            case Dealer.BESSERGOLD_CZ: {chartData.Bessergold = [price.price, price.redemption]; break;}
            case Dealer.BESSERGOLD_DE: {chartData["Bessergold.de"] = [price.price, price.redemption]; break;}
            case Dealer.ZLATAKY: {chartData.Zlataky = [price.price, price.redemption]; break;}
            case Dealer.SILVERUM: {chartData.Silverum = [price.price, price.redemption]; break;}
        }
    }
    result.push(chartData);
    return result;
}

export const ProductPage = () => {

    const navigate = useNavigate();

    // Hooks declaration
    const [priceRows, setPriceRows] = useState<Price[]>([]);
    const [product, setProduct] = useState<ProductDetail>();
    const [loading, setLoading] = useState<boolean>(true);
    const [chartData, setChartData] = useState<any>([]);
    const [areaChartData, setAreaChartData] = useState<any>([]);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [modalProductIdInput, setModalProductIdInput] = useState<string>();
    const [modalProductExists, setModalProductExists] = useState<boolean>(false);
    const [selectedLink, setSelectedLink] = useState<LinkPrice>();

    // const [totalItems, setTotalItems] = useState<number>(0);
    // const [currentPage, setCurrentPage] = useState<number>(1);

    const productId: number = getIdFromUrl(window.location.pathname);

    const setHooks = (res: ProductDetail) => {
        // setTotalItems(res.totalItems)
        const prices: Price[] = res.prices!.flatMap((x) => {
            const tmp = [];
            for(const i of x.prices) {
                tmp.push({
                    ...i,
                    dealer: x.dealer
                })
            }
            return tmp;
        });
        setProduct(res);
        setPriceRows(prices);
        setChartData(
            getLineChartData(prices)
        )
        setAreaChartData(
            getAreaChartData(prices)
        )
        setLoading(false);
    }

    const getProduct = () => {
        setLoading(true)
        return getProductDetailById(productId).then(
            (res: ProductDetail) => setHooks(res)
        )//.catch(e => setLoading(false));
    }

    const saveProductSeparatelyFce = (linkId: number) => {
        setLoading(true)
        saveProductSeparately(productId, linkId).then(
            (res) => getProduct().catch(
                () => {
                    // last Link was replaced -> this Product was deleted
                    setLoading(false);
                    navigate("/product/"+res.data.metal.toLowerCase());
                }
            )
        ).catch(
            () => setLoading(false)
        );
    }

    useEffect(() => {
        getProduct();
    }, []);

    useEffect(() => {
        existsProductById(Number(modalProductIdInput)).then(
            setModalProductExists
        )
    }, [modalProductIdInput]);

    return (
        <Box>
            <PageTitle>{product?.name}</PageTitle>

            <BoxRow sx={{justifyContent: 'flex-end', mb: "0.5rem"}}>
                <Button
                    onClick = {() => getProduct()}
                    startIcon={<RefreshIcon/>}
                    disabled={loading}
                    variant="contained"
                >
                    Refresh prices
                </Button>
                <Button
                    onClick = {() => scrapProductById(productId)}
                    startIcon={<PlayCircleOutlineIcon/>}
                    variant="contained"
                >
                    Scrap product prices
                </Button>
            </BoxRow>

            <SubTitle>Price chart</SubTitle>
            <BoxChart sx={{pb: "1rem", pl: "1rem", mb: "4rem"}}>
                <LineChart width={1450} height={500} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dateTime" />
                    <YAxis type="number" domain={['auto', 'auto']}/>
                    <Tooltip />
                    <Legend />
                    <Line connectNulls strokeWidth={4} type="monotone" dataKey="Bessergold" stroke="red" />
                    <Line connectNulls strokeWidth={4} type="monotone" dataKey="Bessergold.de" stroke="green" />
                    <Line connectNulls strokeWidth={4} type="monotone" dataKey="Zlataky" stroke="orange" />
                    <Line connectNulls strokeWidth={4} type="monotone" dataKey="Silverum" stroke="blue" />
                </LineChart>
            </BoxChart>

            <SubTitle>Price & Buyout chart</SubTitle>
            <BoxChart sx={{pb: "1rem", pl: "1rem", mb: "4rem"}}>
                <AreaChart width={1450} height={500} data={areaChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dateTime" />
                    <YAxis type="number" domain={['auto', 'auto']}/>
                    <Tooltip />
                    <Legend />
                    <Area connectNulls strokeWidth={4} type="monotone" dataKey="Bessergold" stroke="red" />
                    <Area connectNulls strokeWidth={4} type="monotone" dataKey="Bessergold.de" stroke="green" />
                    <Area connectNulls strokeWidth={4} type="monotone" dataKey="Zlataky" stroke="orange" />
                    <Area connectNulls strokeWidth={4} type="monotone" dataKey="Silverum" stroke="blue" />
                </AreaChart>
            </BoxChart>

            <SubTitle>History table</SubTitle>
            <BoxChart sx={{mb: "4rem"}}>
                <Box sx={{height: 527, width: '100%'}}>
                    <DataGrid
                      sx={{
                          borderColor: "whitesmoke",
                          "& .MuiDataGrid-columnHeaderTitle": {
                              fontSize: 16,
                              fontWeight: 'bold'
                          }}}
                      rows={priceRows}
                      columns={priceColumns}
                      loading={loading}
                      initialState={{
                        sorting: {
                          sortModel: [{ field: 'priceDateTime', sort: 'desc' }],
                        },
                      }}
                      // rowCount={totalItems}
                      // pageSize={pageSize}
                      // rowsPerPageOptions={[pageSize]}
                      // checkboxSelection
                      // pagination
                      // paginationMode="server"
                      // sortingMode="server"
                      // onPageChange={(page) => setCurrentPage(page+1)}
                      // page={currentPage-1}
                      // components={{
                      //     Pagination: Pagination1,
                      // }}
                      // classes={{
                      //     row: styles.priceRows
                      // }}
                    />
                </Box>
            </BoxChart>

            <SubTitle>Sources</SubTitle>
            <BoxChart sx={{mb: "4rem"}}>
                <Box sx={{height: 527, width: '100%'}}>
                    <DataGrid
                        getRowHeight={() => 'auto'}
                        sx={{
                            borderColor: "whitesmoke",
                            "& .MuiDataGrid-columnHeaderTitle": {
                                fontSize: 16,
                                fontWeight: 'bold'
                            }
                        }}
                        loading={loading}
                        rows={product?.latestPrices?.length ? product?.latestPrices : []}
                        columns={[
                            {
                                field: 'uri',
                                headerName: 'URL',
                                headerAlign: 'center',
                                align: 'left',
                                minWidth: 850,
                                maxWidth: 850,
                                flex: 1,
                                renderCell: (params: GridRenderCellParams<LinkPrice>) => (
                                    <Typography variant='subtitle1'>
                                        <a href={params.row.uri}>{params.row.uri}</a>
                                    </Typography>
                                )
                            },
                            {
                                field: 'actions',
                                headerName: 'Actions',
                                headerAlign: 'center',
                                align: 'center',
                                minWidth: 300,
                                disableColumnMenu: true,
                                flex: 1,
                                sortable: false,
                                renderCell: (params: GridRenderCellParams<Product>) => (
                                    <Box sx={{gap: 2, width: 1.0, my: 2, display: 'flex', justifyContent: 'center'}}>
                                        <ButtonISA disabled={process.env.NODE_ENV === 'production'} onClick={() => saveProductSeparatelyFce(params.row.id)}>
                                            save separately
                                        </ButtonISA>
                                        <ButtonISA disabled={process.env.NODE_ENV === 'production'}
                                            onClick={() => {
                                                setSelectedLink(params.row)
                                                setModalIsOpen(true)
                                            }}>
                                            connect URL to different product
                                        </ButtonISA>
                                    </Box>
                                )
                            },
                        ]}
                    />
                </Box>
            </BoxChart>

            <Modal
                open={modalIsOpen}
                onClose={() => {
                    setModalIsOpen(false);
                    setModalProductIdInput('');
                    setModalProductExists(false);
                    setSelectedLink(undefined);
                }}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{mb: 1}}>
                        Insert ID of Product to which you want to connect following URL
                    </Typography>
                    <Typography variant='subtitle1' sx={{mb: 2}}>
                        <a href={selectedLink?.uri}>{selectedLink?.uri}</a>
                    </Typography>
                    <BoxRow>
                        <TextField
                            size={'small'}
                            label="Product ID"
                            value={modalProductIdInput}
                            onChange={(x) => setModalProductIdInput(excludeNonDigits(x.target.value))}
                        />
                        <ButtonISA disabled={true}>
                            search
                        </ButtonISA>
                        <ButtonISA variant="outlined" onClick={() => setModalProductIdInput('')}>
                            clear
                        </ButtonISA>
                        <ButtonISA disabled={process.env.NODE_ENV === 'production' || !modalProductExists}
                            onClick={() => {
                                const metal = product?.metal
                                updateLinkReference(productId, selectedLink!.id, Number(modalProductIdInput)).then(
                                    () => getProduct().then(
                                        () => setModalIsOpen(false)
                                    ).catch(
                                        () => {
                                            // last Link was replaced -> this Product was deleted
                                            setLoading(false);
                                            navigate("/product/"+metal);
                                        }
                                    )
                                )
                            }}
                        >
                            connect
                        </ButtonISA>
                    </BoxRow>

                </Box>
            </Modal>

        </Box>
    );
}