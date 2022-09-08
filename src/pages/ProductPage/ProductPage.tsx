import React, {useEffect, useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {getProductById} from "../../services/ProductService";
import {getIdFromUrl} from "../../util/parse";
import {Product} from "../../types/Product";
import {PageTitle} from "../../components/PageTitle";
import Box from "@mui/material/Box";
import {productColumns} from "./productColumns";

export const ProductPage = () => {

    // Hooks declaration
    const [rows, setRows] = useState<any[]>([]);
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
          setRows(res.prices!);
          setLoading(false);
        });
    }, [productId]);

    return (
        <Box>
            <PageTitle>{product?.name}</PageTitle>
            <div>Metal: {product?.metal}</div>
            <div>Grams: {product?.grams}</div>
            <Box>Links:
              <Box sx={{ml: "1rem"}}>
                {product?.links?.map(
                    link =>
                        <div>
                            <a href={link}>{link}</a>
                        </div>
                    )
                }
              </Box>
            </Box>

            <Box sx={{ height: 527, width: '100%', mt: "1rem"}}>
                <DataGrid
                  sx={{borderColor: "white"}}
                  rows={rows}
                  columns={productColumns}
                  loading={loading}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: 'priceDateTime', sort: 'desc' }],
                    },
                  }}
                  // rowCount={totalItems}
                  // pageSize={pageSize}
                  // rowsPerPageOptions={[pageSize]}
                  // checkboxSelection
                  // pagination
                  // paginationMode="server"
                  // sortingMode="server"
                  // onPageChange={(page) => setCurrentPage(page+1)}
                  // page={currentPage-1}
                  // components={{
                  //     Pagination: Pagination1,
                  // }}
                  // classes={{
                  //     row: styles.rows
                  // }}
                />
            </Box>
        </Box>
    );
}