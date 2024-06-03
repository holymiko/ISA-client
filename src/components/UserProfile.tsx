import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {isEmpty, logOutMemClean} from "../util/utils";
import {IconButton, Menu, MenuItem} from "@mui/material";
import {AccountCircle} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router-dom";
import {ButtonISA} from "./ButtonISA";
import {PersonAccountDto} from "../types/PersonAccountDto";


export const UserProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [visible, setVisible] = useState<boolean>(false)
    const [user, setUser] = useState<PersonAccountDto>({})
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if(location.pathname === "/login") {
            setVisible(false)
            handleClose()
        } else {
            setVisible(true)
        }
    }, [location])

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if(!isEmpty(userString)) {
            const x: PersonAccountDto = JSON.parse(userString!);
            setUser(x);
        } else {
            setUser({})
            setVisible(false);
        }
    }, [anchorEl])

  return (visible ?
      <>
          <IconButton
              onClick={handleMenu}
              color="inherit"
          >
              <AccountCircle sx={{fontSize: 36}} />
          </IconButton>
          <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
          >
              <MenuItem>
                  <Box sx={{display: 'flex', flexDirection: 'column'}}>
                      <AccountCircle sx={{fontSize: 36, justifyContent: 'center', width: '100%', mb: 1}} />
                      <Typography sx={{display: 'flex', fontWeight: "bold", justifyContent: 'center', width: '100%'}}>
                          {
                              user.firstName + " " +
                              (!isEmpty(user.middleName) ? user.middleName + " " : '') +
                              user.lastName
                          }
                      </Typography>
                      <Typography sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                          {`(${user.account?.username})`}
                      </Typography>
                      <Box sx={{display: 'flex', flexDirection: 'inline-flex', m: 1, gap: 2}}>
                          <Box sx={{display: 'flex', flexDirection: 'column'}}>
                              <Typography>Role</Typography>
                              <Typography>Phone</Typography>
                              <Typography>Email</Typography>
                          </Box>
                          <Box sx={{display: 'flex', flexDirection: 'column'}}>
                              <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                                  {user.account?.role ? user.account.role : '-'}
                              </Typography>
                              <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                                  {user.phone ? user.phone : '-'}
                              </Typography>
                              <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                                  {user.email ? user.email : '-'}
                              </Typography>
                          </Box>
                      </Box>
                      <ButtonISA
                          sx={{display: 'flex', justifyContent: 'center', width: '100%', mt: 1}}
                          variant="contained"
                          onClick={() => {
                              logOutMemClean()
                              navigate('/login')
                          }}
                      >
                          Log out
                      </ButtonISA>
                  </Box>
              </MenuItem>
          </Menu>
      </> :
      <></>
  );
}
