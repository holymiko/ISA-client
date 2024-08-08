import Typography from "@mui/material/Typography";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {getProductsByPages} from "../services/productService";
import {useEffect} from "react";
import {Metal} from "../types/enums/metal";
import {isEmpty} from "../util/utils";

export const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const list = [Metal.GOLD, Metal.SILVER, Metal.PLATINUM, Metal.PALLADIUM]
        for (const tmpMetal of list) {
            const productCache = localStorage.getItem(tmpMetal.toLowerCase())
            if (isEmpty(productCache)) {
                getProductsByPages(tmpMetal);
            }
        }
    },[]);

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
