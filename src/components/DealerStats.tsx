import * as React from "react";
import {BoxChart} from "./BoxChart";
import {useTranslation} from "react-i18next";
import {Dealer} from "../types/enums/dealer";
import {getDealerImage} from "../util/getImage";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Price} from "../types/Price";

const FRACTION_DIGITS = 1;
const DELIMITER = '--'

export interface DealerStatsProps {
    dealer: Dealer,
    latestPrices: Price[]
}


const getRootMeanSquare = (arr: number[]) => {

    // Map will return another array with each
    // element corresponding to the elements of
    // the original array mapped according to
    // some relation
    const squares = arr.map((val) => (val*val));

    // Function reduce the array to a value
    // Here, all the elements gets added to the first
    // element which acted as the accumulator initially.
    const sum = squares.reduce((acum, val) => (acum + val));

    const mean = sum/arr.length;
    return Math.sqrt(mean);
}

const getStandardDeviation = (arr: number[]) => {

    // Creating the mean with Array.reduce
    let mean = arr.reduce((acc, curr) => {
        return acc + curr
    }, 0) / arr.length;

    // Assigning (value - mean) ^ 2 to
    // every array item
    arr = arr.map((k) => {
        return (k - mean) ** 2
    });

    // Calculating the sum of updated array
    let sum = arr.reduce((acc, curr) => acc + curr, 0);

    return ({
        // Standard deviation
        std: Math.sqrt(sum / arr.length).toFixed(FRACTION_DIGITS),
        // Variance
        variance: (sum / arr.length).toFixed(FRACTION_DIGITS)
    })
}

export const getMedian = (list: number[]) => {
    const tmp = list.at(getMedianIndex(list));
    return tmp === undefined ? 0 : tmp
}

const getMedianIndex = (list: number[]) => {
    return list.length % 2 === 0 ? list.length/2 : (list.length+1)/2;
}

export const formatPrices = (dealer: Dealer, latestPrices: Price[]): number[] => {
    return latestPrices.filter((x) => x.dealer === dealer).map((x) => x.pricePerGram).sort();
}

export const DealerStats = ({dealer, latestPricePerGram}: any) => {
    const { t } = useTranslation();

    // @ts-ignore
    const sum = latestPricePerGram.reduce((partialSum, a) => partialSum + a, 0);

    const mean = (sum/latestPricePerGram.length).toFixed(FRACTION_DIGITS);
    const {std, variance} = getStandardDeviation(latestPricePerGram);
    const cv = (Number(std)/Number(mean)).toFixed(4);
    const rms = getRootMeanSquare(latestPricePerGram).toFixed(FRACTION_DIGITS)
    // @ts-ignore
    const median = getMedian(latestPricePerGram).toFixed(FRACTION_DIGITS);
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
            <Box sx={{display: 'flex', flexDirection: 'inline-flex', m: 1, gap: '1.0rem'}}>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Typography>{t('math.median')}</Typography>
                    <Typography>{DELIMITER}</Typography>

                    <Typography>{t('math.mean')}</Typography>
                    <Typography>{t('math.std')}</Typography>
                    <Typography>{t('math.cv')}</Typography>
                    <Typography>{t('math.rms')}</Typography>
                    <Typography>{DELIMITER}</Typography>

                    <Typography>{t('math.max')}</Typography>
                    <Typography>{t('math.q3')}</Typography>
                    <Typography>{t('math.q2')}</Typography>
                    <Typography>{t('math.q1')}</Typography>
                    <Typography>{t('math.min')}</Typography>
                    <Typography>{DELIMITER}</Typography>

                    <Typography>{t('math.iqr')}</Typography>
                    <Typography>{t('math.range')}</Typography>
                    <Typography>{DELIMITER}</Typography>

                    <Typography>{t('math.count')}</Typography>

                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {median}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        {DELIMITER}
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {mean}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {std}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {cv}
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        {rms}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        {DELIMITER}
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        {max}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {q3}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {q2}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {q1}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        {min}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        {DELIMITER}
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        {iqr}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        {range}  Kč/g
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        {DELIMITER}
                    </Typography>
                    <Typography sx={{display: 'flex', justifyContent: 'flex-end', fontWeight: "bold"}}>
                        {count}   pcs
                    </Typography>
                </Box>
            </Box>

        </BoxChart>
    );
};
