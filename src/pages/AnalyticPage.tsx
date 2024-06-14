import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {TypographyPageTitle} from "../components/TypographyPageTitle";
import {getBackendVersion, getDbStats} from "../services/appInfoService";
import {getProductsAsDTO} from "../services/productService";
import {Form} from "../types/enums/form";
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

interface BarChartData {
    dealer: string
    green: number
    orange: number
    red: number
    total: number
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

const barChartSetting = {
    width: 1000,
    height: 340,
    sx: {
        mb: 2,
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
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



export const AnalyticPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [row, setRow] = useState<any>([]);
    const [productsGold, setProductsGold] = useState<Product[]>([])
    const [productsSilver, setProductsSilver] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [barChartDataGold, setBarChartDataGold] = useState<any[]>([])
    const [barChartDataSilver, setBarChartDataSilver] = useState<any[]>([])
    const [barChartDataProductCount, setBarChartDataProductCount] = useState<any[]>([])
    const [scatterChartDataGold, setScatterChartDataGold] = useState<any[]>([])
    const [scatterChartDataSilver, setScatterChartDataSilver] = useState<any[]>([])

    const [dbStats, setDbStats] = useState<any>();
    const [version, setVersion] = useState<string>("");

    const update = () => {
        getDbStats().then((x) => {
            setDbStats(x.data)
            setRow([
                {
                    name: "Silverum",
                    linkWithProduct: x.data.linksWithProductSilverum,
                    totalLinks: x.data.linksSilverum,
                    share: x.data.linksWithProductSilverum / x.data.linksSilverum
                }
            ])
        });
        getBackendVersion().then((x) => setVersion(x.data));
    }

    const formatProducts = (metal: Metal, products: Product[]) => {
        const latestPrices: Price[] = products.flatMap(x => x.latestPrices);
        const dataBarChart: BarChartData[] = getBarChartData(latestPrices);
        const dataScatterChart: ScatterChartData[] = getScatterChartData(products);

        if(metal === Metal.GOLD) {
            setBarChartDataGold(dataBarChart);
            setScatterChartDataGold(dataScatterChart)
            setProductsGold(products)
        }
        if(metal === Metal.SILVER) {
            setBarChartDataSilver(dataBarChart);
            setScatterChartDataSilver(dataScatterChart)
            setProductsSilver(products);
        }
        setLoading(false);
    }

    const getProducts = (metal: Metal) => {
        setLoading(true)
        getProductsAsDTO(
            undefined,
            undefined,
            metal,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined
        ).then((page) => {
            let formSet = new Set<Form>();
            const tmpProducts: Product[] = page.content;
            // let tmpMaxPrice: number = 0;
            // tmpProducts.forEach(
            //     product => {
            //         formSet.add(product.form);
            //         product.bestPrice = product.latestPrices.sort(compareByPrice)[0];
            //         product.bestRedemption = product.latestPrices.sort(compareByRedemption)[0];
            //         if(product.bestPrice.price > tmpMaxPrice) {
            //             tmpMaxPrice = product.bestPrice.price;
            //         }
            //     }
            // )
            formatProducts(metal, tmpProducts)
        });
    }

    const getLinkCount = () => {
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
                getProducts(tmpMetal);
            } else {
                formatProducts(tmpMetal, JSON.parse(productCache!))
            }
        }
        getLinkCount();
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
            <BarChart
                dataset={barChartDataGold}
                xAxis={[{ scaleType: 'band', dataKey: 'dealer' }]}
                yAxis={[{ label: 'Product count', max: 400 }]}
                series={[
                    { dataKey: 'green', label: 'In stock', color: 'green' },
                    { dataKey: 'orange', label: 'Preorder', color: '#f5a511' },
                    { dataKey: 'red', label: 'Unavailable', color: 'red' },
                    { dataKey: 'total', label: 'Total', color: 'black' },
                ]}
                {...barChartSetting}
            />
            <TypographyH5BoldChart>Availability Silver products</TypographyH5BoldChart>
            <BarChart
                dataset={barChartDataSilver}
                xAxis={[{ scaleType: 'band', dataKey: 'dealer' }]}
                yAxis={[{ label: 'Product count', max: 400 }]}
                series={[
                    { dataKey: 'green', label: 'In stock', color: 'green' },
                    { dataKey: 'orange', label: 'Preorder', color: '#f5a511' },
                    { dataKey: 'red', label: 'Unavailable', color: 'red' },
                    { dataKey: 'total', label: 'Total', color: 'black' },
                ]}
                {...barChartSetting}
            />

            <TypographyH5BoldChart>Scraping potential</TypographyH5BoldChart>
            <BarChart
                dataset={barChartDataProductCount}
                xAxis={[{ scaleType: 'band', dataKey: 'dealer' }]}
                yAxis={[{ label: 'URL count' }]}
                series={[
                    { dataKey: 'productCount', label: 'Scraped URL', color: 'black' },
                    { dataKey: 'linkWithoutProductCount', label: 'Unscraped URL', color: '#58a6f5' },
                ]}
                {...barChartSetting}
            />

            <TypographyH5BoldChart>Distribution Gold price</TypographyH5BoldChart>
            <ScatterChart
                height={500}
                series={
                    Object.values(Dealer).map(dealer => {
                            return {
                                label: t(dealer.toLowerCase()),
                                color: chartDealersPre[Dealer[dealer]].color,
                                data: scatterChartDataGold.map((v: ScatterChartData) => ({ y: v.weight, x: v.price_weight, id: v.id})),
                            }
                        },
                    )

                }
                sx={{
                    mb: 2,
                    width: '1'
                }}
                onItemClick={(event: any, d: any) => navigate('/product/id/' + scatterChartDataGold[d.dataIndex].product_id)}
                grid={{ vertical: true, horizontal: true }}
            />

            <TypographyH5BoldChart>Distribution Silver price</TypographyH5BoldChart>
            <ScatterChart
                height={500}
                series={
                    Object.values(Dealer).map(dealer => {
                            return {
                                label: t(dealer.toLowerCase()),
                                color: chartDealersPre[Dealer[dealer]].color,
                                data: scatterChartDataSilver.map((v: ScatterChartData) => ({ y: v.weight, x: v.price_weight, id: v.id})),
                            }
                        },
                    )
                }
                sx={{
                    mb: 2,
                    width: '1'
                }}
                onItemClick={(event: any, d: any) => navigate('/product/id/' + scatterChartDataSilver[d.dataIndex].product_id)}
                grid={{ vertical: true, horizontal: true }}
            />
        </Box>
    );
}
