import React, { useEffect, useState} from 'react';
import {getPortfolios, } from '../../services/portfolioService';
import {scrapByPortfolio} from '../../services/scrapService'
import { getTextYield } from '../../util/utils';
import {PageTitle} from '../../components/PageTitle';
import {Link, useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {PieChart} from "@mui/x-charts/PieChart";
import Typography from "@mui/material/Typography";
import {PortfolioBox} from "../../components/PortfolioBox";

export const PortfolioListPage = () =>  {

  const navigate = useNavigate();
  // TODO Add Portfolio type
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   setLoading(true)
  //   getPortfolios().then((res) => {
  //     setRows(res.data);
  //     setLoading(false)
  //   });
  // }, [])

  return (
      <Box>
          <PageTitle>Portfolios</PageTitle>
          <Box sx={{ height: 1, width: 1, gap: 3, display: 'flex', flexDirection: 'column'}}>
              <Box sx={{ height: 1, width: 1, display: 'flex', gap: 1.8, flexDirection: 'inline-flex'}}>
                  <PortfolioBox name={"Portfolio 1"} data={[
                      { id: 0, value: 55, color: '#2196f3' },
                      { id: 1, value: 30, color: '#C0C0C0' },
                      { id: 2, value: 15, color: '#FFD700' },
                  ]} owner={"Karel Čapek"} createDate={"14.7.2019"} cost={1_620_000} value={1_840_650} />
                  <PortfolioBox name={"Portfolio 2"} data={[
                      { id: 0, value: 20, color: '#2196f3' },
                      { id: 1, value: 45, color: '#C0C0C0' },
                      { id: 2, value: 35, color: '#FFD700' },
                  ]} owner={"Alois Jirásek"} createDate={"8.11.2022"} cost={154_000} value={183_032} />
                  <PortfolioBox name={"Portfolio 3"} data={[
                      { id: 0, value: 30, color: '#2196f3' },
                      { id: 1, value: 60, color: '#C0C0C0' },
                      { id: 2, value: 10, color: '#FFD700' },
                  ]} owner={"Bohumil Hrabal"} createDate={"27.9.2021"} cost={68_000} value={75_650} />
              </Box>
              <Box sx={{ height: 1, width: 1, display: 'flex', gap: 1.8, flexDirection: 'inline-flex'}}>
                  <PortfolioBox name={"Portfolio 4"} data={[
                      { id: 0, value: 40, color: '#C0C0C0' },
                      { id: 1, value: 60, color: '#FFD700' },
                  ]} owner={"Vítěslav Nezval"} createDate={"27.9.2021"} cost={270_000} value={310_000} />
                  <PortfolioBox name={"Portfolio 5"} data={[
                      { id: 0, value: 70, color: '#2196f3' },
                      { id: 1, value: 10, color: '#C0C0C0' },
                      { id: 2, value: 20, color: '#FFD700' },
                  ]} owner={"Jaroslav Seifert"} createDate={"27.9.2021"} cost={1_476_000} value={1_386_456} />
                  <PortfolioBox name={"Portfolio 6"} data={[
                      { id: 0, value: 60, color: '#2196f3' },
                      { id: 1, value: 40, color: '#FFD700' },
                  ]} owner={"Jára Cimrman"} createDate={"27.9.2021"} cost={488_000} value={567_120} />
              </Box>
          </Box>
          {/*<BoxRow>*/}
          {/*  <ButtonBlue startIcon={<AddIcon />} onClick={() => {navigate('/portfolio/add')}}>add portfolio</ButtonBlue>*/}
          {/*</BoxRow>*/}
      </Box>
  );
}
