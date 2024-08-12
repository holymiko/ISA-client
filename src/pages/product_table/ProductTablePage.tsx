import React, {useEffect, useState} from 'react';
import {BoxRow} from "../../components/BoxRow";
import {TypographyPageTitle} from "../../components/TypographyPageTitle";
import {getProductsByPages} from "../../services/productService";
import {Product} from "../../types/Product";
import {DataGrid} from "@mui/x-data-grid";
import {productColumns} from "./productColumns";
import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import {compareByPrice, compareByRedemption} from "../../util/compare";
import {scrapAllLinksFromProductList, scrapByMetalInSync, scrapMissingProducts} from "../../services/scrapService";
import {
    capitalizeFirstLetter,
    getMetal,
    getSessionUser2,
    isAdmin,
    isEmpty
} from "../../util/utils";
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {Form} from "../../types/enums/form";
import {ButtonISA} from "../../components/ButtonISA";
import {Metal} from "../../types/enums/metal";
import {
    Filter,
    FilterAvailability,
    FilterDealer,
    FilterForm,
    filterProducts,
    initFilter
} from "../../components/Filter";


export const ProductTablePage = () =>  {
    const { metal } = useParams();
    const [products, setProducts] = useState<Product[]>([])
    const [productsControlled, setProductsControlled] = useState<Product[]>([])

    const [loading, setLoading] = useState<boolean>(true);

    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(500000);
    const [filterForms, setFilterForms] = useState<FilterForm[]>([])
    const [filterDealers, setFilterDealers] = useState<FilterDealer[]>([])
    const [filterAvailability, setFilterAvailability] = useState<FilterAvailability[]>([])
    const [excludeUnavailable, setExcludeUnavailable] = useState<boolean>(true);


    const formatProducts = (tmpProducts: Product[]) => {
        let formSet = new Set<Form>();
        let tmpMaxPrice: number = 0;
        tmpProducts.forEach(
            product => {
                formSet.add(product.form);
                product.bestPrice = product.latestPrices.sort(compareByPrice)[0];
                product.bestRedemption = product.latestPrices.sort(compareByRedemption)[0];
                if(product.bestPrice?.price > tmpMaxPrice) {
                    tmpMaxPrice = product.bestPrice.price;
                }
            }
        )
        initFilter(tmpProducts, {
            setMinPrice, setMaxPrice, setFilterForms, setFilterDealers,
            setFilterAvailability, setExcludeUnavailable
        })
        setProducts(tmpProducts);
        setLoading(false);
    }


    useEffect(() => {
        setLoading(true)
        const tmpMetal = getMetal(metal)

        if(metal === undefined || tmpMetal === undefined) {
            setLoading(true)
            getProductsByPages(undefined).then((x: Product[]) =>
                formatProducts(x)
            );
        }

        // @ts-ignore
        const productsCache = localStorage.getItem(tmpMetal.toLowerCase())
        if(isEmpty(productsCache)) {
            setLoading(true)
            getProductsByPages(tmpMetal).then((x: Product[]) =>
                formatProducts(x)
            );
        } else {
            formatProducts(JSON.parse(productsCache!))
        }

    }, [metal])

    /**
     * Activate filtration on any filter change
     */
    useEffect(() => {
        setProductsControlled(
            filterProducts(products, minPrice, maxPrice, filterForms, filterDealers, filterAvailability, excludeUnavailable)
        );
    }, [products, minPrice, maxPrice, filterForms, filterDealers, filterAvailability, excludeUnavailable])

    useEffect(() => {
        localStorage.setItem('filterMinPrice', JSON.stringify(minPrice));
    }, [minPrice])

    useEffect(() => {
        localStorage.setItem('filterMaxPrice', JSON.stringify(maxPrice));
    }, [maxPrice])

    useEffect(() => {
        localStorage.setItem('filterForms', JSON.stringify(filterForms));
    }, [filterForms])

    useEffect(() => {
        localStorage.setItem('filterDealers', JSON.stringify(filterDealers));
    }, [filterDealers])

    useEffect(() => {
        localStorage.setItem('filterAvailability', JSON.stringify(filterAvailability));
    }, [filterAvailability])

    useEffect(() => {
        localStorage.setItem('filterExcludeUnavailable', JSON.stringify(excludeUnavailable));
    }, [excludeUnavailable])

    return (
        <Box sx={{width: 1}}>
            <TypographyPageTitle sx={{mb: '2rem'}}>
                {capitalizeFirstLetter(metal)} products
            </TypographyPageTitle>

            {/* BUTTONS */}
            <BoxRow sx={{justifyContent: 'flex-end', mt: "1rem", mb: "0.5rem"}}>
                <ButtonISA
                    onClick = {() => scrapAllLinksFromProductList()}
                    startIcon={<PlayCircleOutlineIcon/>}
                    disabled={loading || !isAdmin(getSessionUser2()?.account?.role)}
                    variant="contained"
                >
                    Scrap new URL
                </ButtonISA>
                <ButtonISA
                    onClick = {() => scrapMissingProducts()}
                    startIcon={<PlayCircleOutlineIcon/>}
                    disabled={loading || !isAdmin(getSessionUser2()?.account?.role)}
                    variant="contained"
                >
                    Scrap new products
                </ButtonISA>
                <ButtonISA
                    onClick = {() => scrapByMetalInSync(metal)}
                    startIcon={<PlayCircleOutlineIcon/>}
                    disabled={loading || !isAdmin(getSessionUser2()?.account?.role)}
                    variant="contained"
                >
                    Scrap {metal} prices
                </ButtonISA>
                <ButtonISA
                    onClick = {() => {
                        setLoading(true)
                        // @ts-ignore
                        getProductsByPages(metal === undefined ? undefined : Metal[metal.toUpperCase()]).then((x: Product[]) =>
                            formatProducts(x)
                        );
                    }}
                    startIcon={<RefreshIcon/>}
                    disabled={loading}
                    variant="contained"
                >
                    Refresh products
                </ButtonISA>
            </BoxRow>

            <Filter
                minPrice={minPrice} setMinPrice={setMinPrice}
                maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                filterForms={filterForms} setFilterForms={setFilterForms}
                filterDealers={filterDealers} setFilterDealers={setFilterDealers}
                filterAvailability={filterAvailability} setFilterAvailability={setFilterAvailability}
                excludeUnavailable={excludeUnavailable} setExcludeUnavailable={setExcludeUnavailable}
            />

            <Box sx={{ height: 700 }}>
                    <Box
                        sx={{
                            display: 'flex', height: '100%', mb: '3rem', width: '100%',
                        }}
                    >
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        // Hide column shortName, the other columns will remain visible
                                        name: false
                                    },
                                },
                            }}
                            sx={{
                                borderColor: "white",
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    fontSize: 16,
                                    fontWeight: 'bold'
                                }
                            }}
                            rows={productsControlled}
                            columns={productColumns}
                            loading={loading}
                            checkboxSelection={false}
                        />
                    </div>
                </Box>
            </Box>
        </Box>
    );
}
