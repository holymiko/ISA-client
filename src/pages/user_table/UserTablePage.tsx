import React, {useEffect, useState} from 'react';
import {BoxRow} from "../../components/BoxRow";
import {TypographyPageTitle} from "../../components/TypographyPageTitle";
import {DataGrid} from "@mui/x-data-grid";
import {userColumns} from "./userColumns";
import Box from "@mui/material/Box";
import RefreshIcon from '@mui/icons-material/Refresh';
import {getUserList} from "../../services/userService";
import {PersonAccountDto} from "../../types/PersonAccountDto";
import {ButtonISA} from "../../components/ButtonISA";

export const UserTablePage = () =>  {
    const [users, setUser] = useState<PersonAccountDto[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    const getUsers = () => {
        setLoading(true)
        getUserList().then((res) => {
            setUser(res);
            setLoading(false);
        });
    }

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <Box sx={{width: 1}}>
            <TypographyPageTitle sx={{mb: '2rem'}}>
                Users
            </TypographyPageTitle>

            <BoxRow sx={{justifyContent: 'flex-end', mt: "1rem", mb: "0.5rem"}}>
                <ButtonISA
                    onClick = {() => getUsers()}
                    startIcon={<RefreshIcon/>}
                    disabled={loading}
                    variant="contained"
                >
                    Refresh users
                </ButtonISA>
            </BoxRow>

            <Box sx={{ height: 700, width: '100%', mb: '3rem' }}>
                <Box sx={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                          sx={{
                              borderColor: "white",
                              "& .MuiDataGrid-columnHeaderTitle": {
                                  fontSize: 16,
                                  fontWeight: 'bold'
                              }
                          }}
                          rows={users}
                          columns={userColumns}
                          loading={loading}
                          getRowId={(row: PersonAccountDto) => row.account!.id!}
                          checkboxSelection={false}
                        />
                    </div>
                </Box>
            </Box>
        </Box>
    );
}
