import {TypographyProps} from '@mui/material/Typography';
import {Collapse, List, ListItemButton} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import React from "react";
import {TypographyH5Bold} from "./TypographyH5Bold";

export interface TitleProps extends TypographyProps {
    title: string;
    children: any;
    openFilter: boolean
    setOpenFilter: any;
}

export const FilterCollapseItem = ({title, children, openFilter, setOpenFilter}: TitleProps) => {
    return (
        <List sx={{ width: 1, bgcolor: 'whitesmoke', p: 0}}>
            <ListItemButton sx={{borderRadius: 3}} onClick={() => setOpenFilter(!openFilter)}>
                <ListItemText primary={
                    <TypographyH5Bold>{title}</TypographyH5Bold>
                } />
                {openFilter ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openFilter} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </List>
    );
};