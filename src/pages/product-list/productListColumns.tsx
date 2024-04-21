import {GridColDef, GridRenderCellParams, GridValueGetterParams} from "@mui/x-data-grid";
import {Product} from "../../types/Product";
import React from "react";
import {compareByPrice1, compareBySpread} from "../../util/compare";
import {getDealerImage, getFormImage} from "../../util/getImage";
import {numberWithSpaces} from "../../util/utils";
import {formatProductName} from "../../util/formatProductName";
import {Link} from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import ErrorIcon from '@mui/icons-material/Error';
import {Price} from "../../types/Price";

const freshnessMinuteLimit = 180; // VPS is using UTC (-1h)

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

export const productListColumns: GridColDef[] = [
  {
    field: 'form1',
    headerName: 'Form',
    description: "",
    minWidth: 65,
    maxWidth: 65,
    sortable: false,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product>) => (
        <img src={getFormImage(params.row.form, params.row.metal)} alt='' height={"85%"} />
    )
  },
  {
    field: 'name',
    headerName: 'Name',
    description: "",
    minWidth: 330,
    maxWidth: 330,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product>) => (
      <Link to={"/product/id/"+params.row.id}>
        {params.row.name !== undefined ? params.row.name : "undefined"}
      </Link>
    )
  },
  {
    field: 'shortName',
    headerName: 'Short Name',
    description: "",
    minWidth: 330,
    maxWidth: 330,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product>) => (
        <Link to={"/product/id/"+params.row.id}>
          {params.row.name !== undefined ? formatProductName(params.row.name) : "undefined"}
        </Link>
    )
  },
  {
    field: 'grams',
    headerName: 'Grams',
    headerAlign: 'right',
    align: 'right',
    minWidth: 78,
    maxWidth: 78,
    flex: 1,
    sortComparator: compareByPrice1,
    valueGetter: (params: GridValueGetterParams<any, Product>) => `${Math.round(params.row.grams*100)/100} g`
  },
  {
    field: '#',
    headerName: '#',
    headerAlign: 'center',
    description: 'Number of sources',
    align: 'center',
    minWidth: 57,
    maxWidth: 57,
    disableColumnMenu: true,
    flex: 1,
    valueGetter: (params: GridValueGetterParams<any, Product>) => `${params.row.latestPrices.length}`
  },
  {
    field: 'price',
    headerName: 'Best Price',
    headerAlign: 'right',
    align: 'right',
    minWidth: 150,
    maxWidth: 150,
    flex: 1,
    sortComparator: compareByPrice1,
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
    description: 'Price freshness indicator',
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true,
    minWidth: 50,
    maxWidth: 50,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product>) => (
      <>
        {getPriceFreshness(params.row.latestPrices, false)}
      </>
    )
  },
  {
    field: 'dealerPrice',
    headerName: 'Best Price Dealer',
    description: "",
    minWidth: 160,
    maxWidth: 160,
    // align: 'center',
    sortable: false,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product>) => (
      <img src={getDealerImage(params.row.bestPrice?.dealer)} alt='' />
    )
  },
  {
    field: 'redemption',
    headerName: 'Best Buyout',
    headerAlign: 'right',
    description: "",
    minWidth: 140,
    maxWidth: 140,
    align: 'right',
    flex: 1,
    sortComparator: compareByPrice1,
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
    description: 'Buyout freshness indicator',
    headerAlign: 'center',
    align: 'center',
    minWidth: 50,
    maxWidth: 50,
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product>) => (
      <>
        {getPriceFreshness(params.row.latestPrices, true)}
      </>
    )
  },
  {
    field: 'dealerRedemption',
    headerName: 'Best Buyout dealer',
    description: "",
    minWidth: 170,
    maxWidth: 170,
    // align: 'center',
    sortable: false,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product>) => (
      <img src={getDealerImage(params.row.bestRedemption?.dealer)} alt=''/>
    )
  },
  {
    field: 'Best spread',
    headerName: 'Best Spread',
    headerAlign: 'right',
    description: "",
    minWidth: 120,
    maxWidth: 120,
    align: 'right',
    flex: 1,
    sortComparator: compareBySpread,
    valueGetter: (params: GridValueGetterParams<any, Product>) => (
      `${ params.row.bestRedemption?.price !== undefined && params.row.bestPrice?.price !== undefined && params.row.bestPrice?.price !== 0
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
    sortComparator: compareByPrice1,
    valueGetter: (params: GridValueGetterParams<any, Product>) => (
      `${ params.row.bestPrice?.price !== undefined
            ? Math.round((params.row.bestPrice?.price! / params.row.grams)*100)/100
            : '-'
        } Kč/g`
    )
  },

]