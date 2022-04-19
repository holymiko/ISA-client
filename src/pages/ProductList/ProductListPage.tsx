import React, {useEffect, useState} from 'react';
import { numberWithSpaces } from '../../util/utils';
import {ButtonBlue} from "../../components/ButtonBlue";
import {BoxRow} from "../../components/BoxRow";
import {PageTitle} from "../../components/PageTitle";
import {getProductsAsDTO} from "../../services/ProductService";
import {Product} from "../../types/Product";
import {DataGrid} from "@mui/x-data-grid";
import {productListColumns} from "./productListColumns";
import Box from "@mui/material/Box";
import {Link, useParams} from "react-router-dom";
import moment from 'moment';
import {compareByPrice, compareByRedemption} from "../../util/compare";
import {scrapByParams} from "../../services/ScrapService";


export const ProductListPage = () =>  {
    const { metal } = useParams();
    const [products, setProducts] = useState<Product[]>([])
    const [title, setTitle] = useState<string>('All Products')
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true)
        getProductsAsDTO(metal).then((res) => {
            const products: Product[] = res.data;
            products.forEach(
              product => {
                  product.bestPrice = product.latestPrices.sort(compareByPrice)[0]
                  product.bestRedemption = product.latestPrices.sort(compareByRedemption)[0]
              }
            )
            setProducts(products);
            setLoading(false)
        });
        if(metal !== undefined) {
            setTitle(metal.substring(0, 1).toUpperCase() + metal.substring(1)+' products')
        }
    }, [metal])

    return (
        <Box sx={{ pt: '3rem' }}>
            <PageTitle>{title}</PageTitle>
            <BoxRow sx={{justifyContent: 'flex-end'}}>
                <ButtonBlue onClick = {
                    () => scrapByParams(undefined, undefined, metal, undefined)}>
                    Update All
                </ButtonBlue>
            </BoxRow>

            <Box sx={{ height: 650, width: '100%', mb: '3rem' }}>
                <Box sx={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                          sx={{borderColor: "white"}}
                          rows={products}
                          columns={productListColumns}
                          loading={loading}
                          checkboxSelection={false}
                        />
                    </div>
                </Box>

            </Box>

            <div className="row">
                <table id="ProductsTable" className="table table-striped table-bordered table-sortable">
                    <thead>
                        <tr>
                            {/* <th>Id</th> */}
                            <th>Name</th>
                            {/* <th>Metal</th> */}
                            <th>Grams</th>
                            <th>Price</th>
                            <th>Price Time</th>
                            <th>Redemption</th>
                            <th>Redemption Time</th>
                            <th>Spread</th>
                            <th>Price/Gram</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            products.map(
                                product =>
                                <tr key = {product.id}>
                                    {/* <td>{product.id}</td> */}
                                    <td>
                                        <Link to={"/product/id/"+product.id}>
                                            {product.name}
                                        </Link>
                                    </td>
                                    {/* <td>{product.metal}</td> */}
                                    <td  align="center">
                                        {Math.round(product.grams*100)/100}
                                    </td>

                                    <td align="right" width="10%">
                                        {product.latestPrices.map(
                                            price =>
                                                <div>
                                                    {numberWithSpaces(Math.round(price.price))}
                                                </div>
                                        )}
                                    </td>

                                    <td align="right" width="10%">
                                        {product.latestPrices.map(
                                          price =>  <div> {moment(price.priceDateTime).format('LT')} </div>
                                        )}
                                    </td>

                                    <td align="right">
                                        {product.latestPrices.map(
                                            price =>
                                                <div>
                                                    {numberWithSpaces(Math.round(price.redemption))}
                                                </div>
                                        )}
                                    </td>

                                    <td align="right" width="10%">
                                        {product.latestPrices.map(
                                          price => <div> {moment(price.redemptionDateTime).format('LT')} </div>
                                        )}
                                    </td>

                                    <td>
                                        {product.latestPrices.map(
                                            price =>
                                                <div>
                                                    {Math.round((price.spread)*1_000_000)/1_000_000}
                                                </div>
                                        )}
                                    </td>

                                    <td>
                                        {product.latestPrices.map(
                                            price =>
                                                <div>
                                                    {Math.round((price.pricePerGram)*10_000)/10_000}
                                                </div>
                                        )}
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </Box>
    );
}
