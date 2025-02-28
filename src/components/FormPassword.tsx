import {FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput} from '@mui/material';
import React, {ChangeEvent} from 'react';
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface FormPasswordProps {
  hasPasswordError: boolean;
  handlePassword: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: () => void;
  inputLabel: string;
  password: string;
  passwordHelperText: string;
}

export const FormPassword = (
  {hasPasswordError, setShowPassword, showPassword, handlePassword, inputLabel, password, passwordHelperText}: FormPasswordProps
) => {
  return (
    <FormControl sx={{minWidth: 281, width: 0.2}} variant="outlined" error={hasPasswordError}>
      <InputLabel>{inputLabel}</InputLabel>
      <OutlinedInput
        sx={{backgroundColor: "white"}}
        label={inputLabel}
        value={password}
        type={showPassword ? 'text' : 'password'}
        onChange={handlePassword}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={setShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText>{passwordHelperText}</FormHelperText>
    </FormControl>
  )
}