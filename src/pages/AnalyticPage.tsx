import Typography from "@mui/material/Typography";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {TypographyPageTitle} from "../components/TypographyPageTitle";
import {capitalizeFirstLetter} from "../util/utils";

export const AnalyticPage = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{width: 1}}>
            <TypographyPageTitle sx={{mb: '2rem'}}>
                Analytics
            </TypographyPageTitle>
        </Box>
    );
}
