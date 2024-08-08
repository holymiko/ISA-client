import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {TypographyPageTitle} from "../components/TypographyPageTitle";
import {getBackendVersion, getDbStats} from "../services/appInfoService";
import {getProductsByPages} from "../services/productService";
import {Product} from "../types/Product";
import {Price} from "../types/Price";
import {Metal} from "../types/enums/metal";
import {Availability} from "../types/enums/availability";
import {Dealer} from "../types/enums/dealer";
import {axisClasses} from '@mui/x-charts/ChartsAxis';
import {BarChart, ScatterChart} from "@mui/x-charts";
import {TypographyH5BoldChart} from "../components/TypographyH5BoldChart";
import {useTranslation} from "react-i18next";
import {chartDealersPre} from "./product_detail/ProductDetailPage";
import {isEmpty} from "../util/utils";
import {getLinkCountAsDto} from "../services/linkService";
import {LinkCountDto} from "../types/LinkCountDto";
import {BoxChart} from "../components/BoxChart";
import {CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts";
import {BarChartAvailability, BarChartData} from "../components/BarChartAvailability";
import {BarChartPriceDistribution, BarChartPriceDistriData} from "../components/BarChartPriceDistribution";

interface LineChartData {
    name: string,
    color: string,
    data: {
        price_weight: number,
        share: number,
    }[]
}

interface BarChartDataProductCount {
    dealer: string
    productCount: number
    linkWithoutProductCount: number
}

interface ScatterChartData {
    id: number
    product_id: number
    dealer: string
    weight: number
    price: number
    price_weight: number
}

export const xChartsSetting = {
    // width: 1600,
    height: 340,
    sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-11px, 0)',
        },
    },
};

const getBarChartDataLinkCount = (linkCountDtos: LinkCountDto[]): BarChartDataProductCount[] => {
    const list: BarChartDataProductCount[] = []
    linkCountDtos?.forEach((linkCount) =>
        list.push({
            dealer: linkCount.dealer.toString(),
            productCount: linkCount.productCount,
            linkWithoutProductCount: linkCount.linkCount - linkCount.productCount,
        })
    );
    return list;
}

const getBarChartData = (latestPrices: Price[]): BarChartData[] => {
    const list: BarChartData[] = []
    for (const dealer in Dealer) {
        list.push(
            {
                dealer: dealer,
                green: 0,
                orange: 0,
                red: 0,
                total: 0
            },
        )
    }

    latestPrices.forEach(price => {
        if(price.availability === Availability.IN_STOCK || price.availability === Availability.IN_STORE) {
            list.filter(value => value.dealer === price.dealer).forEach(
                value => {
                    value.green++;
                    value.total++;
                }
            )
        }
        if(price.availability === Availability.ON_ORDER || price.availability === Availability.ON_DEMAND) {
            list.filter(value => value.dealer === price.dealer).forEach(
                value => {
                    value.orange++;
                    value.total++;
                }
            )
        }
        if(price.availability === Availability.SOLD_OUT || price.availability === Availability.UNAVAILABLE) {
            list.filter(value => value.dealer === price.dealer).forEach(
                value => {
                    value.red++;
                    value.total++;
                }
            )
        }
    })

    return list;
}

const getScatterChartData = (products: Product[]): ScatterChartData[] => {
    const list: ScatterChartData[] = []

    products.forEach(product => product.latestPrices.forEach((price: Price) => {
            if(price.price === 0) {
                return
            }
            // Remove outliers
            if(product.metal === Metal.GOLD && product.grams >= 2000) {
                return;
            }
            // Remove outliers
            if(product.metal === Metal.SILVER && product.grams >= 20000) {
                return;
            }
            list.push(
                {
                    id: price.id,
                    product_id: product.id,
                    dealer: price.dealer,
                    weight: product.grams,
                    price: price.price,
                    price_weight: price.pricePerGram
                }
            )
            })
    )

    return list;
}

const sortFce = (a: any, b: any) => {
    return a-b
}

const getPriceDistriBarChartData = (batchSize: number, dataScatterChart: ScatterChartData[]): BarChartPriceDistriData[] => {
    const sortedPriceWeight: number[] = dataScatterChart.map(x => x.price_weight).sort(sortFce);

    const lowestPriceWeight = sortedPriceWeight[0] - sortedPriceWeight[0] % batchSize
    const highestPriceWeight = sortedPriceWeight[sortedPriceWeight.length-1]

    const result: BarChartPriceDistriData[] = []
    let firstZero = null;
    for (let priceBottom = lowestPriceWeight; priceBottom < highestPriceWeight; priceBottom += batchSize) {
        const priceTop = priceBottom + batchSize;
        let counter = 0
        for (let j = 0; j < sortedPriceWeight.length; j++) {
            const tmpPrice = sortedPriceWeight.at(j)!
            if(tmpPrice > priceTop) {
                continue
            }
            if(tmpPrice > priceBottom && tmpPrice <= priceTop) {
                counter++
            }
        }
        if(counter === 0) {
            if(firstZero === null) {
                firstZero = priceBottom;
            }
        } else {
            result.push({
                price: `${firstZero !== null ? firstZero : priceBottom} - ${priceTop} Kč/g`,
                count: counter
            })
            firstZero = null;
        }

    }
    return result;
}

const getPriceDistriLineChartSeries = (dataScatterChart: ScatterChartData[]): LineChartData[] => {
    const sortedData: ScatterChartData[] = dataScatterChart.sort(sortFce2);

    const dealerStruct: any[] = [];
    const chartDealers: any[] = [];
    sortedData.forEach((data: ScatterChartData) => {
        // @ts-ignore
        if(dealerStruct[data.dealer] === undefined) {
            // @ts-ignore
            dealerStruct[data.dealer] = {
                share: 0,
                singleShare: 1 / sortedData.map((y) => y.dealer).filter((y) => y === data.dealer).length
            }
            // @ts-ignore
            chartDealers[data.dealer] = {
                name: data.dealer,
                // @ts-ignore
                color: chartDealersPre[data.dealer].color,
                data: []
            }
        }
        // @ts-ignore
        const tmp = dealerStruct[data.dealer]

        // @ts-ignore
        dealerStruct[data.dealer] = {
            share: tmp.share + tmp.singleShare,
            singleShare: tmp.singleShare
        }

        // @ts-ignore
        chartDealers[data.dealer].data = [
            // @ts-ignore
            ...chartDealers[data.dealer].data,
            {
                price_weight: data.price_weight,
                // @ts-ignore
                share: Math.min(dealerStruct[data.dealer].share, 1),
            }
        ]

    });

    // @ts-ignore
    return Object.keys(Dealer).map(dealer => chartDealers[dealer]).filter(x => x !== undefined)
}

const sortFce2 = (a: ScatterChartData, b: ScatterChartData) => {
    return a.price_weight - b.price_weight
}


export const AnalyticPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [row, setRow] = useState<any>([]);
    const [productsGold, setProductsGold] = useState<Product[]>([])
    const [productsSilver, setProductsSilver] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [priceDistriBarChartDataGold, setPriceDistriBarChartDataGold] = useState<any[]>([])
    const [priceDistriLineChartDataGold, setPriceDistriLineChartDataGold] = useState<any[]>([])
    const [priceDistriBarChartDataSilver, setPriceDistriBarChartDataSilver] = useState<any[]>([])
    const [priceDistriLineChartDataSilver, setPriceDistriLineChartDataSilver] = useState<any[]>([])
    const [barChartDataGold, setBarChartDataGold] = useState<BarChartData[]>([])
    const [barChartDataSilver, setBarChartDataSilver] = useState<any[]>([])
    const [barChartDataProductCount, setBarChartDataProductCount] = useState<any[]>([])
    const [scatterChartDataGold, setScatterChartDataGold] = useState<any[]>([])

    const [dbStats, setDbStats] = useState<any>();
    const [version, setVersion] = useState<string>("");

    const update = () => {
        getDbStats().then((x) => {
            setDbStats(x.data)
            setRow([{
                name: "Silverum",
                linkWithProduct: x.data.linksWithProductSilverum,
                totalLinks: x.data.linksSilverum,
                share: x.data.linksWithProductSilverum / x.data.linksSilverum
            }])
        });
        getBackendVersion().then((x) => setVersion(x.data));
    }

    const formatProducts = (metal: Metal|undefined, products: Product[]) => {
        const latestPrices: Price[] = products.flatMap(x => x.latestPrices);
        const dataAvailaChart: BarChartData[] = getBarChartData(latestPrices);
        const dataScatterChart: ScatterChartData[] = getScatterChartData(products);
        const dataPriceDistriLineChart: LineChartData[] = getPriceDistriLineChartSeries(dataScatterChart);
        const dataPriceDistriBarChart: BarChartPriceDistriData[] = getPriceDistriBarChartData(
            metal === Metal.GOLD ? 25 : 1,
            dataScatterChart
        );

        if(metal === Metal.GOLD) {
            setBarChartDataGold(dataAvailaChart);
            setScatterChartDataGold(dataScatterChart)
            setPriceDistriBarChartDataGold(dataPriceDistriBarChart)
            setPriceDistriLineChartDataGold(dataPriceDistriLineChart)
            setProductsGold(products)
        }
        if(metal === Metal.SILVER) {
            setBarChartDataSilver(dataAvailaChart);
            setPriceDistriBarChartDataSilver(dataPriceDistriBarChart)
            setPriceDistriLineChartDataSilver(dataPriceDistriLineChart)
            setProductsSilver(products);
        }
        setLoading(false);
    }


    const getLinkCountForBarChart = () => {
        setLoading(true)
        getLinkCountAsDto().then((tmpLinkCount: LinkCountDto[]) => {
            setBarChartDataProductCount(
                getBarChartDataLinkCount(tmpLinkCount)
            )
            setLoading(false);
        })
    }

    useEffect(() => {
        const list = [Metal.GOLD, Metal.SILVER]
        for (const tmpMetal of list) {
            const productCache = localStorage.getItem(tmpMetal.toLowerCase())
            if (isEmpty(productCache)) {
                setLoading(true)
                getProductsByPages(tmpMetal).then((x: Product[]) =>
                    formatProducts(tmpMetal, x)
                );
            } else {
                formatProducts(tmpMetal, JSON.parse(productCache!))
            }
        }
        getLinkCountForBarChart();
        update();
    },[]);

    return (
        <Box sx={{width: 1}}>
            <TypographyPageTitle sx={{mb: '2rem'}}>
                Analytics
            </TypographyPageTitle>
            {/*<Typography>*/}
            {/*    {JSON.stringify(dbStats)}*/}
            {/*</Typography>*/}

            <TypographyH5BoldChart>Availability Gold products</TypographyH5BoldChart>
            <BarChartAvailability data={barChartDataGold}/>

            <TypographyH5BoldChart>Availability Silver products</TypographyH5BoldChart>
            <BarChartAvailability data={barChartDataSilver}/>

            <TypographyH5BoldChart>Gold product distribution</TypographyH5BoldChart>
            <BarChartPriceDistribution data={priceDistriBarChartDataGold}/>

            <TypographyH5BoldChart>Gold price/weight distribution function</TypographyH5BoldChart>
            <BoxChart sx={{pb: "1rem", pl: "1rem", mb: "4rem"}}>
                <LineChart width={1450} height={800}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="price_weight" type="number"
                           tickCount={47} domain={[1580, 2500]} allowDataOverflow={true}  />
                    <YAxis dataKey="share" type="number" tickCount={11} domain={[0, 1]}/>
                    {/*<Tooltip />*/}
                    <Legend />
                    {
                        // @ts-ignore
                        priceDistriLineChartDataGold.map((s) => (
                            <Line
                                connectNulls
                                strokeWidth={3}
                                type="monotone"
                                dot={false}
                                stroke={s.color}
                                dataKey="share" data={s.data} name={t(s.name.toLowerCase())} key={t(s.name.toLowerCase())}/>
                        ))
                    }
                </LineChart>
            </BoxChart>

            <TypographyH5BoldChart>Silver product distribution</TypographyH5BoldChart>
            <BarChartPriceDistribution data={priceDistriBarChartDataSilver}/>

            <TypographyH5BoldChart>Silver price/weight distribution function</TypographyH5BoldChart>
            <BoxChart sx={{pb: "1rem", pl: "1rem", mb: "4rem"}}>
                <LineChart width={1450} height={800}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="price_weight" type="number"
                           tickCount={64} domain={[8, 110]} allowDataOverflow={true} />
                    <YAxis dataKey="share" type="number"
                           tickCount={11} domain={[0, 1]}/>
                    {/*<Tooltip />*/}
                    <Legend />
                    {
                        // @ts-ignore
                        priceDistriLineChartDataSilver.map((s) => (
                            <Line
                                connectNulls
                                strokeWidth={3}
                                type="monotone"
                                dot={false}
                                stroke={s.color}
                                dataKey="share" data={s.data} name={t(s.name.toLowerCase())} key={t(s.name.toLowerCase())}/>
                        ))
                    }
                </LineChart>
            </BoxChart>

            {/*<ScatterChart*/}
            {/*    height={500}*/}
            {/*    series={*/}
            {/*        Object.values(Dealer).map(dealer => {*/}
            {/*                return {*/}
            {/*                    dataKey: dealer,*/}
            {/*                    label: t(dealer.toLowerCase()),*/}
            {/*                    color: chartDealersPre[dealer].color,*/}
            {/*                    data: scatterChartDataGold.map((v: ScatterChartData) => ({ y: v.weight, x: v.price_weight, id: v.id})),*/}
            {/*                }*/}
            {/*            },*/}
            {/*        )*/}
            {/*    }*/}
            {/*    sx={{*/}
            {/*        mb: 2,*/}
            {/*        width: '1'*/}
            {/*    }}*/}
            {/*    onItemClick={(event: any, d: any) => navigate('/product/id/' + scatterChartDataGold[d.dataIndex].product_id)}*/}
            {/*    grid={{ vertical: true, horizontal: true }}*/}
            {/*/>*/}

            <TypographyH5BoldChart>Scraping potential</TypographyH5BoldChart>
            <BarChart
                dataset={barChartDataProductCount}
                xAxis={[{ scaleType: 'band', dataKey: 'dealer' }]}
                yAxis={[{ label: 'URL count' }]}
                series={[
                    { dataKey: 'productCount', label: 'Scraped URL', color: 'black' },
                    { dataKey: 'linkWithoutProductCount', label: 'Unscraped URL', color: '#58a6f5' },
                ]}
                {...xChartsSetting}
            />
            {/*<BoxRow sx={{mb: 3}}>*/}
            {/*    <BoxChart sx={{width: 500, mr: 4}}>Some text</BoxChart>*/}
            {/*    <BoxChart sx={{width: 500, mr: 4}}>Some text</BoxChart>*/}
            {/*</BoxRow>*/}
        </Box>
    );
}
