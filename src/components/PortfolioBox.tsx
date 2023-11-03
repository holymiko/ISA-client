import Typography from '@mui/material/Typography';
import Box, {BoxProps} from "@mui/material/Box";
import {PieChart} from "@mui/x-charts/PieChart";
import React from "react";
import {getTextYield, numberWithSpaces} from "../util/utils";

export interface PortfolioBoxProps extends BoxProps{
    name: string;
    data: any;
    owner: string;
    createDate: string;
    cost: number;
    value: number;
}

export const PortfolioBox = ({name, data, owner, createDate, cost, value}: PortfolioBoxProps) => {
    return (
        <Box
            sx={{
                minWidth: 456,
                width: 500,
                height: 300,
                border: 3,
                borderRadius: 8,
            }}
        >
            <Box sx={{ height: 1, width: 1, display: 'flex', flexDirection: 'column'}}>
                <Typography
                    sx={{
                        textAlign: 'left',
                        width: 1,
                        pt: "1.5rem",
                        pl: "3rem",
                    }}
                    variant='h4'
                    component='h4'
                >
                    {name}
                </Typography>
                <Box sx={{ height: 1, width: 1, display: 'flex', flexDirection: 'inline-flex'}}>
                    <PieChart
                        series={[
                            {
                                data: data,
                                innerRadius: 18,
                                outerRadius: 96,
                                paddingAngle: 2,
                                cornerRadius: 6,
                                startAngle: 0,
                                endAngle: 360,
                                cx: 115,
                                cy: 105,
                            }]}
                    />
                    <Box sx={{ height: 1, width: 1, pt: "2rem", display: 'flex', flexDirection: 'column'}}>
                        <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                            owner: {owner}
                        </Typography>
                        <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                            created: {createDate}
                        </Typography>
                        <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                            cost: {numberWithSpaces(cost)}
                        </Typography>
                        <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                            value: {numberWithSpaces(value)}
                        </Typography>
                        <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                            unrealized P&L: {getTextYield(Math.round(value/cost*10000)/10000)}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};