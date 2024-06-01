import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {UserProfile} from "./UserProfile";


export const HeaderISA = () => {
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
                            onClick={() => navigate('/')
                        }>
                            Invest Scraper
                        </Typography>
                    </Toolbar>
                    <Box sx={{display: 'inline-flex', width: '0.5', justifyContent: 'flex-end', mr: 2}}>
                        <UserProfile/>
                    </Box>
                </Box>
            </AppBar>
        </Box>
    );
}
