import * as React from "react";
import {BoxChart} from "./BoxChart";
import {CartesianGrid, Legend, Line, LineChart, XAxis, YAxis} from "recharts";
import {useTranslation} from "react-i18next";
import {chartDealersPre} from "../pages/product_detail/ProductDetailPage";
import {Dealer} from "../types/enums/dealer";
import {ScatterChartData} from "../pages/AnalyticPage";
import {SliderISA} from "./SliderISA";
import {useState} from "react";

export interface LineChartData {
    name: string,
    color: string,
    data: {
        price_weight: number,
        share: number,
    }[]
}

const sortFce2 = (a: ScatterChartData, b: ScatterChartData) => {
    return a.price_weight - b.price_weight
}

export const getPriceDistriLineChartSeries = (dataScatterChart: ScatterChartData[]): LineChartData[] => {
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

export const LineChartPriceDistribution = (props: any) => {
    const { t } = useTranslation();
    // @ts-ignore
    const [domain, setDomain] = useState<[]>([props.min, props.max])

    return (
        <BoxChart sx={{pb: "1rem", pl: "1rem", mb: "4rem"}}>
            <LineChart width={1450} height={800}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="price_weight" type="number"
                       tickCount={Math.floor((domain.at(1)! - domain.at(0)!)/props.stepChart + 1)} domain={domain} allowDataOverflow={true}  />
                <YAxis dataKey="share" type="number" tickCount={11} domain={[0, 1]}/>
                {/*<Tooltip />*/}
                <Legend />
                {
                    // @ts-ignore
                    props.data.map((s) => (
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
            <SliderISA domain={domain} setDomain={setDomain} min={props.min} max={props.max} stepLabel={props.stepSliderLabel} stepMark={props.stepSliderMark}/>
        </BoxChart>
  );
};
