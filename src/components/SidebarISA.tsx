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
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import {useNavigate} from "react-router-dom";

const drawerWidth = 210;

export const SidebarISA = (props: any) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: process.env.REACT_APP_NEXUS_BLUE}}>
        <Box sx={{display: 'inline-flex'}}>
          <Toolbar sx={{ width: '0.5', justifyContent: 'flex-start'}}>
            {/*<Box*/}
            {/*  component="img"*/}
            {/*  // src={.png}*/}
            {/*  sx={{width: 0.12}}*/}
            {/*  onClick={() =>*/}
            {/*    navigate('/')*/}
            {/*  }*/}
            {/*/>*/}
            <Box
              sx={{width: 0.12}}
              onClick={() =>
                navigate('/')
              }
            >Home</Box>
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
                  <EqualizerIcon />
                </ListItemIcon>
                <ListItemText primary={'Gold'}/>
              </ListItemButton>
            </ListItem>
            <ListItem key={'Silver'} disablePadding>
              <ListItemButton onClick={() => navigate('/product/silver')}>
                <ListItemIcon>
                  <EqualizerIcon />
                </ListItemIcon>
                <ListItemText primary={'Silver'} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'Platinum'} disablePadding>
              <ListItemButton onClick={() => navigate('/product/platinum')}>
                <ListItemIcon>
                  <EqualizerIcon />
                </ListItemIcon>
                <ListItemText primary={'Platinum'} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'Palladium'} disablePadding>
              <ListItemButton onClick={() => navigate('/product/palladium')}>
                <ListItemIcon>
                  <EqualizerIcon />
                </ListItemIcon>
                <ListItemText primary={'Palladium'} />
              </ListItemButton>
            </ListItem>
            <ListItem key={'Portfolios'} disablePadding>
              <ListItemButton onClick={() => {navigate('/portfolio')}}>
                <ListItemIcon>
                  <SupervisedUserCircleIcon />
                </ListItemIcon>
                <ListItemText primary={'Portfolios'} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box
        width='100%'
        display='flex'
        sx={{mr: 2, mt: 2}}>
        {props.children}
      </Box>
    </Box>
  );
}
