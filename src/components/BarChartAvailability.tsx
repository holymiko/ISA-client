import {BarChart, BarChartProps} from "@mui/x-charts";
import * as React from "react";
import {xChartsSetting} from "../pages/AnalyticPage";
import {BoxProps} from "@mui/material/Box";

export interface BarChartData {
    dealer: string
    green: number
    orange: number
    red: number
    total: number
}

export const BarChartAvailability = (props: any) => {
    return (
      <BarChart
          // @ts-ignore
          dataset={props.data}
          xAxis={[{ scaleType: 'band', dataKey: 'dealer' }]}
          yAxis={[{ label: 'Product count', max: 400 }]}
          series={[
            { dataKey: 'green', label: 'In stock', color: 'green' },
            { dataKey: 'orange', label: 'Preorder', color: '#f5a511' },
            { dataKey: 'red', label: 'Unavailable', color: 'red' },
            { dataKey: 'total', label: 'Total', color: 'black' },
          ]}
          {...xChartsSetting}
      />
  );
};
