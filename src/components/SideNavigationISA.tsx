import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {useNavigate} from "react-router-dom";
import helmet from "../img/icon/helmetIcon2.png";
import analytic from "../img/icon/analytic.png";
import stockIcon from "../img/icon/stock.png";
import pyramid from "../img/icon/pyramid.png";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const drawerWidth = 190;

export const SideNavigationISA = (props: any) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
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
            <ListItem key={'Analytics'} disablePadding>
              <ListItemButton onClick={() => navigate('/analytic')}>
                <ListItemIcon>
                  <img src={analytic} alt="" width="40"/>
                </ListItemIcon>
                <ListItemText primary={'Analytics'}/>
              </ListItemButton>
            </ListItem>
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
            <ListItem key={'Portfolios'} disablePadding>
              <ListItemButton onClick={() => {navigate('/portfolio')}}>
                <ListItemIcon>
                  <img src={pyramid} alt="" width="35"/>
                </ListItemIcon>
                <ListItemText primary={'Portfolio'} />
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
                  <PeopleAltIcon fontSize="large" sx={{ml:0.4}}/>
                </ListItemIcon>
                <ListItemText primary={'Users'} sx={{pl:0.0, ml:0}} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'Stocks'} disablePadding>
              <ListItemButton onClick={() => navigate('/stock')}>
                <ListItemIcon>
                  <img src={stockIcon} alt="" width="35"  sx={{ml:0.4}}/>
                </ListItemIcon>
                <ListItemText primary={'Stocks'}/>
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
