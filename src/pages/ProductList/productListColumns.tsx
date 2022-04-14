import {GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
import {Product} from "../../types/Product";
import React from "react";
import {compareByPrice, compareByRedemption, compareStringAsNumber} from "../../util/compare";

import {getImage} from "../../util/getImage";
import {numberWithSpaces} from "../../util/utils";
import {formatProductName} from "../../util/normatProductName";

const pricesMinWidth = 40;
const pricesMaxWidth = 110;

export const productListColumns: GridColDef[] = [


  {
    field: 'name',
    headerName: 'Name',
    description: "",
    minWidth: 520,
    maxWidth: 520,
    flex: 1,
    renderCell: (params: GridValueGetterParams<any, Product>) => (
      // Change to react-router-dom Link
      <a href={"http://localhost:3000/product/id/"+params.row.id}>{ params.row.name != undefined ? formatProductName(params.row.name) : "undefined"}</a>
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
    valueGetter: (params: GridValueGetterParams<any, Product>) => `${Math.round(params.row.grams*100)/100}`
  },
  {
    field: 'price',
    headerName: 'Best Price Kč',
    headerAlign: 'right',
    align: 'right',
    minWidth: 180,
    maxWidth: 180,
    flex: 1,
    sortComparator: compareStringAsNumber,
    valueGetter: (params: GridValueGetterParams<any, Product>) => (
      Math.round(
            params.row.latestPrices.sort(compareByPrice)[0]?.price
        )
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
    headerName: 'Best Redemption Kč',
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
          params.row.latestPrices.sort(compareByRedemption)[0]?.redemption
        ))}`
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
]