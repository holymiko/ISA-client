import {GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import React from "react";
import {PersonAccountDto} from "../../types/PersonAccountDto";
import KeyIcon from '@mui/icons-material/Key';
import LockResetIcon from '@mui/icons-material/LockReset';
import Box from "@mui/material/Box";
import DeleteIcon from '@mui/icons-material/Delete';
import {deleteAccount} from "../../services/userService";
import {IconButton, Tooltip} from "@mui/material";
import {BoxColumnCenter} from "../../components/BoxColumnCenter";

export const userColumns: GridColDef[] = [
  {
    field: 'role',
    headerName: 'Role',
    headerAlign: 'center',
    align: 'center',
    minWidth: 150,
    maxWidth: 150,
    flex: 1,
    valueGetter: (value, row: PersonAccountDto) => `${row.account?.role}`
  },
  {
    field: 'username',
    headerName: 'User name',
    headerAlign: 'center',
    align: 'center',
    minWidth: 200,
    maxWidth: 200,
    flex: 1,
    valueGetter: (value, row: PersonAccountDto) => `${row.account?.username}`
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
    renderCell: (params: GridRenderCellParams<PersonAccountDto>) => (
      <BoxColumnCenter>
        <Box sx={{gap: 2, width: 1.0, display: 'flex', justifyContent: 'center'}}>
          <Tooltip title="Change password" >
            <IconButton disabled={true}>
              <KeyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset password" >
            <IconButton disabled={true}>
              <LockResetIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" >
            <IconButton onClick={() => deleteAccount(params.row.account!.id!)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </BoxColumnCenter>
    )
  },


]