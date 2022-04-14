import {GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
import {Product} from "../../types/Product";
import React from "react";
import {compareByLatest, compareByRedemption, compareStringAsNumber} from "../../util/compare";

import {getImage} from "../../util/getImage";


export const productListColumns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    description: "",
    minWidth: 520,
    flex: 1,
    renderCell: (params: GridValueGetterParams<any, Product>) => (
      <a href={"http://localhost:3000/product/id/"+params.row.id}>{params.row.name}</a>
    )
  },
  {
    field: 'grams',
    headerName: 'Grams',
    description: "",
    maxWidth: 100,
    flex: 1,
    sortComparator: compareStringAsNumber,
    valueGetter: (params: GridValueGetterParams<any, Product>) => `${Math.round(params.row.grams*100)/100}`
  },
  {
    field: 'dealer',
    headerName: 'Dealer',
    description: "",
    minWidth: 130,
    flex: 1,
    sortable: false,
    renderCell: (params: GridValueGetterParams<any, Product>) => (
        <img src={getImage(params.row.latestPrices.sort(compareByLatest)[0]?.dealer)} alt='' />
    )
  },
  {
    field: 'price',
    headerName: 'Best Price',
    description: "",
    width: 30,
    flex: 1,
    sortComparator: compareStringAsNumber,
    valueGetter: (params: GridValueGetterParams<any, Product>) => (
        `${Math.round(params.row.latestPrices.sort(compareByLatest)[0]?.price)}`
    )
  },
  {
    field: 'dealer2',
    headerName: 'Dealer',
    description: "",
    minWidth: 130,
    flex: 1,
    sortable: false,
    renderCell: (params: GridValueGetterParams<any, Product>) => (
      <img src={getImage(params.row.latestPrices.sort(compareByRedemption)[0]?.dealer)} alt='' />
    )
  },
  {
    field: 'redemption',
    headerName: 'Best Redemption',
    description: "",
    width: 30,
    flex: 1,
    sortComparator: compareStringAsNumber,
    valueGetter: (params: GridValueGetterParams<any, Product>) => (
      `${Math.round(params.row.latestPrices.sort(compareByRedemption)[0]?.redemption)}`
    )
  },
]