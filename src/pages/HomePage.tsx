import {BoxColumn} from "../components/BoxColumn";
import Typography from "@mui/material/Typography";
import * as React from "react";
import {useNavigate} from "react-router-dom";

export const HomePage = () => {
    const navigate = useNavigate();
    return (
        <BoxColumn sx={{ height: '31rem', gap: "3rem"}}>
            <Typography
                variant={"h4"}
                sx={{cursor: "pointer"}}
                onClick={() =>
                    navigate('/product/all')
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
        </BoxColumn>
    );
}
