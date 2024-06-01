import Typography from "@mui/material/Typography";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {PageTitle} from "../components/PageTitle";
import {capitalizeFirstLetter} from "../util/utils";

export const AnalyticPage = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{width: 1}}>
            <PageTitle sx={{mb: '2rem'}}>
                Analytics
            </PageTitle>
        </Box>
    );
}
