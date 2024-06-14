import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
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
import {BoxColumnCenter} from "../../components/BoxColumnCenter";

const freshnessMinuteLimit = 120;

const getPriceFreshness = (prices: Price[]|undefined, isRedemptionPrice: boolean) => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - freshnessMinuteLimit);

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

export const productColumns: GridColDef[] = [
  {
    field: 'form1',
    headerName: 'Form',
    description: "",
    minWidth: 65,
    maxWidth: 65,
    sortable: false,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product>) => (
        <BoxColumnCenter>
          <img src={getFormImage(params.row.form, params.row.metal)} alt='' height={"85%"} />
        </BoxColumnCenter>
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
    headerName: 'Short name',
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
    headerName: 'Weight',
    headerAlign: 'right',
    align: 'right',
    minWidth: 78,
    maxWidth: 78,
    flex: 1,
    sortComparator: compareByPrice1,
    valueGetter: (value, row: Product) => `${Math.round(row.grams*100)/100} g`
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
    valueGetter: (value, row: Product) => `${row.latestPrices.length}`
  },
  {
    field: 'price',
    headerName: 'Best buy',
    headerAlign: 'right',
    align: 'right',
    minWidth: 140,
    maxWidth: 140,
    flex: 1,
    sortComparator: compareByPrice1,
    valueGetter: (value, row: Product) => (
      `${numberWithSpaces(
        Math.round(
            row.bestPrice?.price!
        ))} Kč`
    )
  },
  {
    field: 'priceFreshness',
    headerName: '',
    description: 'Price freshness indicator',
    headerAlign: 'center',
    align: 'center',
    sortable: false,
    disableColumnMenu: true,
    minWidth: 54,
    maxWidth: 54,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product>) => (
      <BoxColumnCenter sx={{pb: 0.25, pl: 0.8}}>
        {getPriceFreshness(params.row.latestPrices, false)}
      </BoxColumnCenter>
    )
  },
  {
    field: 'dealerPrice',
    headerName: 'Best buy dealer',
    description: "",
    minWidth: 160,
    maxWidth: 160,
    // align: 'center',
    sortable: false,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product>) => (
        <BoxColumnCenter>
          <img src={getDealerImage(params.row.bestPrice?.dealer)} alt='' />
        </BoxColumnCenter>
    )
  },
  {
    field: 'redemption',
    headerName: 'Best sell',
    headerAlign: 'right',
    description: "",
    minWidth: 130,
    maxWidth: 130,
    align: 'right',
    flex: 1,
    sortComparator: compareByPrice1,
    valueGetter: (value, row: Product) => (
        `${numberWithSpaces(
            Math.round(
                row.bestRedemption?.redemption!
            ))} Kč`
    )
  },
  {
    field: 'redemptionFreshness',
    headerName: '',
    description: 'Sell price freshness indicator',
    headerAlign: 'center',
    align: 'center',
    minWidth: 54,
    maxWidth: 54,
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product>) => (
        <BoxColumnCenter sx={{pb: 0.25, pl: 0.8}}>
          {getPriceFreshness(params.row.latestPrices, true)}
        </BoxColumnCenter>
    )
  },
  {
    field: 'dealerRedemption',
    headerName: 'Best sell dealer',
    description: "",
    minWidth: 150,
    maxWidth: 150,
    // align: 'center',
    sortable: false,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Product>) => (
        <BoxColumnCenter>
          <img src={getDealerImage(params.row.bestRedemption?.dealer)} alt=''/>
        </BoxColumnCenter>
    )
  },
  {
    field: '0',
    headerName: 'Ratio',
    headerAlign: 'right',
    description: "",
    minWidth: 110,
    maxWidth: 110,
    align: 'right',
    flex: 1,
    sortComparator: compareBySpread,
    valueGetter: (value, row) => {
      if (row.bestRedemption?.price === undefined || row.bestPrice?.price === undefined) {
        return '-';
      }
      if (row.bestPrice?.price === 0 || row.bestRedemption?.redemption === 0) {
        return '0';
      }
      const ratio = (row.bestRedemption?.redemption / row.bestPrice?.price - 1)*100

      return `${(ratio > 0 ? '+' : '') + ratio.toFixed(2)} %`;
    },
  },
  {
    field: '1',
    headerName: 'Buy / weight',
    headerAlign: 'right',
    description: "",
    minWidth: 120,
    maxWidth: 120,
    align: 'right',
    flex: 1,
    sortComparator: compareByPrice1,
    valueGetter: (value, row: Product) => {
      if (row.bestPrice?.price === undefined) {
        return '-';
      }
      if (row.bestPrice?.price === 0) {
        return '0';
      }
      return `${(row.bestPrice?.price! / row.grams).toFixed(2)} Kč/g`
    }
  },
  {
    field: '2',
    headerName: 'Sell / weight',
    headerAlign: 'right',
    description: "",
    minWidth: 120,
    maxWidth: 120,
    align: 'right',
    flex: 1,
    sortComparator: compareByPrice1,
    valueGetter: (value, row: Product) => {
      if (row.bestRedemption?.price === undefined) {
        return '-';
      }
      if (row.bestRedemption?.redemption === 0) {
        return '0';
      }
      return `${(row.bestRedemption?.redemption! / row.grams).toFixed(2)} Kč/g`
    }
  },


]