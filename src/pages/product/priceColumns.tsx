import {GridColDef, GridRenderCellParams, GridValueGetterParams} from "@mui/x-data-grid";
import {compareStringAsDate, compareByPrice1} from "../../util/compare";
import {Price} from "../../types/Price";
import {getDealerImage} from "../../util/getImage";
import moment from "moment/moment";
import {priceWithSpaces} from "../../util/utils";

export const priceColumns: GridColDef[]  = [
  {
    field: 'dealer',
    headerName: 'Dealer',
    description: "",
    width: 140,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Price>) => (
      <img src={getDealerImage(params.row.dealer)} alt=''/>
    )
  },
  {
    field: 'priceDateTime',
    headerName: 'Price freshness',
    description: "",
    width: 140,
    flex: 1,
    sortComparator: compareStringAsDate,
    valueGetter: (params: GridValueGetterParams<any, Price>) => (
      moment(params.row.priceDateTime).format('h:mm:ss a, DD.MM.YYYY')
    )
  },
  {
    field: 'price',
    headerName: 'Price',
    description: "",
    width: 140,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Price>) => (
      <b>{priceWithSpaces(Math.round(params.row.price!/* * 100)/100*/))} Kč</b>
    )
  },
  // {
  //   field: 'redemptionDateTime',
  //   headerName: 'Buyout freshness',
  //   description: "",
  //   width: 140,
  //   flex: 1,
  //   sortComparator: compareStringAsDate,
  //   valueGetter: (params: GridValueGetterParams<any, Price>) => (
  //       moment(params.row.priceDateTime).format('h:mm:ss a, DD.MM.YYYY')
  //   )
  // },
  {
    field: 'redemption',
    headerName: 'Buy out',
    description: "",
    width: 140,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Price>) => (
      <b>{priceWithSpaces(Math.round(params.row.redemption!))} Kč</b>
    )
  },
  {
    field: 'spread',
    headerName: 'Spread',
    headerAlign: 'right',
    description: "",
    minWidth: 130,
    maxWidth: 130,
    align: 'right',
    flex: 1,
    sortComparator: compareByPrice1,
    valueGetter: (params: GridValueGetterParams<any, Price>) => (
      `${ Math.round(params.row.spread*10_000)/100 } %`
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
    valueGetter: (params: GridValueGetterParams<any, Price>) => (
      `${ Math.round(params.row.pricePerGram*100)/100 } Kč/g`
    )
  },
];