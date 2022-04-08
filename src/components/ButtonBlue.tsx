import {Button, ButtonProps} from "@mui/material";

export const ButtonBlue = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      sx={{
        ...props.sx,
        my: '1rem',
      }}
      variant="contained"
    >
      {props.children}
    </Button>
  );
};