import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Theme,
    useTheme
} from "@mui/material";
import {Role} from "../types/enums/role";
import React from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, roles: readonly string[], theme: Theme) {
    return {
        fontWeight:
            roles.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

interface FormControlRolesProps {
    roles: string;
    hasRolesError: boolean;
    handleRoles: (e: SelectChangeEvent) => void;
    rolesForSelect: string[];
}

/**
 * Grey background, round edges
 * @param props
 * @constructor
 */
export const FormControlRoles = ({roles, handleRoles, hasRolesError, rolesForSelect}: FormControlRolesProps) => {
    const theme = useTheme();
    const roles2 = ['CLIENT', 'SUPER_ADMIN']
    return (
        <FormControl sx={{ minWidth: 281, width: 0.2 }} error={hasRolesError}>
            <InputLabel>Role</InputLabel>
            <Select
                value={roles}
                onChange={handleRoles}
                input={<OutlinedInput label="Role" />}
                MenuProps={MenuProps}
            >
                <MenuItem
                    key={Role.USER}
                    value={Role.USER}
                    style={getStyles(Role.USER, roles2, theme)}
                    disabled={!rolesForSelect.includes(Role.USER)}
                >
                    {Role.USER}
                </MenuItem>
                <MenuItem
                    key={Role.CLIENT}
                    value={Role.CLIENT}
                    style={getStyles(Role.CLIENT, roles2, theme)}
                    disabled={!rolesForSelect.includes(Role.CLIENT)}
                >
                    {Role.CLIENT}
                </MenuItem>
                <MenuItem
                    key={Role.DEALER}
                    value={Role.DEALER}
                    style={getStyles(Role.DEALER, roles2, theme)}
                    disabled={!rolesForSelect.includes(Role.DEALER)}
                >
                    {Role.DEALER}
                </MenuItem>
                <MenuItem
                    key={Role.ADMIN}
                    value={Role.ADMIN}
                    style={getStyles(Role.ADMIN, roles2, theme)}
                    disabled={!rolesForSelect.includes(Role.ADMIN)}
                >
                    {Role.ADMIN}
                </MenuItem>
                <MenuItem
                    key={Role.SUPER_ADMIN}
                    value={Role.SUPER_ADMIN}
                    style={getStyles(Role.SUPER_ADMIN, roles2, theme)}
                    disabled={!rolesForSelect.includes(Role.SUPER_ADMIN)}
                >
                    {Role.SUPER_ADMIN}
                </MenuItem>
            </Select>
            <FormHelperText>{hasRolesError ? 'At least one role has to be chosen' : ''}</FormHelperText>
        </FormControl>
    );
};


