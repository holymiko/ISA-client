import * as React from "react";
import {BoxChart} from "./BoxChart";
import {FilterCollapseItem} from "./FilterCollapseItem";
import {BoxRow} from "./BoxRow";
import {Checkbox, FormControlLabel, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {getAvailabilityChipComponent, isEmpty} from "../util/utils";
import {useState} from "react";
import {Form} from "../types/enums/form";
import {Availability} from "../types/enums/availability";
import {Dealer} from "../types/enums/dealer";
import {useTranslation} from "react-i18next";
import {Product} from "../types/Product";
import {Price} from "../types/Price";
import {compareByPrice, compareByRedemption} from "../util/compare";


export interface FilterDealer {
    id: number;
    value: Dealer;
    checked: boolean;
}

export interface FilterForm {
    id: number;
    value: Form;
    checked: boolean;
}

export interface FilterAvailability {
    id: number;
    value: Availability;
    checked: boolean;
}

export interface FilterProps {
    minPrice: number,
    setMinPrice: any,
    maxPrice: number,
    setMaxPrice: any,
    filterForms: FilterForm[],
    setFilterForms: any,
    filterDealers: FilterDealer[],
    setFilterDealers: any,
    filterAvailability: FilterAvailability[],
    setFilterAvailability: any,
    excludeUnavailable: boolean,
    setExcludeUnavailable: any,
}


export const initFilter = (tmpProducts: Product[], {setMinPrice, setMaxPrice, setFilterForms,
    setFilterDealers, setFilterAvailability, setExcludeUnavailable}: any
) => {
    const latestPrices: Price[] = tmpProducts.flatMap(x => x.latestPrices);
    latestPrices.forEach(x => {
        if(x.availability === null) {
            x.availability = Availability.UNKNOWN
        }
    });
    let tmpMaxPrice: number = 0;
    tmpProducts.forEach(
        product => {
            product.bestPrice = product.latestPrices.sort(compareByPrice)[0];
            product.bestRedemption = product.latestPrices.sort(compareByRedemption)[0];
            if (product.bestPrice?.price > tmpMaxPrice) {
                tmpMaxPrice = product.bestPrice.price;
            }
        })

    let tmp = localStorage.getItem('filterMinPrice')
    if(isEmpty(tmp)) {
        setMinPrice(0)
        localStorage.setItem('filterMinPrice', JSON.stringify(0))
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
        const forms = Object.values(Form).map((value, index) => ({id: index, value: value, checked: true}));
        setFilterForms(forms);
        localStorage.setItem('filterForms', JSON.stringify(forms))
    } else {
        setFilterForms(JSON.parse(tmp!))
    }

    tmp = localStorage.getItem('filterDealers')
    if((isEmpty(tmp) || tmp === '[]')) {
        const tmpDealers = Object.values(Dealer).map((value, index) => ({id: index, value: value, checked: true}))
        setFilterDealers(tmpDealers);
        localStorage.setItem('filterDealers', JSON.stringify(tmpDealers))
    } else {
        setFilterDealers(JSON.parse(tmp!))
    }

    tmp = localStorage.getItem('filterAvailability')
    if(isEmpty(tmp) || tmp === '[]') {
        const tmpAvailability = Object.values(Availability).sort().map((value, index) => (
            value === Availability.UNAVAILABLE || value === Availability.SOLD_OUT || value === Availability.UNKNOWN
                ? {id: index, value: value, checked: false}
                : {id: index, value: value, checked: true}
        ))
        setFilterAvailability(tmpAvailability);
        localStorage.setItem('filterAvailability', JSON.stringify(tmpAvailability))
    } else {
        setFilterAvailability(JSON.parse(tmp!))
    }

    tmp = localStorage.getItem('filterExcludeUnavailable')
    if(isEmpty(tmp)) {
        setExcludeUnavailable(true);
        localStorage.setItem('filterExcludeUnavailable', JSON.stringify(true))
    } else {
        setExcludeUnavailable(JSON.parse(tmp!))
    }
}

export const filterProducts = (
    products: Product[],
    minPrice: number,
    maxPrice: number,
    filterForms: FilterForm[],
    filterDealers: FilterDealer[],
    filterAvailability: FilterAvailability[],
    excludeUnavailable: boolean
): Product[] => {
    if(products.length === 0 || filterForms.length === 0 || filterDealers.length === 0 || filterAvailability.length === 0) {
        return products;
    }
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


export const Filter = ({
    minPrice, setMinPrice, maxPrice, setMaxPrice, filterForms, setFilterForms,
    filterDealers, setFilterDealers, filterAvailability, setFilterAvailability,
    excludeUnavailable, setExcludeUnavailable
}: FilterProps) => {
    const { t } = useTranslation();

    const [openFilterPrice, setOpenFilterPrice] = useState<boolean>(true);
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

    return (
        <BoxChart sx={{ width: '1', gap: 0, mb: 2, display: 'flex', flexDirection: 'column' }}>
            <FilterCollapseItem title="Price" openFilter={openFilterPrice} setOpenFilter={setOpenFilterPrice}>
                <BoxRow sx={{gap: "1rem", display: 'inline-flex', width: '1', mb: "1rem", ml: "3rem"}}>
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
            </FilterCollapseItem>

            <FilterCollapseItem title="Form" openFilter={openFilterForm} setOpenFilter={setOpenFilterForm}>
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
            </FilterCollapseItem>

            <FilterCollapseItem title="Dealer" openFilter={openFilterDealer} setOpenFilter={setOpenFilterDealer}>
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
            </FilterCollapseItem>

            <FilterCollapseItem title="Availability" openFilter={openFilterAvailability} setOpenFilter={setOpenFilterAvailability}>
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
            </FilterCollapseItem>

            <FormControlLabel
                sx={{ml: "2rem", mt: "1rem"}}
                label={"include products without price"}
                control={
                    <Checkbox
                        checked={!excludeUnavailable}
                        onChange={(e) => setExcludeUnavailable(!e.target.checked)}
                    />
                }
            />
        </BoxChart>
  );
};


