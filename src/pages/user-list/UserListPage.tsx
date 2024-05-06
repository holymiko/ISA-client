import React, {useEffect, useState} from 'react';
import {BoxRow} from "../../components/BoxRow";
import {PageTitle} from "../../components/PageTitle";
import {DataGrid} from "@mui/x-data-grid";
import {userListColumns} from "./userListColumns";
import Box from "@mui/material/Box";
import RefreshIcon from '@mui/icons-material/Refresh';
import {Button} from "@mui/material";
import {getUserList} from "../../services/userService";
import {PersonAccountDto} from "../../types/PersonAccountDto";

export const UserListPage = () =>  {
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
            <PageTitle sx={{mb: '2rem'}}>
                Users
            </PageTitle>

            <BoxRow sx={{justifyContent: 'flex-end', mt: "1rem", mb: "0.5rem"}}>
                <Button
                    onClick = {() => getUsers()}
                    startIcon={<RefreshIcon/>}
                    disabled={loading}
                    variant="contained"
                >
                    Refresh users
                </Button>
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
                          columns={userListColumns}
                          loading={loading}
                          checkboxSelection={false}
                        />
                    </div>
                </Box>
            </Box>
        </Box>
    );
}
