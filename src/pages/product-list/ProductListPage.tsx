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
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Slider, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

export const ProductListPage = () =>  {
    const { metal } = useParams();
    const [products, setProducts] = useState<Product[]>([])
    const [productsControlled, setProductsControlled] = useState<Product[]>([])

    const [loading, setLoading] = useState<boolean>(true);
    const [excludeUnavailable, setExcludeUnavailable] = useState<boolean>(true);

    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(100);
    const [form, setForm] = useState<boolean[]>([true, true, true]);


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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExcludeUnavailable(event.target.checked);
    };

    const filterProducts = () => {
        let tmpProducts: Product[] = products;
        if(excludeUnavailable) {
            tmpProducts = tmpProducts.filter(x => x.bestPrice?.price !== 0 || x.bestRedemption?.redemption !== 0)
        }
        tmpProducts = tmpProducts.filter(x => {
            if(x.bestPrice === undefined) {
                return true;
            }
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
            const tmpProducts: Product[] = page.content;
            let tmpMaxPrice: number = 0;
            tmpProducts.forEach(
                product => {
                    product.bestPrice = product.latestPrices.sort(compareByPrice)[0]
                    product.bestRedemption = product.latestPrices.sort(compareByRedemption)[0]
                    if(product.bestPrice.price > tmpMaxPrice) {
                        tmpMaxPrice = product.bestPrice.price
                    }
                }
            )
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
    }, [products, minPrice, maxPrice, excludeUnavailable])

    return (
        <Box>
            <PageTitle sx={{mb: '2rem'}}>
                {capitalizeFirstLetter(metal)} products
            </PageTitle>

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
            <BoxChart sx={{gap: "1rem", display: 'inline-flex', width: '1', mb: "1rem"}}>
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

                {/* TODO Finish impl*/}
                {/*<FormControl component="fieldset" variant="standard">*/}
                {/*    <FormLabel  component="legend">Form</FormLabel>*/}
                {/*    <FormGroup row={true}>*/}
                {/*        <FormControlLabel*/}
                {/*            control={*/}
                {/*                <Checkbox checked={form[0]} onChange={handleChange} />*/}
                {/*            }*/}
                {/*            label="Coin"*/}
                {/*        />*/}
                {/*        <FormControlLabel*/}
                {/*            control={*/}
                {/*                <Checkbox checked={form[1]} onChange={handleChange} />*/}
                {/*            }*/}
                {/*            label="Bar"*/}
                {/*        />*/}
                {/*        <FormControlLabel*/}
                {/*            control={*/}
                {/*                <Checkbox checked={form[2]} onChange={handleChange} />*/}
                {/*            }*/}
                {/*            label="Other"*/}
                {/*        />*/}
                {/*    </FormGroup>*/}
                {/*</FormControl>*/}

                <FormControlLabel
                    sx={{ml: "2rem"}}
                    label={"exclude unavailable products"}
                    control={
                        <Checkbox
                            checked={excludeUnavailable}
                            onChange={handleChange}
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
