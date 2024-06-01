import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import {compareStringAsDate, compareByPrice1} from "../../util/compare";
import {Price} from "../../types/Price";
import {getDealerImage} from "../../util/getImage";
import {getAvailabilityChipComponent, priceWithSpaces} from "../../util/utils";
import {BoxColumnCenter} from "../../components/BoxColumnCenter";
import {format} from "date-fns";

export const priceColumns: GridColDef[] = [
  {
    field: 'dealer',
    headerName: 'Dealer',
    headerClassName: 'isa-app--header',
    description: "",
    width: 140,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Price>) => (
        <BoxColumnCenter>
          <img src={getDealerImage(params.row.dealer)} alt=''/>
        </BoxColumnCenter>
    )
  },
  {
    field: 'priceDateTime',
    headerName: 'Price freshness',
    headerClassName: 'isa-app--header',
    description: "",
    width: 140,
    flex: 1,
    sortComparator: compareStringAsDate,
    valueGetter: (value, row: Price) => (
      format(row.priceDateTime, 'h:mm:ss a, dd.MM.yyyy')
    )
  },
  {
    field: 'price',
    headerName: 'Price',
    headerClassName: 'isa-app--header',
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
    headerClassName: 'isa-app--header',
    description: "",
    width: 140,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Price>) => (
      <b>{priceWithSpaces(Math.round(params.row.redemption!))} Kč</b>
    )
  },
  {
    field: 'availability',
    headerName: 'Availability',
    headerClassName: 'isa-app--header',
    align: "center",
    headerAlign: "center",
    sortable: false,
    width: 140,
    flex: 1,
    renderCell: (params: GridRenderCellParams<Price>) => (
        <>
          {getAvailabilityChipComponent(params.row.availability!)}
        </>
    )
  },
  {
    field: 'spread',
    headerName: 'Spread',
    headerClassName: 'isa-app--header',
    headerAlign: 'right',
    description: "",
    minWidth: 130,
    maxWidth: 130,
    align: 'right',
    flex: 1,
    sortComparator: compareByPrice1,
    valueGetter: (value, row: Price) => (
      `${ Math.round(row.spread*10_000)/100 } %`
    )
  },
  {
    field: 'pricePerGram',
    headerName: 'Price / Gram',
    headerClassName: 'isa-app--header',
    headerAlign: 'right',
    description: "",
    minWidth: 120,
    maxWidth: 120,
    align: 'right',
    flex: 1,
    sortComparator: compareByPrice1,
    valueGetter: (value, row: Price) => (
      `${ Math.round(row.pricePerGram*100)/100 } Kč/g`
    )
  },
];