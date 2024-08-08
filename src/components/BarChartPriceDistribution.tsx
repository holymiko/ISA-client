import {BarChart} from "@mui/x-charts";
import * as React from "react";
import {ScatterChartData, xChartsSetting} from "../pages/AnalyticPage";

export interface BarChartPriceDistriData {
    price: string
    count: number
}

const sortFce = (a: any, b: any) => {
    return a-b
}

export const getPriceDistriBarChartData = (batchSize: number, dataScatterChart: ScatterChartData[]): BarChartPriceDistriData[] => {
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

export const BarChartPriceDistribution = (props: any) => {
    return (
        <BarChart
            dataset={props.data}
            xAxis={[{ scaleType: 'band', dataKey: 'price' }]}
            yAxis={[{ label: 'Product count' }]}
            series={[{ dataKey: 'count', label: 'Number of products in range', color: props.color}]}
            {...xChartsSetting}
        />
  );
};
