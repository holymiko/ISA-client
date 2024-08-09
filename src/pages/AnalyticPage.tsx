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
import {axisClasses} from '@mui/x-charts/ChartsAxis';
import {BarChart, ScatterChart} from "@mui/x-charts";
import {TypographyH5BoldChart} from "../components/TypographyH5BoldChart";
import {useTranslation} from "react-i18next";
import {isEmpty} from "../util/utils";
import {getLinkCountAsDto} from "../services/linkService";
import {LinkCountDto} from "../types/LinkCountDto";
import {BarChartAvailability, BarChartData, getBarChartData} from "../components/BarChartAvailability";
import {
    BarChartPriceDistribution,
    BarChartPriceDistriData,
    getPriceDistriBarChartData
} from "../components/BarChartPriceDistribution";
import {
    getPriceDistriLineChartSeries,
    LineChartData,
    LineChartPriceDistribution
} from "../components/LineChartPriceDistribution";


export interface ScatterChartData {
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
            list.push({
                id: price.id,
                product_id: product.id,
                dealer: price.dealer,
                weight: product.grams,
                price: price.price,
                price_weight: price.pricePerGram
            })
    }))

    return list;
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
                tmpLinkCount
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
            <BarChartPriceDistribution data={priceDistriBarChartDataGold} color='#e8b923'/>

            <TypographyH5BoldChart>Gold price/weight distribution function</TypographyH5BoldChart>
            <LineChartPriceDistribution tickCount={47} domain={[1580, 2500]} data={priceDistriLineChartDataGold}/>

            <TypographyH5BoldChart>Silver product distribution</TypographyH5BoldChart>
            <BarChartPriceDistribution data={priceDistriBarChartDataSilver} color='#b3b3b3'/>

            <TypographyH5BoldChart>Silver price/weight distribution function</TypographyH5BoldChart>
            <LineChartPriceDistribution tickCount={64} domain={[22, 100]} data={priceDistriLineChartDataSilver}/>

            <TypographyH5BoldChart>Scraping potential</TypographyH5BoldChart>
            <BarChart
                dataset={barChartDataProductCount}
                xAxis={[{ scaleType: 'band', dataKey: 'dealer' }]}
                yAxis={[{ label: 'URL count' }]}
                series={[
                    { dataKey: 'productCount', label: 'Scraped URL', color: 'black' },
                    { dataKey: 'linkWithoutProductCount', label: 'Unscraped URL', color: '#ffcd29' },
                    { dataKey: 'hiddenProductCount', label: 'Hidden products', color: '#58a6f5' },
                ]}
                {...xChartsSetting}
            />

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

            {/*<BoxRow sx={{mb: 3}}>*/}
            {/*    <BoxChart sx={{width: 500, mr: 4}}>Some text</BoxChart>*/}
            {/*    <BoxChart sx={{width: 500, mr: 4}}>Some text</BoxChart>*/}
            {/*</BoxRow>*/}
        </Box>
    );
}
