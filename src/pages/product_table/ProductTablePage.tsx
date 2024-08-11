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
import {Dealer} from "../../types/enums/dealer";
import {Availability} from "../../types/enums/availability";
import {Price} from "../../types/Price";
import {ButtonISA} from "../../components/ButtonISA";
import {Metal} from "../../types/enums/metal";
import {Filter, FilterAvailability, FilterDealer, FilterForm} from "../../components/Filter";


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

    const filterProducts = () => {
        const filterFormValues: Form[] = filterForms.filter(x => x.checked).map(x => x.value);
        const filterDealerValues: Dealer[] = filterDealers.filter(x => x.checked).map(x => x.value);
        const filterAvailabilityValues: Availability[] = filterAvailability.filter(x => x.checked).map(x => x.value);
        let tmpProducts: Product[] = structuredClone(products);
        if(excludeUnavailable) {
            tmpProducts = tmpProducts.filter(x => x.bestPrice?.price !== 0 || x.bestRedemption?.redemption !== 0)
        }
        tmpProducts = tmpProducts.filter(x => {
            // For moment of initialization
            if(x.bestPrice === undefined) {
                return true;
            }
            // Form
            if(!filterFormValues.includes(x.form)) {
                return false;
            }
            // Price
            return x.bestPrice!.price >= minPrice && x.bestPrice!.price <= maxPrice
        })
        // Availability - filter prices
        tmpProducts.forEach(
            product => {
                product.latestPrices = product.latestPrices.filter(x => filterAvailabilityValues.includes(x.availability))
            }
        )
        // Dealer - filter prices
        tmpProducts.forEach(
            product => {
                product.latestPrices = product.latestPrices.filter(x => filterDealerValues.includes(x.dealer))
            }
        )
        // Filter products without Price
        tmpProducts = tmpProducts.filter(x => x.latestPrices.length !== 0)
        // Dealer - set best
        tmpProducts.forEach(
            product => {
                product.bestPrice = product.latestPrices.sort(compareByPrice)[0];
                product.bestRedemption = product.latestPrices.sort(compareByRedemption)[0];
            }
        )
        return tmpProducts;
    }

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
        const latestPrices: Price[] = tmpProducts.flatMap(x => x.latestPrices);
        latestPrices.forEach(x => {
            if(x.availability === null) {
            x.availability = Availability.UNKNOWN
        }});
        formatFilter(tmpProducts, formSet, tmpMaxPrice)
        setProducts(tmpProducts);
        setLoading(false);
    }

    const formatFilter = (tmpProducts: Product[], formSet: Set<Form>, tmpMaxPrice: number) => {
        const latestPrices: Price[] = tmpProducts.flatMap(x => x.latestPrices);
        const dealerSet = new Set(latestPrices.map(x => x.dealer));

        let tmp = localStorage.getItem('filterMinPrice')
        if(isEmpty(tmp)) {
            setMinPrice(0)
            localStorage.setItem('filterMinPrice', JSON.stringify(minPrice))
        } else {
            setMinPrice(JSON.parse(tmp!))
        }

        tmp = localStorage.getItem('filterMaxPrice')
        if(isEmpty(tmp)) {
            setMaxPrice(tmpMaxPrice);
            localStorage.setItem('filterMaxPrice', JSON.stringify(tmpMaxPrice))
        } else {
            setMaxPrice(JSON.parse(tmp!))
        }

        tmp = localStorage.getItem('filterForms')
        if(isEmpty(tmp) || tmp === '[]' ) {
            const forms = Array.from(formSet).map((value, index) => ({id: index, value: value, checked: true}));
            setFilterForms(forms);
            localStorage.setItem('filterForms', JSON.stringify(forms))
        } else {
            setFilterForms(JSON.parse(tmp!))
        }

        tmp = localStorage.getItem('filterDealers')
        if((isEmpty(tmp) || tmp === '[]')) {
            setFilterDealers(Array.from(dealerSet).map((value, index) => ({id: index, value: value, checked: true})));
            localStorage.setItem('filterDealers', JSON.stringify(filterDealers))
        } else {
            setFilterDealers(JSON.parse(tmp!))
        }

        tmp = localStorage.getItem('filterAvailability')
        if(isEmpty(tmp) || tmp === '[]') {
            const availabilitySet = new Set(latestPrices.map(x => x.availability));
            setFilterAvailability(Array.from(availabilitySet).sort().map((value, index) => (
                value === Availability.UNAVAILABLE || value === Availability.SOLD_OUT || value === Availability.UNKNOWN
                    ? {id: index, value: value, checked: false}
                    : {id: index, value: value, checked: true}
            )));
            localStorage.setItem('filterAvailability', JSON.stringify(filterAvailability))
        } else {
            setFilterAvailability(JSON.parse(tmp!))
        }

        tmp = localStorage.getItem('filterExcludeUnavailable')
        if(isEmpty(tmp)) {
            setExcludeUnavailable(true);
            localStorage.setItem('filterExcludeUnavailable', JSON.stringify(excludeUnavailable))
        } else {
            setExcludeUnavailable(JSON.parse(tmp!))
        }
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
            filterProducts()
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
