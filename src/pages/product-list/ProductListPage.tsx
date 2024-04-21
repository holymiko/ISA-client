import React, {useEffect, useState} from 'react';
import {BoxRow} from "../../components/BoxRow";
import {PageTitle} from "../../components/PageTitle";
import {getProductsAsDTO} from "../../services/productService";
import {Product} from "../../types/Product";
import {DataGrid} from "@mui/x-data-grid";
import {productListColumns} from "./productListColumns";
import Box from "@mui/material/Box";
import {useParams} from "react-router-dom";
import {compareByPrice, compareByRedemption} from "../../util/compare";
import {scrapByMetalInSync} from "../../services/scrapService";
import {capitalizeFirstLetter} from "../../util/utils";
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


interface MetalForm {
    id: number;
    value: Form;
    checked: boolean;
}

export const ProductListPage = () =>  {
    const { metal } = useParams();
    const [products, setProducts] = useState<Product[]>([])
    const [productsControlled, setProductsControlled] = useState<Product[]>([])

    const [loading, setLoading] = useState<boolean>(true);
    const [excludeUnavailable, setExcludeUnavailable] = useState<boolean>(true);

    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(100);
    const [metalForms, setMetalForms] = useState<MetalForm[]>([])

    const [openFilterForm, setOpenFilterForm] = useState<boolean>(false);


    const handleMetalFormsChecked = (id: number) => {
        setMetalForms(metalForms.map(item =>
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
        const metalFormValues: Form[] = metalForms.filter(x => x.checked).map(x => x.value)
        let tmpProducts: Product[] = products;
        if(excludeUnavailable) {
            tmpProducts = tmpProducts.filter(x => x.bestPrice?.price !== 0 || x.bestRedemption?.redemption !== 0)
        }
        tmpProducts = tmpProducts.filter(x => {
            // For moment of initialization
            if(x.bestPrice === undefined) {
                return true;
            }
            // Form
            if(!metalFormValues.includes(x.form)) {
                return false;
            }
            // Price
            return x.bestPrice!.price >= minPrice && x.bestPrice!.price <= maxPrice
        })
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
            let tmpMetalFormSet = new Set<Form>();
            const tmpProducts: Product[] = page.content;
            let tmpMaxPrice: number = 0;
            tmpProducts.forEach(
                product => {
                    tmpMetalFormSet.add(product.form);
                    product.bestPrice = product.latestPrices.sort(compareByPrice)[0];
                    product.bestRedemption = product.latestPrices.sort(compareByRedemption)[0];
                    if(product.bestPrice.price > tmpMaxPrice) {
                        tmpMaxPrice = product.bestPrice.price;
                    }
                }
            )
            setMetalForms(Array.from(tmpMetalFormSet).map((value, index) => ({id: index, value: value, checked: true})));
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
    }, [products, minPrice, maxPrice, metalForms, excludeUnavailable])

    return (
        <Box>
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

                <List sx={{ width: 1, bgcolor: 'whitesmoke'}}>
                    <ListItemButton sx={{borderRadius: 3}} onClick={() => setOpenFilterForm(!openFilterForm)}>
                        <ListItemText primary="Forms" />
                        {openFilterForm ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openFilterForm} timeout="auto" unmountOnExit>
                        {
                            metalForms.map((form: MetalForm) => (
                                <FormControlLabel
                                    sx={{ml: "2rem"}}
                                    key={form.id}
                                    label={form.value}
                                    control={
                                        <Checkbox
                                            checked={form.checked}
                                            onChange={() => handleMetalFormsChecked(form.id)}
                                        />
                                    }
                                />
                            ))
                        }
                    </Collapse>
                </List>

                <FormControlLabel
                    sx={{ml: "2rem"}}
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
