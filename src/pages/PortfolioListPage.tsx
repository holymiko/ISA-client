import React, { useEffect, useState} from 'react';
import {getPortfolios, scrapByPortfolio} from '../services/PortfolioService';
import { getTextYield } from '../util/utils';
import {PageTitle} from '../components/PageTitle';
import AddIcon from '@mui/icons-material/Add';
import {ButtonBlue} from "../components/ButtonBlue";
import {BoxRow} from "../components/BoxRow";
import {Link, useNavigate} from "react-router-dom";

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


  const makeTableRow = (portfolio: any) => {
        return (
              <tr className="tableRow" key = {portfolio.id} >
                  <td><Link to={"portfolio/"+portfolio.id}>{portfolio.owner}</Link></td>
                  <td align="right">{Math.round(portfolio.beginPrice)}</td>
                  <td align="right">{Math.round(portfolio.value)}</td>
                  <td align="center">{getTextYield(portfolio.yield)}</td>
                  <td align="center">{portfolio.investmentCount}</td>
                  <td align="center"><button id="update" className="button-row" onClick = { () => scrapByPortfolio(portfolio.id) }>Update</button> </td>
              </tr>
        )
  }

  return (
      <div>
          <PageTitle>Portfolio List</PageTitle>
          <BoxRow>
            <ButtonBlue startIcon={<AddIcon />} onClick={() => {navigate('/portfolio/add')}}>add portfolio</ButtonBlue>
          </BoxRow>
          <div className="row">
              <table className="table table-striped table-bordered table-sortable">
                  <thead>
                      <tr>
                          <th>Owner</th>
                          <th>Buy Price</th>
                          <th>Value</th>
                          <th>Yield</th>
                          <th>n. Investments</th>
                          <th>Action</th>
                      </tr>
                  </thead>

                  <tbody>
                      {
                          rows.map(
                              (portfolio: any) => {
                                  return(makeTableRow(portfolio))
                              }
                          )
                      }
                  </tbody>
              </table>
          </div>
      </div>
  );
}
