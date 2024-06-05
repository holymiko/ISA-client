import React, {useEffect, useState} from 'react';
import {DataGrid, GridRenderCellParams} from '@mui/x-data-grid';
import {
    existsProductById,
    getProductDetailById,
    saveProductSeparately,
    updateLinkReference
} from "../../services/productService";
import {TypographyPageTitle} from "../../components/TypographyPageTitle";
import Box from "@mui/material/Box";
import {priceHistoryColumns} from "./priceHistoryColumns";
import {Area, AreaChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {Price} from "../../types/Price";
import {Dealer} from "../../types/enums/dealer";
import {BoxChart} from "../../components/BoxChart";
import {TypographyH5BoldChart} from "../../components/TypographyH5BoldChart";
import {BoxRow} from "../../components/BoxRow";
import {Modal, TextField, Typography} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {scrapProductById} from "../../services/scrapService";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import {ProductDetail} from "../../types/ProductDetail";
import {LinkPrice} from "../../types/LinkPrice";
import {ButtonISA} from "../../components/ButtonISA";
import {useLocation, useNavigate} from "react-router-dom";
import {excludeNonDigits, getSessionUser, isAdmin} from "../../util/utils";
import {Role} from "../../types/enums/role";
import {BoxColumnCenter} from "../../components/BoxColumnCenter";
import {compareAsc, format} from "date-fns";
import {LinkPrices} from "../../types/LinkPrices";
import {CallMerge, CallSplit} from "@mui/icons-material";


interface chartDealer {
    uri: string,
    dealer: Dealer,
    dealerString: string,
    color: string,
}

export const chartDealersPre = {
    BESSERGOLD_CZ: {
        dealer: Dealer.BESSERGOLD_CZ,
        dealerString: "Bessergold",
        color: "red"
    },
    BESSERGOLD_DE: {
        dealer: Dealer.BESSERGOLD_DE,
        dealerString: "Bessergold.de",
        color: "green"
    },
    SILVERUM: {
        dealer: Dealer.SILVERUM,
        dealerString: "Silverum",
        color: "blue"
    },
    ZLATAKY: {
        dealer: Dealer.ZLATAKY,
        dealerString: "Zlataky",
        color: "orange"
    },
    CESKA_MINCOVNA: {
        dealer: Dealer.CESKA_MINCOVNA,
        dealerString: "Ceska Mincovna",
        color: "pink"
    },
    GOLD_A_SILVER: {
        dealer: Dealer.GOLD_A_SILVER,
        dealerString: "Gold a Silver",
        color: "purple"
    },
    AURUM_PRO: {
        dealer: Dealer.AURUM_PRO,
        dealerString: "Aurum Pro",
        color: "black"
    },
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
        (a: Price, b: Price) => compareAsc(a.priceDateTime, b.priceDateTime)
    );
    // Round dateTime on minutes
    deepPrices.forEach((p: Price) => {
        p.priceDateTime = new Date(new Date(p.priceDateTime).setSeconds(0, 0));
        p.price = Math.round(p.price)
        p.redemption = Math.round(p.redemption)
    });
    return deepPrices;
}


const getChartDealers = (linkPrices: LinkPrices[]): any[] => {
    const dealerStruct: any[] = [];
    const chartDealers: chartDealer[] = [];
    linkPrices.forEach(linkPrice => {
        // @ts-ignore
        const dealerIndex: number = dealerStruct[linkPrice.dealer.toString()]
        if(dealerIndex === undefined) {
            // @ts-ignore
            dealerStruct[linkPrice.dealer.toString()] = 0
            chartDealers.push({ uri: linkPrice.uri, ...chartDealersPre[linkPrice.dealer] });
        } else {
            chartDealers.push({
                uri: linkPrice.uri,
                dealer: chartDealersPre[linkPrice.dealer].dealer,
                dealerString: chartDealersPre[linkPrice.dealer].dealerString + "_" + dealerIndex,
                color: chartDealersPre[linkPrice.dealer].color
            })
        }
        // @ts-ignore
        dealerStruct[linkPrice.dealer.toString()] += 1;
    });
    return chartDealers;
}

const getLineChartData = (prices: Price[], chartDealers: chartDealer[]) => {
    const result: any[] = [];
    let chartData = {dateTime: format(prices[0].priceDateTime, 'h:mm a, dd.MM.yyyy')}

    for (let i = 0; i < prices.length; i++) {
        const price: Price = prices[i];
        const priceDateTime: string = format(price.priceDateTime, 'h:mm a, dd.MM.yyyy')
        // Exclude zero
        if(price.price === 0) continue;
        // New price dateTime found
        if(chartData.dateTime !== priceDateTime) {
            result.push(chartData);
            chartData = {dateTime: priceDateTime};
        }

        // @ts-ignore
        const dealer: string = chartDealers.find((chartDealer) => chartDealer.uri === price.uri).dealerString
        // @ts-ignore
        chartData[dealer] = price.price;
    }
    result.push(chartData);
    return result;
}

const getAreaChartData = (prices: Price[], chartDealers: chartDealer[]) => {
    const result: any[] = [];
    let chartData = {dateTime: format(prices[0].priceDateTime, 'h:mm a, dd.MM.yyyy')}

    for (let i = 0; i < prices.length; i++) {
        const price: Price = prices[i];
        const priceDateTime = format(price.priceDateTime, 'h:mm a, dd.MM.yyyy')
        // Exclude zero
        if(price.price === 0) continue;
        if(price.redemption === 0) {
            price.redemption = price.price
        }
        // New price dateTime found
        if(chartData.dateTime !== priceDateTime) {
            result.push(chartData);
            chartData = {dateTime: priceDateTime};
        }

        // @ts-ignore
        const dealer: string = chartDealers.find((chartDealer) => chartDealer.uri === price.uri).dealerString
        // @ts-ignore
        chartData[dealer] = [price.price, price.redemption];
    }
    result.push(chartData);
    return result;
}

export const ProductDetailPage = () => {

    const navigate = useNavigate();
    const location = useLocation();

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
    const [sessionUserRole, setSessionUserRole] = useState<Role|undefined>(undefined);
    const [chartDealers, setChartDealers] = useState<chartDealer[]>([]);
    // const [totalItems, setTotalItems] = useState<number>(0);
    // const [currentPage, setCurrentPage] = useState<number>(1);

    const productId: number = Number(location.pathname.split("/").pop())

    const setHooks = (res: ProductDetail) => {
        // setTotalItems(res.totalItems)
        const linkPrices: LinkPrices[] = res.prices!;
        const prices: Price[] = linkPrices.flatMap((x) => {
            const tmp = [];
            for(const i of x.prices) {
                tmp.push({
                    ...i,
                    uri: x.uri,     // extends Price entity
                    dealer: x.dealer
                })
            }
            return tmp;
        });
        setProduct(res);
        setChartDealers(
            getChartDealers(linkPrices)
        )
        setPriceRows(prices);
        setLoading(false);
    }

    useEffect(() => {
        if(priceRows.length === 0) return;
        const deepPrices: Price[] = sortedRoundedDeepCopy(priceRows);
        setChartData(
            getLineChartData(deepPrices, chartDealers)
        )
        setAreaChartData(
            getAreaChartData(deepPrices, chartDealers)
        )
    }, [priceRows, chartDealers]);

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
        setSessionUserRole(
            getSessionUser(navigate)?.account?.role
        )
    }, []);

    useEffect(() => {
        if(!modalIsOpen) return;
        existsProductById(Number(modalProductIdInput)).then(
            setModalProductExists
        )
    }, [modalProductIdInput]);

    return (
        <Box>
            <TypographyPageTitle>{product?.name}</TypographyPageTitle>

            <BoxRow sx={{justifyContent: 'flex-end', mb: "0.5rem"}}>
                <ButtonISA
                    onClick = {() => scrapProductById(productId)}
                    startIcon={<PlayCircleOutlineIcon/>}
                    disabled={loading || !isAdmin(sessionUserRole)}
                    variant="contained"
                >
                    Scrap product prices
                </ButtonISA>
                <ButtonISA
                    onClick = {getProduct}
                    startIcon={<RefreshIcon/>}
                    disabled={loading}
                    variant="contained"
                >
                    Refresh prices
                </ButtonISA>
            </BoxRow>

            <TypographyH5BoldChart>Price chart</TypographyH5BoldChart>
            <BoxChart sx={{pb: "1rem", pl: "1rem", mb: "4rem"}}>
                <LineChart width={1450} height={500} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dateTime" />
                    <YAxis type="number" domain={['auto', 'auto']}/>
                    <Tooltip />
                    <Legend />
                    {
                        chartDealers.map((chartDealer: chartDealer) => (
                            <Line
                                connectNulls
                                strokeWidth={4}
                                type="monotone"
                                // dot={false}
                                key={chartDealer.dealerString}
                                dataKey={chartDealer.dealerString}
                                stroke={chartDealer.color}
                            />
                        ))
                    }
                </LineChart>
            </BoxChart>

            <TypographyH5BoldChart>Price & Buyout chart</TypographyH5BoldChart>
            <BoxChart sx={{pb: "1rem", pl: "1rem", mb: "4rem"}}>
                <AreaChart width={1450} height={500} data={areaChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dateTime" />
                    <YAxis type="number" domain={['auto', 'auto']}/>
                    <Tooltip />
                    <Legend />
                    {
                        chartDealers.map((chartDealer: chartDealer) => (
                            <Area
                                connectNulls
                                strokeWidth={4}
                                type="monotone"
                                key={chartDealer.dealerString}
                                dataKey={chartDealer.dealerString}
                                stroke={chartDealer.color}
                            />
                        ))
                    }
                </AreaChart>
            </BoxChart>

            <TypographyH5BoldChart>History table</TypographyH5BoldChart>
            <BoxChart sx={{mb: "4rem"}}>
                <Box sx={{
                    height: 527,
                    width: '100%',
                    '& .isa-app--header': {
                        backgroundColor: 'whitesmoke',
                    }
                }}>
                    <DataGrid
                      sx={{
                          borderColor: "whitesmoke",
                          "& .MuiDataGrid-columnHeaderTitle": {
                              fontSize: 16,
                              fontWeight: 'bold'
                          }}}
                      rows={priceRows}
                      columns={priceHistoryColumns}
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

            <TypographyH5BoldChart>Sources</TypographyH5BoldChart>
            <BoxChart sx={{mb: "4rem"}}>
                <Box sx={{
                    height: 527,
                    width: '100%',
                    '& .isa-app--header': {
                        backgroundColor: 'whitesmoke',
                    }
                }}>
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
                                headerClassName: 'isa-app--header',
                                headerAlign: 'center',
                                align: 'left',
                                minWidth: 850,
                                maxWidth: 850,
                                flex: 1,
                                renderCell: (params: GridRenderCellParams<LinkPrice>) => (
                                    <BoxColumnCenter>
                                        <Typography variant='subtitle1'>
                                            <a href={params.row.uri}>{params.row.uri}</a>
                                        </Typography>
                                    </BoxColumnCenter>
                                )
                            },
                            {
                                field: 'actions',
                                headerName: 'Actions',
                                headerClassName: 'isa-app--header',
                                headerAlign: 'center',
                                align: 'center',
                                minWidth: 300,
                                disableColumnMenu: true,
                                flex: 1,
                                sortable: false,
                                renderCell: (params: GridRenderCellParams<LinkPrice>) => (
                                    <Box sx={{gap: 2, width: 1.0, my: 2, display: 'flex', justifyContent: 'center'}}>
                                        <ButtonISA
                                            startIcon={<CallSplit/>}
                                            disabled={!isAdmin(sessionUserRole)} onClick={() => saveProductSeparatelyFce(params.row.id)}
                                        >
                                            save separately
                                        </ButtonISA>
                                        <ButtonISA
                                            startIcon={<CallMerge/>}
                                            disabled={!isAdmin(sessionUserRole)}
                                            onClick={() => {
                                                setSelectedLink(params.row)
                                                setModalIsOpen(true)
                                            }}
                                        >
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
                        <ButtonISA disabled={!isAdmin(sessionUserRole) || !modalProductExists}
                            onClick={() => {
                                const metal = product?.metal
                                updateLinkReference(productId, selectedLink!.id, Number(modalProductIdInput)).then(
                                    () => getProduct().then(
                                        () => setModalIsOpen(false)
                                    ).catch(
                                        () => {
                                            // last Link was replaced -> this Product was deleted
                                            setLoading(false);
                                            navigate("/product/"+metal?.toLowerCase());
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