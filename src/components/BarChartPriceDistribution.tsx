import {BarChart, BarChartProps} from "@mui/x-charts";
import * as React from "react";
import {xChartsSetting} from "../pages/AnalyticPage";
import {BoxProps} from "@mui/material/Box";

export interface BarChartPriceDistriData {
    price: string
    count: number
}

export const BarChartPriceDistribution = (props: any) => {
    return (
        <BarChart
            dataset={props.data}
            xAxis={[{ scaleType: 'band', dataKey: 'price' }]}
            yAxis={[{ label: 'Product count' }]}
            series={[{ dataKey: 'count', label: 'Number of products in range', color: '#e8b923'}]}
            {...xChartsSetting}
        />
  );
};
