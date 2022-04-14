import React, {Component, useEffect, useState} from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import {getProductById} from "../services/ProductService";
import {Price} from "../types/Price";
import {getIdFromUrl} from "../util/parse";
import {Product} from "../types/Product";
import {PageTitle} from "../components/PageTitle";

// Table columns
const columns: GridColDef[]  = [
  {
    field: 'dealer',
    headerName: 'Dealer',
    description: "",
    width: 140,
    flex: 1
  },
  {
    field: 'dateTime',
    headerName: 'DateTime',
    description: "",
    width: 140,
    flex: 1
  },
  {
    field: 'price',
    headerName: 'Price',
    description: "",
    width: 140,
    flex: 1
  },
  {
    field: 'Redemption',
    headerName: 'redemption',
    description: "",
    width: 140,
    flex: 1
  },

  {
    field: 'spread',
    headerName: 'Spread',
    description: "",
    width: 140,
    flex: 1
  },
  {
    field: 'pricePerGram',
    headerName: 'Price / Gram',
    description: "",
    width: 140,
    flex: 1
  },
];


export const ProductPage = () =>  {

        const pageSize = 5;

        // Hooks declaration
        const [rows, setRows] = useState<Price[]>([]);
        const [product, setProduct] = useState<Product>();
        const [loading, setLoading] = useState<boolean>(true);
        // const [totalItems, setTotalItems] = useState<number>(0);
        // const [currentPage, setCurrentPage] = useState<number>(1);

        const productId: number = getIdFromUrl(window.location.pathname);

        // TODO Refactor or Remove
        useEffect(() => {
            // setLoading(true)

            getProductById(productId).then((res) => {

              // const prices: Price[] = res.latestPrices

              // Set hooks
              // setTotalItems(res.totalItems)
              setProduct(res);
              setRows([]);
              setLoading(false);
            });
        }, []);

        return (
          <>
            <PageTitle>Product</PageTitle>
            <div>Id: {product?.id}</div>
            <div>Product: {product?.name}</div>
            <div>Metal: {product?.metal}</div>
            <div>Grams: {product?.grams}</div>
            <div>#LatestPrice: {product?.latestPrices[0].dateTime}</div>
            {/*<div>Links:*/}
            {/*  {product.links.map(*/}
            {/*        link =>*/}
            {/*            <div>*/}
            {/*                <a href={link}>*/}
            {/*                    {link}*/}
            {/*                </a>*/}
            {/*            </div>*/}
            {/*        )*/}
            {/*    }*/}
            {/*</div>*/}

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  sx={{borderColor: "white"}}
                  rows={rows}
                  columns={columns}
                  // rowCount={totalItems}
                  // pageSize={pageSize}
                  // rowsPerPageOptions={[pageSize]}
                  checkboxSelection
                  // pagination
                  // paginationMode="server"
                  // sortingMode="server"
                  loading={loading}
                  // onPageChange={(page) => setCurrentPage(page+1)}
                  // page={currentPage-1}
                  // components={{
                  //     Pagination: Pagination1,
                  // }}
                  // classes={{
                  //     row: styles.rows
                  // }}
                />
            </div>
          </>
        );
}

export default ProductPage;