import Typography from "@mui/material/Typography";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";

export const HomePage = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{ height: '31rem', gap: "3rem", display: 'flex', flexDirection: 'column'}}>
            <Typography
                variant={"h4"}
                sx={{cursor: "pointer"}}
                onClick={() =>
                    navigate('/product/gold')
                }>
                Products
            </Typography>
            <Typography
                variant={"h4"}
                sx={{cursor: "pointer"}}
                onClick={() =>
                    navigate('/portfolio')
                }>
                Portfolios
            </Typography>
        </Box>
    );
}
