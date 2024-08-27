import * as React from "react";
import {BoxChart} from "./BoxChart";
import {useTranslation} from "react-i18next";
import {Dealer} from "../types/enums/dealer";
import {getDealerImage} from "../util/getImage";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Price} from "../types/Price";

const FRACTION_DIGITS = 1;

export interface DealerStatsProps {
    dealer: Dealer,
    latestPrices: Price[]
}

const getMedian = (list: number[]) => {
    const tmp = list.at(getMedianIndex(list));
    return tmp === undefined ? 0 : tmp
}

const getMedianIndex = (list: number[]) => {
    return list.length % 2 === 0 ? list.length/2 : (list.length+1)/2;
}

export const DealerStats = ({dealer, latestPrices}: DealerStatsProps) => {
    const { t } = useTranslation();

    const latestPricePerGram: number[] = latestPrices.filter((x) => x.dealer === dealer).map((x) => x.pricePerGram).sort()
    const sum = latestPricePerGram.reduce((partialSum, a) => partialSum + a, 0);

    const mean = (sum/latestPricePerGram.length).toFixed(FRACTION_DIGITS);
    // @ts-ignore
    const median = getMedian(latestPricePerGram).toFixed(FRACTION_DIGITS);
    const mode = 0;
    const min = Math.min(...latestPricePerGram).toFixed(FRACTION_DIGITS);
    const max = Math.max(...latestPricePerGram).toFixed(FRACTION_DIGITS);
    const range = (Number(max) - Number(min)).toFixed(FRACTION_DIGITS);
    const count = latestPricePerGram.length;
    // @ts-ignore
    const q1 = getMedian(latestPricePerGram.slice(undefined, getMedianIndex(latestPricePerGram)-1)).toFixed(FRACTION_DIGITS);
    const q2 = median;
    // @ts-ignore
    const q3 = getMedian(latestPricePerGram.slice(getMedianIndex(latestPricePerGram)+1, undefined)).toFixed(FRACTION_DIGITS);
    const iqr = (Number(q3) - Number(q1)).toFixed(FRACTION_DIGITS);
    return (
        <BoxChart sx={{pb: "1rem", pl: "1rem", p: '1rem'}}>
            <Box sx={{display: 'flex', justifyContent: 'center', pb: '0.5rem'}}>
                <img src={getDealerImage(dealer)} alt='' height={36}/>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'inline-flex', m: 1, gap: '0.5rem'}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Typography>{t('math.count')}</Typography>
                    <Typography>{t('math.mean')}</Typography>
                    <Typography>{t('math.median')}</Typography>
                    {/*<Typography>{t('math.mode')}</Typography>*/}
                    <Typography>{t('math.q1')}</Typography>
                    <Typography>{t('math.q2')}</Typography>
                    <Typography>{t('math.q3')}</Typography>
                    <Typography>{t('math.iqr')}</Typography>
                    <Typography>{t('math.min')}</Typography>
                    <Typography>{t('math.max')}</Typography>
                    <Typography>{t('math.range')}</Typography>
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {count}   pcs
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {mean}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {median}  Kč/g
                    </Typography>
                    {/*<Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>*/}
                    {/*    {mode}  Kč/g*/}
                    {/*</Typography>*/}
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {q1}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {q2}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {q3}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {iqr}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        {min}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        {max}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        {range}  Kč/g
                    </Typography>
                </Box>
            </Box>

        </BoxChart>
    );
};
