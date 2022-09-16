import React, {useEffect, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {getProductById} from "../../services/ProductService";
import {getIdFromUrl} from "../../util/parse";
import {Product} from "../../types/Product";
import {PageTitle} from "../../components/PageTitle";
import Box from "@mui/material/Box";
import {productColumns} from "./productColumns";
import {CartesianGrid, Legend, Line, Tooltip, XAxis, YAxis, LineChart, AreaChart, Area} from "recharts";
import {Price} from "../../types/Price";
import moment from "moment/moment";
import {Dealer} from "../../types/dealer";
import {BoxChart} from "../../components/BoxChart";
import {SubTitle} from "../../components/SubTitle";
import {BoxRow} from "../../components/BoxRow";
import {Button} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {scrapProductById} from "../../services/ScrapService";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

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
        if(price.price === 0) return;
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
        if(price.price === 0) return;
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

    // Hooks declaration
    const [rows, setRows] = useState<Price[]>([]);
    const [product, setProduct] = useState<Product>();
    const [loading, setLoading] = useState<boolean>(true);
    const [chartData, setChartData] = useState<any>([]);
    const [areaChartData, setAreaChartData] = useState<any>([]);

    // const [totalItems, setTotalItems] = useState<number>(0);
    // const [currentPage, setCurrentPage] = useState<number>(1);

    const productId: number = getIdFromUrl(window.location.pathname);

    const getProduct = () => {
        setLoading(true)
        getProductById(productId).then((res) => {
            // setTotalItems(res.totalItems)
            setProduct(res);
            setRows(res.prices!);
            setChartData(
                getLineChartData(res.prices!)
            )
            setAreaChartData(
                getAreaChartData(res.prices!)
            )
            setLoading(false);
        })//.catch(e => setLoading(false));
    }

    useEffect(() => {
        getProduct();
    }, []);

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
                <Box sx={{ height: 527, width: '100%'}}>
                    <DataGrid
                      sx={{
                          borderColor: "whitesmoke",
                          "& .MuiDataGrid-columnHeaderTitle": {
                              fontSize: 16,
                              fontWeight: 'bold'
                          }}}
                      rows={rows}
                      columns={productColumns}
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
                      //     row: styles.rows
                      // }}
                    />
            </Box>
            </BoxChart>

            <Box sx={{mt: "1rem"}}>References:
                <Box sx={{ml: "1rem"}}>
                    {product?.links?.map(
                        link =>
                            <div>
                                <a href={link}>{link}</a>
                            </div>
                    )}
                </Box>
            </Box>
        </Box>
    );
}