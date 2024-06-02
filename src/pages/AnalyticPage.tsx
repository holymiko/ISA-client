import Typography from "@mui/material/Typography";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {TypographyPageTitle} from "../components/TypographyPageTitle";
import {capitalizeFirstLetter} from "../util/utils";
import {getBackendVersion, getDbStats} from "../services/appInfoService";
import {useEffect, useState} from "react";

export const AnalyticPage = () => {
    const navigate = useNavigate();

    const [row, setRow] = useState<any>([]);
    const [dbStats, setDbStats] = useState<any>();
    const [version, setVersion] = useState<string>("");

    const update = () => {
        getDbStats().then((x) => {
            setDbStats(x.data)
            setRow([
                {
                    name: "Silverum",
                    linkWithProduct: x.data.linksWithProductSilverum,
                    totalLinks: x.data.linksSilverum,
                    share: x.data.linksWithProductSilverum / x.data.linksSilverum
                }
            ])
        });
        getBackendVersion().then((x) => setVersion(x.data));
    }

    useEffect(() => {
        update();
    },[]);

    return (
        <Box sx={{width: 1}}>
            <TypographyPageTitle sx={{mb: '2rem'}}>
                Analytics
            </TypographyPageTitle>
            <Typography>
                {JSON.stringify(dbStats)}
            </Typography>
            <Typography>
                {version}
            </Typography>
        </Box>
    );
}
