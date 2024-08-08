import {BarChart} from "@mui/x-charts";
import * as React from "react";
import {xChartsSetting} from "../pages/AnalyticPage";
import {Price} from "../types/Price";
import {Dealer} from "../types/enums/dealer";
import {Availability} from "../types/enums/availability";

export interface BarChartData {
    dealer: string
    green: number
    orange: number
    red: number
    total: number
}

export const getBarChartData = (latestPrices: Price[]): BarChartData[] => {
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
