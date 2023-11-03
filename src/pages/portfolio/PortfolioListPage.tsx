import React, { useEffect, useState} from 'react';
import {getPortfolios, } from '../../services/portfolioService';
import {scrapByPortfolio} from '../../services/scrapService'
import { getTextYield } from '../../util/utils';
import {PageTitle} from '../../components/PageTitle';
import {Link, useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {PieChart} from "@mui/x-charts/PieChart";
import Typography from "@mui/material/Typography";

export const PortfolioListPage = () =>  {

  const navigate = useNavigate();
  // TODO Add Portfolio type
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true)
    getPortfolios().then((res) => {
      setRows(res.data);
      setLoading(false)
    });
  }, [])

  return (
      <Box>
          <PageTitle>Portfolios</PageTitle>
          <Box sx={{ height: 1, width: 1, gap: 3, display: 'flex', flexDirection: 'column'}}>
              <Box sx={{ height: 1, width: 1, display: 'flex', gap: 1.8, flexDirection: 'inline-flex'}}>
                  <Box
                      sx={{
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
                              Portfolio 1
                          </Typography>
                          <Box sx={{ height: 1, width: 1, display: 'flex', flexDirection: 'inline-flex'}}>
                              <PieChart
                                  series={[
                                      {
                                          data: [
                                              { id: 0, value: 55, color: '#2196f3' },
                                              { id: 1, value: 30, color: '#C0C0C0' },
                                              { id: 2, value: 15, color: '#FFD700' },
                                          ],
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
                                      owner: Karel Čapek
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      created: 27.9.2021
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      cost: 68 000
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      value: 75 650
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      unrealized P&L: +11,25%
                                  </Typography>
                              </Box>
                          </Box>
                      </Box>
                  </Box>
                  <Box
                      sx={{
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
                              Portfolio 2
                          </Typography>
                          <Box sx={{ height: 1, width: 1, display: 'flex', flexDirection: 'inline-flex'}}>
                              <PieChart
                                  series={[
                                      {
                                          data: [
                                              { id: 0, value: 20, color: '#2196f3' },
                                              { id: 1, value: 45, color: '#C0C0C0' },
                                              { id: 2, value: 35, color: '#FFD700' },
                                          ],
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
                                      owner: Alois Jirásek
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      created: 27.9.2021
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      cost: 105 000
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      value: 112 430
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      unrealized P&L: +11,25%
                                  </Typography>
                              </Box>
                          </Box>
                      </Box>
                  </Box>
                  <Box
                      sx={{
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
                              Portfolio 3
                          </Typography>
                          <Box sx={{ height: 1, width: 1, display: 'flex', flexDirection: 'inline-flex'}}>
                              <PieChart
                                  series={[
                                      {
                                          data: [
                                              { id: 0, value: 30, color: '#2196f3' },
                                              { id: 1, value: 60, color: '#C0C0C0' },
                                              { id: 2, value: 10, color: '#FFD700' },
                                          ],
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
                                      owner: Bohumil Hrabal
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      created: 27.9.2021
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      cost: 68 000
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      value: 75 650
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      unrealized P&L: +11,25%
                                  </Typography>
                              </Box>
                          </Box>
                      </Box>
                  </Box>
              </Box>
              <Box sx={{ height: 1, width: 1, display: 'flex', gap: 1.8, flexDirection: 'inline-flex'}}>
                  <Box
                      sx={{
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
                              Portfolio 4
                          </Typography>
                          <Box sx={{ height: 1, width: 1, display: 'flex', flexDirection: 'inline-flex'}}>
                              <PieChart
                                  series={[
                                      {
                                          data: [
                                              { id: 0, value: 40, color: '#C0C0C0' },
                                              { id: 1, value: 60, color: '#FFD700' },
                                          ],
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
                                      owner: Vítěslav Nezval
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      created: 27.9.2021
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      cost: 68 000
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      value: 75 650
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      unrealized P&L: +11,25%
                                  </Typography>
                              </Box>
                          </Box>
                      </Box>
                  </Box>
                  <Box
                      sx={{
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
                              Portfolio 5
                          </Typography>
                          <Box sx={{ height: 1, width: 1, display: 'flex', flexDirection: 'inline-flex'}}>
                              <PieChart
                                  series={[
                                      {
                                          data: [
                                              { id: 0, value: 70, color: '#2196f3' },
                                              { id: 1, value: 10, color: '#C0C0C0' },
                                              { id: 2, value: 20, color: '#FFD700' },
                                          ],
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
                                      owner: Jaroslav Seifert
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      created: 27.9.2021
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      cost: 68 000
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      value: 75 650
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      unrealized P&L: +11,25%
                                  </Typography>
                              </Box>
                          </Box>
                      </Box>
                  </Box>
                  <Box
                      sx={{
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
                              Portfolio 6
                          </Typography>
                          <Box sx={{ height: 1, width: 1, display: 'flex', flexDirection: 'inline-flex'}}>
                              <PieChart
                                  series={[
                                      {
                                          data: [
                                              { id: 0, value: 60, color: '#2196f3' },
                                              { id: 1, value: 40, color: '#FFD700' },
                                          ],
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
                                      owner: Jára Cimrman
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      created: 27.9.2021
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      cost: 68 000
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      value: 75 650
                                  </Typography>
                                  <Typography sx={{textAlign: 'left'}} variant='h6' component='h6'>
                                      unrealized P&L: +11,25%
                                  </Typography>
                              </Box>
                          </Box>
                      </Box>
                  </Box>
              </Box>
          </Box>
          {/*<BoxRow>*/}
          {/*  <ButtonBlue startIcon={<AddIcon />} onClick={() => {navigate('/portfolio/add')}}>add portfolio</ButtonBlue>*/}
          {/*</BoxRow>*/}
      </Box>
  );
}
