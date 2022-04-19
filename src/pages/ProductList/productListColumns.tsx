import {GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
import {Product} from "../../types/Product";
import React from "react";
import {compareByPrice, compareByRedemption, compareStringAsNumber} from "../../util/compare";

import {getImage} from "../../util/getImage";
import {numberWithSpaces} from "../../util/utils";
import {formatProductName} from "../../util/formatProductName";
import {Link} from "react-router-dom";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import ErrorIcon from '@mui/icons-material/Error';
import {Price} from "../../types/Price";

const pricesMinWidth = 40;
const pricesMaxWidth = 110;
const freshnessMinuteLimit = 60;


const getPriceFreshness = (prices: Price[]|undefined, isRedemptionPrice: boolean) => {
  const d = new Date();
  d.setMinutes(d.getMinutes()-freshnessMinuteLimit);

  if(prices === undefined || prices.length === 0) {
    return <ErrorIcon/>
  }

  const freshPrices: number = isRedemptionPrice
    ? prices.filter(
      x => d.getTime() < new Date(x.redemptionDateTime).getTime()
    ).length
    : prices.filter(
      x => d.getTime() < new Date(x.priceDateTime).getTime()
    ).length

  if(freshPrices === prices.length) {
    return <CheckCircleIcon sx={{color: 'green'}}/>
  } else if(freshPrices === 0) {
    return <CancelIcon sx={{color: 'red'}}/>
  } else {
    return <DoNotDisturbOnIcon sx={{color: 'orange'}}/>
  }
};

/* TODO
    Add column for each price signifying price is up to date. Green check / Red cross
    Place this column between price and logo
    Add variable defining the freshness of price (amount of time to be up to date)
*/
export const productListColumns: GridColDef[] = [
  {
    field: 'metal',
    headerName: 'Metal',
    description: "",
    minWidth: 80,
    maxWidth: 80,
    flex: 1,
    valueGetter: (params: GridValueGetterParams<any, Product>) => (
        `${params.row.metal}`
    )
  },
  {
    field: 'form',
    headerName: 'Form',
    description: "",
    minWidth: 120,
    maxWidth: 120,
    flex: 1,
    valueGetter: (params: GridValueGetterParams<any, Product>) => (
        `${params.row.form}`
    )
  },
  {
    field: 'name',
    headerName: 'Name',
    description: "",
    minWidth: 400,
    maxWidth: 400,
    flex: 1,
    renderCell: (params: GridValueGetterParams<any, Product>) => (
      <Link to={"/product/id/"+params.row.id}>
        {params.row.name != undefined ? formatProductName(params.row.name) : "undefined"}
      </Link>
    )
  },
  {
    field: 'grams',
    headerName: 'Grams',
    headerAlign: 'right',
    align: 'right',
    minWidth: 80,
    maxWidth: 80,
    flex: 1,
    sortComparator: compareStringAsNumber,
    valueGetter: (params: GridValueGetterParams<any, Product>) => `${Math.round(params.row.grams*100)/100} g`
  },
  {
    field: 'price',
    headerName: 'Best Price',
    headerAlign: 'right',
    align: 'right',
    minWidth: 180,
    maxWidth: 180,
    flex: 1,
    sortComparator: compareStringAsNumber,
    valueGetter: (params: GridValueGetterParams<any, Product>) => (
      `${numberWithSpaces(
        Math.round(
            params.row.bestPrice?.price!
        ))} Kč`
    )

  },
  {
    field: 'priceFreshness',
    headerName: 'Freshness',
    headerAlign: 'center',
    align: 'center',
    minWidth: 80,
    maxWidth: 80,
    flex: 1,
    renderCell: (params: GridValueGetterParams<any, Product>) => (
      <>
        {getPriceFreshness(params.row.latestPrices, false)}
      </>
    )
  },
  {
    field: 'dealerPrice',
    headerName: 'Dealer Best Price',
    description: "",
    minWidth: 130,
    maxWidth: 130,
    // align: 'center',
    flex: 1,
    sortable: false,
    renderCell: (params: GridValueGetterParams<any, Product>) => (
      <img src={getImage(params.row.latestPrices.sort(compareByPrice)[0]?.dealer)} alt='' />
    )
  },
  {
    field: 'redemption',
    headerName: 'Best Redemption',
    headerAlign: 'right',
    description: "",
    minWidth: 180,
    maxWidth: 180,
    align: 'right',
    flex: 1,
    sortComparator: compareStringAsNumber,
    valueGetter: (params: GridValueGetterParams<any, Product>) => (
      `${numberWithSpaces(
        Math.round(
          params.row.bestRedemption?.redemption!
        ))} Kč`
    )
  },
  {
    field: 'redemptionFreshness',
    headerName: 'Freshness',
    headerAlign: 'center',
    align: 'center',
    maxWidth: 80,
    flex: 1,
    renderCell: (params: GridValueGetterParams<any, Product>) => (
      <>
        {getPriceFreshness(params.row.latestPrices, true)}
      </>
    )
  },
  {
    field: 'dealerRedemption',
    headerName: 'Dealer Best Redemption',
    description: "",
    minWidth: 180,
    maxWidth: 180,
    // align: 'center',
    flex: 1,
    sortable: false,
    renderCell: (params: GridValueGetterParams<any, Product>) => (
      <img src={getImage(params.row.latestPrices.sort(compareByRedemption)[0]?.dealer)} alt='' />
    )
  },
  {
    field: 'Best spread',
    headerName: 'Best Spread',
    headerAlign: 'right',
    description: "",
    minWidth: 130,
    maxWidth: 130,
    align: 'right',
    flex: 1,
    sortComparator: compareStringAsNumber,
    valueGetter: (params: GridValueGetterParams<any, Product>) => (
      `${ params.row.bestRedemption?.price != undefined && params.row.bestPrice?.price != undefined && params.row.bestPrice?.price != 0
            ? Math.round((params.row.bestRedemption?.redemption / params.row.bestPrice?.price)*10_000)/100
            : 0
        } %`
    )
  },
  {
    field: 'pricePerGram',
    headerName: 'Price / Gram',
    headerAlign: 'right',
    description: "",
    minWidth: 120,
    maxWidth: 120,
    align: 'right',
    flex: 1,
    sortComparator: compareStringAsNumber,
    valueGetter: (params: GridValueGetterParams<any, Product>) => (
      `${ params.row.bestPrice?.price != undefined
            ? Math.round((params.row.bestPrice?.price! / params.row.grams)*100)/100
            : '-'
        } Kč/g`
    )
  },

]