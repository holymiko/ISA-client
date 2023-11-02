import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {useNavigate} from "react-router-dom";
import helmet from "../img/icon/helmetIcon2.png";
import stockIcon from "../img/icon/stockIcon.png";
import portfolioIcon from "../img/icon/portfolioIcon.png";
import Typography from "@mui/material/Typography";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const drawerWidth = 190;

export const SidebarISA = (props: any) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#92B4EC"}}>
        <Box sx={{display: 'inline-flex'}}>
          <Toolbar sx={{ width: '0.5', justifyContent: 'flex-start'}}>
            <Typography
              variant={"h4"}
              sx={{cursor: "pointer"}}
              onClick={() =>
                navigate('/')
            }>
              Invest Scraper
            </Typography>
          </Toolbar>
        </Box>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem key={'Gold'} disablePadding>
              <ListItemButton onClick={() => navigate('/product/gold')}>
                <ListItemIcon>
                  <img src={helmet} alt="" width="40"/>
                </ListItemIcon>
                <ListItemText primary={'Gold'}/>
              </ListItemButton>
            </ListItem>
            <ListItem key={'Silver'} disablePadding>
              <ListItemButton onClick={() => navigate('/product/silver')}>
                <ListItemIcon>
                  <img src={helmet} alt="" width="40"/>
                </ListItemIcon>
                <ListItemText primary={'Silver'} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'Platinum'} disablePadding>
              <ListItemButton onClick={() => navigate('/product/platinum')}>
                <ListItemIcon>
                  <img src={helmet} alt="" width="40"/>
                </ListItemIcon>
                <ListItemText primary={'Platinum'} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'Palladium'} disablePadding>
              <ListItemButton onClick={() => navigate('/product/palladium')}>
                <ListItemIcon>
                  <img src={helmet} alt="" width="40"/>
                </ListItemIcon>
                <ListItemText primary={'Palladium'} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'Add user'} disablePadding>
              <ListItemButton onClick={() => {navigate('/user/add')}}>
                <ListItemIcon>
                  <PersonAddIcon fontSize="large"/>
                </ListItemIcon>
                <ListItemText primary={'Add user'} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'Users'} disablePadding>
              <ListItemButton onClick={() => {navigate('/user')}}>
                <ListItemIcon>
                  <PeopleAltIcon fontSize="large" sx={{pr:0.0, mr:0}}/>
                </ListItemIcon>
                <ListItemText primary={'Users'} sx={{pl:0.0, ml:0}} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'Stock'} disablePadding>
              <ListItemButton onClick={() => navigate('/stock')}>
                <ListItemIcon>
                  <img src={stockIcon} alt="" width="35"/>
                </ListItemIcon>
                <ListItemText primary={'Stock'}/>
              </ListItemButton>
            </ListItem>
            <ListItem key={'Portfolios'} disablePadding>
              <ListItemButton onClick={() => {navigate('/portfolio')}}>
                <ListItemIcon>
                  <img src={portfolioIcon} alt="" width="35"/>
                </ListItemIcon>
                <ListItemText primary={'Portfolio'} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        display='flex'
        sx={{mr: 2, mt: 2, width: 1}}>
        {props.children}
      </Box>
    </Box>
  );
}
