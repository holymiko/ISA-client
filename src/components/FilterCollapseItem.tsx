import {TypographyProps} from '@mui/material/Typography';
import {Collapse, List, ListItemButton} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import React from "react";
import {TypographyH6Bold} from "./TypographyH6Bold";

export interface TitleProps extends TypographyProps {
    sx?: any;
    title: string;
    children: any;
    openFilter: boolean
    setOpenFilter: any;
}

export const FilterCollapseItem = ({title, children, openFilter, setOpenFilter, sx}: TitleProps) => {
    return (
        <List sx={{ width: 1, p: 0, ...sx}}>
            <ListItemButton sx={{borderRadius: 3}} onClick={() => setOpenFilter(!openFilter)}>
                <ListItemText primary={
                    <TypographyH6Bold>{title}</TypographyH6Bold>
                } />
                {openFilter ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openFilter} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </List>
    );
};