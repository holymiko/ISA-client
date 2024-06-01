import React, {useEffect, useState} from 'react';
import {BoxRow} from "../../components/BoxRow";
import {PageTitle} from "../../components/PageTitle";
import {getProductsAsDTO} from "../../services/productService";
import {Product} from "../../types/Product";
import {DataGrid} from "@mui/x-data-grid";
import {productColumns} from "./productColumns";
import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import {compareByPrice, compareByRedemption} from "../../util/compare";
import {scrapByMetalInSync} from "../../services/scrapService";
import {capitalizeFirstLetter, getAvailabilityChipComponent} from "../../util/utils";
import RefreshIcon from '@mui/icons-material/Refresh';
import {BoxChart} from "../../components/BoxChart";
import {
    Button,
    Checkbox,
    Collapse,
    FormControlLabel,
    List,
    ListItemButton,
    TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import ListItemText from "@mui/material/ListItemText";
import {Form} from "../../types/enums/form";
import {Dealer} from "../../types/enums/dealer";
import {useTranslation} from "react-i18next";
import {Availability} from "../../types/enums/availability";
import {Price} from "../../types/Price";


interface FilterDealer {
    id: number;
    value: Dealer;
    checked: boolean;
}

interface FilterForm {
    id: number;
    value: Form;
    checked: boolean;
}

interface FilterAvailability {
    id: number;
    value: Availability;
    checked: boolean;
}

export const ProductTablePage = () =>  {
    const { t } = useTranslation();
    const { metal } = useParams();
    const [products, setProducts] = useState<Product[]>([])
    const [productsControlled, setProductsControlled] = useState<Product[]>([])

    const [loading, setLoading] = useState<boolean>(true);
    const [excludeUnavailable, setExcludeUnavailable] = useState<boolean>(true);

    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(100);
    const [filterForms, setFilterForms] = useState<FilterForm[]>([])
    const [filterDealers, setFilterDealers] = useState<FilterDealer[]>([])
    const [filterAvailability, setFilterAvailability] = useState<FilterAvailability[]>([])

    const [openFilterForm, setOpenFilterForm] = useState<boolean>(true);
    const [openFilterDealer, setOpenFilterDealer] = useState<boolean>(true);
    const [openFilterAvailability, setOpenFilterAvailability] = useState<boolean>(true);



    const handleFilterFormChecked = (id: number) => {
        setFilterForms(filterForms.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const handleFilterDealerChecked = (id: number) => {
        setFilterDealers(filterDealers.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const handleFilterAvailabilityChecked = (id: number) => {
        setFilterAvailability(filterAvailability.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const min = Number(event.target.value)
        if(min < maxPrice) {
            setMinPrice(min);
        }
        // if(min < 0) {
        //     setMinPrice(0);
        // }
    };

    const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const max = Number(event.target.value);
        if(minPrice < max) {
            setMaxPrice(max);
        }
    };

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

    const getProducts = () => {
        setLoading(true)
        getProductsAsDTO(
            undefined,
            undefined,
            metal,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined
        ).then((page) => {
            let formSet = new Set<Form>();
            const tmpProducts: Product[] = page.content;
            let tmpMaxPrice: number = 0;
            tmpProducts.forEach(
                product => {
                    formSet.add(product.form);
                    product.bestPrice = product.latestPrices.sort(compareByPrice)[0];
                    product.bestRedemption = product.latestPrices.sort(compareByRedemption)[0];
                    if(product.bestPrice.price > tmpMaxPrice) {
                        tmpMaxPrice = product.bestPrice.price;
                    }
                }
            )
            const latestPrices: Price[] = tmpProducts.flatMap(x => x.latestPrices);
            const dealerSet = new Set(latestPrices.map(x => x.dealer));
            const availabilitySet = new Set(latestPrices.map(x => x.availability).filter(x => x !== null));
            setFilterDealers(Array.from(dealerSet).map((value, index) => ({id: index, value: value, checked: true})));
            setFilterForms(Array.from(formSet).map((value, index) => ({id: index, value: value, checked: true})));
            setFilterAvailability(Array.from(availabilitySet).map((value, index) => ({id: index, value: value, checked: true})));
            setMaxPrice(tmpMaxPrice);
            setProducts(tmpProducts);
            setLoading(false);
        });
    }


    useEffect(() => {
        getProducts();
    }, [metal])

    /**
     * Activate filtration on any filter change
     */
    useEffect(() => {
        setProductsControlled(
            filterProducts()
        );
    }, [products, minPrice, maxPrice, filterForms, filterDealers, filterAvailability, excludeUnavailable])

    return (
        <Box sx={{width: 1}}>
            <PageTitle sx={{mb: '2rem'}}>
                {capitalizeFirstLetter(metal)} products
            </PageTitle>

            {/* BUTTONS */}
            <BoxRow sx={{justifyContent: 'flex-end', mt: "1rem", mb: "0.5rem"}}>
                <Button
                    onClick = {() => getProducts()}
                    startIcon={<RefreshIcon/>}
                    disabled={loading}
                    variant="contained"
                >
                    Refresh products
                </Button>
                <Button
                    onClick = {() => scrapByMetalInSync(metal)}
                    startIcon={<PlayCircleOutlineIcon/>}
                    variant="contained"
                >
                    Scrap {metal} prices
                </Button>
            </BoxRow>

            {/* FILTER */}
            <BoxChart sx={{ width: '1', gap: 0, mb: 2, display: 'flex', flexDirection: 'column' }}>
                <BoxRow sx={{gap: "1rem", display: 'inline-flex', width: '1', mb: "1rem"}}>
                    <TextField
                        label="Min. price"
                        type="number"
                        inputProps={{
                            step: '10'
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="standard"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                    />
                    <Typography sx={{pt: "1rem"}}>-</Typography>
                    <TextField
                        label="Max. price"
                        type="number"
                        inputProps={{
                            step: '10'
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="standard"
                        value={Math.round(maxPrice)}
                        onChange={handleMaxPriceChange}
                    />
                </BoxRow>

                <List sx={{ width: 1, bgcolor: 'whitesmoke', p: 0}}>
                    <ListItemButton sx={{borderRadius: 3}} onClick={() => setOpenFilterForm(!openFilterForm)}>
                        <ListItemText primary="Form" />
                        {openFilterForm ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openFilterForm} timeout="auto" unmountOnExit>
                        {
                            filterForms.map((form: FilterForm) => (
                                <FormControlLabel
                                    sx={{ml: "2rem"}}
                                    key={form.id}
                                    label={form.value.toLowerCase()}
                                    control={
                                        <Checkbox
                                            checked={form.checked}
                                            onChange={() => handleFilterFormChecked(form.id)}
                                        />
                                    }
                                />
                            ))
                        }
                    </Collapse>
                </List>

                <List sx={{ width: 1, bgcolor: 'whitesmoke', p: 0}}>
                    <ListItemButton sx={{borderRadius: 3}} onClick={() => setOpenFilterDealer(!openFilterDealer)}>
                        <ListItemText primary="Dealer" />
                        {openFilterDealer ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openFilterDealer} timeout="auto" unmountOnExit>
                        {
                            filterDealers.map((dealer: FilterDealer) => (
                                <FormControlLabel
                                    sx={{ml: "2rem"}}
                                    key={dealer.id}
                                    label={t(dealer.value.toLowerCase())}
                                    control={
                                        <Checkbox
                                            checked={dealer.checked}
                                            onChange={() => handleFilterDealerChecked(dealer.id)}
                                        />
                                    }
                                />
                            ))
                        }
                    </Collapse>
                </List>

                <List sx={{ width: 1, bgcolor: 'whitesmoke', p: 0}}>
                    <ListItemButton sx={{borderRadius: 3}} onClick={() => setOpenFilterAvailability(!openFilterAvailability)}>
                        <ListItemText primary="Availability" />
                        {openFilterAvailability ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openFilterAvailability} timeout="auto" unmountOnExit>
                        {
                            filterAvailability.map((filter: FilterAvailability) => (
                                <FormControlLabel
                                    sx={{ml: "2rem"}}
                                    key={filter.id}
                                    label={getAvailabilityChipComponent(filter.value)}
                                    control={
                                        <Checkbox
                                            checked={filter.checked}
                                            onChange={() => handleFilterAvailabilityChecked(filter.id)}
                                        />
                                    }
                                />
                            ))
                        }
                    </Collapse>
                </List>

                <FormControlLabel
                    sx={{ml: "2rem", mt: "1rem"}}
                    label={"exclude unavailable products"}
                    control={
                        <Checkbox
                            checked={excludeUnavailable}
                            onChange={(e) => setExcludeUnavailable(e.target.checked)}
                        />
                    }
                />
            </BoxChart>

            <Box sx={{ height: 700, width: '100%', mb: '3rem' }}>
                <Box sx={{ display: 'flex', height: '100%' }}>
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
