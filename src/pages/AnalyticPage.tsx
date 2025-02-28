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
import {BarChart} from "@mui/x-charts";
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
import {Filter, FilterAvailability, FilterDealer, FilterForm, filterProducts, initFilter} from "../components/Filter";
import {DealerStats, formatPrices, getMedian} from "../components/DealerStats";
import {BoxRow} from "../components/BoxRow";
import {FilterCollapseItem} from "../components/FilterCollapseItem";


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



const COEF_WINDOW_WIDTH = 380
const COEF_WINDOW_HEIGHT = 270


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
    const [latestPricesGold, setLatestPricesGold] = useState<Price[]>([])
    const [latestPricesSilver, setLatestPricesSilver] = useState<Price[]>([])

    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(500000);
    const [filterForms, setFilterForms] = useState<FilterForm[]>([])
    const [filterDealers, setFilterDealers] = useState<FilterDealer[]>([])
    const [filterAvailability, setFilterAvailability] = useState<FilterAvailability[]>([])
    const [excludeUnavailable, setExcludeUnavailable] = useState<boolean>(true);
    const [filterIsTopProduct, setFilterIsTopProduct] = useState<boolean>(true);

    const [openDealerStatsGold, setOpenDealerStatsGold] = useState<boolean>(true);
    const [openDealerStatsSilver, setOpenDealerStatsSilver] = useState<boolean>(true);
    const [openLineChartGold, setOpenLineChartGold] = useState<boolean>(true);
    const [openLineChartSilver, setOpenLineChartSilver] = useState<boolean>(true);
    const [openAvailGold, setOpenAvailGold] = useState<boolean>(true);
    const [openAvailSilver, setOpenAvailSilver] = useState<boolean>(true);
    const [openBarPriceGold, setOpenBarPriceGold] = useState<boolean>(true);
    const [openBarPriceSilver, setOpenBarPriceSilver] = useState<boolean>(true);
    const [openScrapingPotential, setOpenScrapingPotential] = useState<boolean>(true);

    const [dbStats, setDbStats] = useState<any>();
    const [version, setVersion] = useState<string>("");

    const formatProducts = (metal: Metal|undefined, products: Product[]) => {
        const tmpProducts = filterProducts(products, minPrice, maxPrice, filterForms, filterDealers, filterAvailability, excludeUnavailable, filterIsTopProduct)
        if(tmpProducts.length === 0) {
            return;
        }

        const latestPrices: Price[] = tmpProducts.flatMap(x => x.latestPrices);
        const dataAvailaChart: BarChartData[] = getBarChartData(latestPrices);
        const dataScatterChart: ScatterChartData[] = getScatterChartData(tmpProducts);
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
            setLatestPricesGold(latestPrices)
        }
        if(metal === Metal.SILVER) {
            setBarChartDataSilver(dataAvailaChart);
            setPriceDistriBarChartDataSilver(dataPriceDistriBarChart)
            setPriceDistriLineChartDataSilver(dataPriceDistriLineChart)
            setProductsSilver(products);
            setLatestPricesSilver(latestPrices)
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
        const tmpProducts = [];
        for (const tmpMetal of list) {
            const productCache = localStorage.getItem(tmpMetal.toLowerCase())
            if (isEmpty(productCache)) {
                setLoading(true)
                getProductsByPages(tmpMetal, undefined).then((x: Product[]) => {
                    formatProducts(tmpMetal, x);
                    tmpProducts.push(...x)
                });
            } else {
                const x = JSON.parse(productCache!);
                formatProducts(tmpMetal, x)
                tmpProducts.push(...x)
            }
        }
        initFilter(tmpProducts, {
            setMinPrice, setMaxPrice, setFilterForms, setFilterDealers,
            setFilterAvailability, setExcludeUnavailable, setFilterIsTopProduct
        })
        getLinkCountForBarChart();
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
    },[]);

    useEffect(() => {
        formatProducts(Metal.GOLD, productsGold);
        formatProducts(Metal.SILVER, productsSilver);
    }, [minPrice, maxPrice, filterForms, filterDealers, filterAvailability, excludeUnavailable])

    useEffect(() => {
        localStorage.setItem('filterMinPrice', JSON.stringify(minPrice));
    }, [minPrice])

    useEffect(() => {
        localStorage.setItem('filterMaxPrice', JSON.stringify(maxPrice));
    }, [maxPrice])

    useEffect(() => {
        localStorage.setItem('filterForms', JSON.stringify(filterForms));
    }, [filterForms])

    useEffect(() => {
        localStorage.setItem('filterDealers', JSON.stringify(filterDealers));
    }, [filterDealers])

    useEffect(() => {
        localStorage.setItem('filterAvailability', JSON.stringify(filterAvailability));
    }, [filterAvailability])

    useEffect(() => {
        localStorage.setItem('filterExcludeUnavailable', JSON.stringify(excludeUnavailable));
    }, [excludeUnavailable])

    useEffect(() => {
        localStorage.setItem('filterIsTopProduct', JSON.stringify(filterIsTopProduct));
    }, [filterIsTopProduct])

    return (
        <Box sx={{width: 1}}>
            <TypographyPageTitle sx={{mb: '2rem'}}>
                Analytics
            </TypographyPageTitle>

            {/*<Typography>*/}
            {/*    {JSON.stringify(dbStats)}*/}
            {/*</Typography>*/}

            <Filter
                minPrice={minPrice} setMinPrice={setMinPrice}
                maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                filterForms={filterForms} setFilterForms={setFilterForms}
                filterDealers={filterDealers} setFilterDealers={setFilterDealers}
                filterAvailability={filterAvailability} setFilterAvailability={setFilterAvailability}
                excludeUnavailable={excludeUnavailable} setExcludeUnavailable={setExcludeUnavailable}
                isTopProduct={filterIsTopProduct} setIsTopProduct={setFilterIsTopProduct}
            />

            <FilterCollapseItem title="Gold - Dealer statistics" openFilter={openDealerStatsGold} setOpenFilter={setOpenDealerStatsGold}>
                <BoxRow sx={{flexWrap: 'wrap', mb: '2rem'}}>
                    {filterDealers.filter(
                        (x) => x.checked
                    ).map((x) => {
                        const sortedPricePerGram = formatPrices(x.value, latestPricesGold)
                        x.median = getMedian(sortedPricePerGram)
                        x.sortedPricePerGram = sortedPricePerGram
                        return x
                    }).sort(
                        // Sort by median
                        (a, b) => a.median - b.median)
                    .map((x) =>
                        // Create JSX.Element
                        <DealerStats
                            dealer={x.value}
                            latestPricePerGram={x.sortedPricePerGram}/>
                    )}
                </BoxRow>
            </FilterCollapseItem>

            <FilterCollapseItem title="Gold - Cumulative distribution function price per gram" openFilter={openLineChartGold} setOpenFilter={setOpenLineChartGold}>
                <LineChartPriceDistribution
                    height={window.innerHeight-COEF_WINDOW_HEIGHT} width={window.innerWidth-COEF_WINDOW_WIDTH}
                    min={1500} max={2500}
                    stepSlider={25} stepSliderLabel={100}
                    stepChart={50}
                    data={priceDistriLineChartDataGold}
                />
            </FilterCollapseItem>

            <FilterCollapseItem title="Gold - Bar chart price distribution" openFilter={openBarPriceGold} setOpenFilter={setOpenBarPriceGold}>
                <BarChartPriceDistribution data={priceDistriBarChartDataGold} color='#e8b923'/>
            </FilterCollapseItem>

            <FilterCollapseItem title="Silver - Dealer statistics" openFilter={openDealerStatsSilver} setOpenFilter={setOpenDealerStatsSilver}>
                <BoxRow sx={{flexWrap: 'wrap', mb: '2rem'}}>
                    {filterDealers.filter(
                        (x) => x.checked
                    ).map((x) => {
                        const sortedPricePerGram = formatPrices(x.value, latestPricesSilver)
                        x.median = getMedian(sortedPricePerGram)
                        x.sortedPricePerGram = sortedPricePerGram
                        return x
                    }).sort(
                        // Sort by median
                        (a, b) => a.median - b.median)
                        .map((x) =>
                            // Create JSX.Element
                            <DealerStats
                                dealer={x.value}
                                latestPricePerGram={x.sortedPricePerGram}/>
                        )}
                </BoxRow>
            </FilterCollapseItem>

            <FilterCollapseItem title="Silver - Cumulative distribution function price per gram" openFilter={openLineChartSilver} setOpenFilter={setOpenLineChartSilver}>
                <LineChartPriceDistribution
                    height={window.innerHeight-COEF_WINDOW_HEIGHT} width={window.innerWidth-COEF_WINDOW_WIDTH}
                    min={22} max={100}
                    stepSlider={2} stepSliderLabel={4}
                    stepChart={2}
                    data={priceDistriLineChartDataSilver}
                />
            </FilterCollapseItem>

            <FilterCollapseItem title="Silver - Bar chart price distribution" openFilter={openBarPriceSilver} setOpenFilter={setOpenBarPriceSilver}>
                <BarChartPriceDistribution data={priceDistriBarChartDataSilver} color='#b3b3b3'/>
            </FilterCollapseItem>

            <FilterCollapseItem title="Gold - Availability" openFilter={openAvailGold} setOpenFilter={setOpenAvailGold}>
                <BarChartAvailability data={barChartDataGold}/>
            </FilterCollapseItem>

            <FilterCollapseItem title="Silver - Availability" openFilter={openAvailSilver} setOpenFilter={setOpenAvailSilver}>
                <BarChartAvailability data={barChartDataSilver}/>
            </FilterCollapseItem>

            <FilterCollapseItem title="Scraping potential" openFilter={openScrapingPotential} setOpenFilter={setOpenScrapingPotential}>
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
            </FilterCollapseItem>

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