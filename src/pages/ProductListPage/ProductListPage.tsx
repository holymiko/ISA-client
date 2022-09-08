import React, {useEffect, useState} from 'react';
import {ButtonBlue} from "../../components/ButtonBlue";
import {BoxRow} from "../../components/BoxRow";
import {PageTitle} from "../../components/PageTitle";
import {getProductsAsDTO} from "../../services/ProductService";
import {Product} from "../../types/Product";
import {DataGrid} from "@mui/x-data-grid";
import {productListColumns} from "./productListColumns";
import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
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
        <Box>
            <PageTitle>{title}</PageTitle>
            <BoxRow sx={{justifyContent: 'flex-end'}}>
                <ButtonBlue
                  onClick = {() => scrapByParams(undefined, undefined, metal, undefined)}>
                    Update All
                </ButtonBlue>
            </BoxRow>

            <Box sx={{ height: 700, width: '100%', mb: '6rem' }}>
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
        </Box>
    );
}
