import React, {Component, useEffect, useState} from 'react';
import { numberWithSpaces } from '../../services/utils.js';
import {ButtonBlue} from "../../components/ButtonBlue";
import {BoxRow} from "../../components/BoxRow";
import {PageTitle} from "../../components/PageTitle";
import {
    getAllProductsAsDTO,
    getGoldProductsAsDTO,
    getPalladiumProductsAsDTO,
    getPlatinumProductsAsDTO,
    getSilverProductsAsDTO, scrapByMetal
} from "../../services/ProductService";
import {Product} from "../../types/Product";
import {DataGrid, GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
import {productListColumns} from "./productListColumns";


export const ProductListPage = () =>  {

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true)
        switch (window.location.pathname) {
            case '/product':
            case '/product/':
                getAllProductsAsDTO().then((res) => {
                    setProducts(res.data);
                    setLoading(false)
                });
                break;

            case '/product/gold':
            case '/product/gold/':
                getGoldProductsAsDTO().then((res) => {
                    setProducts(res.data);
                    setLoading(false)
                });
                break;

            case '/product/silver':
            case '/product/silver/':
                getSilverProductsAsDTO().then((res) => {
                    setProducts(res.data);
                    setLoading(false)
                });
                break;

            case '/product/platinum':
            case '/product/platinum/':
                getPlatinumProductsAsDTO().then((res) => {
                    setProducts(res.data);
                    setLoading(false)
                });
                break;

            case '/product/palladium':
            case '/product/palladium/':
                getPalladiumProductsAsDTO().then((res) => {
                    setProducts(res.data);
                    setLoading(false)
                });
                break;
        }
    }, [])

    return (
        <>
            <PageTitle>Product List</PageTitle>
            <BoxRow sx={{justifyContent: 'flex-end'}}>
                <ButtonBlue onClick = {
                    () => scrapByMetal(products[0].metal)}>
                    Update All
                </ButtonBlue>
            </BoxRow>

            <div style={{ height: 400, width: '100%' }}>
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                <DataGrid
                  sx={{borderColor: "white"}}
                  rows={products}
                  columns={productListColumns}
                  loading={loading}
                  checkboxSelection={false}
                />
                    </div></div>

            </div>

            <div className="row">
                <table id="ProductsTable" className="table table-striped table-bordered table-sortable">
                    <thead>
                        <tr>
                            {/* <th>Id</th> */}
                            <th>Name</th>
                            {/* <th>Metal</th> */}
                            <th>Grams</th>
                            <th>Price</th>
                            <th>Redemption</th>
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
                                        <a href={"http://localhost:3000/product/id/"+product.id}>
                                            {product.name}
                                        </a>
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

                                    <td align="right">
                                        {product.latestPrices.map(
                                            price =>
                                                <div>
                                                    {numberWithSpaces(Math.round(price.redemption))}
                                                </div>
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
        </>
    );
}
