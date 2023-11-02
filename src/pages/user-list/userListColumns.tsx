import {GridColDef, GridRenderCellParams, GridValueGetterParams} from "@mui/x-data-grid";
import React from "react";
import {PersonAccountDto} from "../../models/user";
import KeyIcon from '@mui/icons-material/Key';
import LockResetIcon from '@mui/icons-material/LockReset';
import {Product} from "../../types/Product";
import Box from "@mui/material/Box";
import ClearIcon from '@mui/icons-material/Clear';

export const userListColumns: GridColDef[] = [
  {
    field: 'role',
    headerName: 'Role',
    headerAlign: 'center',
    align: 'center',
    minWidth: 150,
    maxWidth: 150,
    flex: 1,
    valueGetter: (params: GridValueGetterParams<any, PersonAccountDto>) => `${params.row.account?.role}`
  },
  {
    field: 'username',
    headerName: 'User name',
    headerAlign: 'center',
    align: 'center',
    minWidth: 200,
    maxWidth: 200,
    flex: 1,
    valueGetter: (params: GridValueGetterParams<any, PersonAccountDto>) => `${params.row.account?.username}`
  },
  {
    field: 'firstName',
    headerName: 'First name',
    headerAlign: 'center',
    align: 'center',
    minWidth: 140,
    maxWidth: 140,
    disableColumnMenu: true,
    flex: 1,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    headerAlign: 'center',
    align: 'center',
    minWidth: 140,
    maxWidth: 140,
    disableColumnMenu: true,
    flex: 1,
  },
  {
    field: 'email',
    headerName: 'Email',
    headerAlign: 'center',
    align: 'center',
    minWidth: 240,
    maxWidth: 240,
    disableColumnMenu: true,
    flex: 1,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    headerAlign: 'center',
    align: 'center',
    minWidth: 240,
    disableColumnMenu: true,
    flex: 1,
    sortable: false,
    renderCell: (params: GridRenderCellParams<Product>) => (
        <Box sx={{gap: 2, width: 1.0, display: 'flex', justifyContent: 'center'}}>
          <KeyIcon />
          <LockResetIcon />
          <ClearIcon />
        </Box>
    )
  },


]