import * as React from "react";
import {BoxChart} from "./BoxChart";
import {FilterCollapseItem} from "./FilterCollapseItem";
import {BoxRow} from "./BoxRow";
import {Checkbox, FormControlLabel, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {getAvailabilityChipComponent} from "../util/utils";
import {useState} from "react";
import {Form} from "../types/enums/form";
import {Availability} from "../types/enums/availability";
import {Dealer} from "../types/enums/dealer";
import {useTranslation} from "react-i18next";


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
                label={"exclude unavailable products"}
                control={
                    <Checkbox
                        checked={excludeUnavailable}
                        onChange={(e) => setExcludeUnavailable(e.target.checked)}
                    />
                }
            />
        </BoxChart>
  );
};


