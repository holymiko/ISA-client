import {Button, ButtonProps} from "@mui/material";


export const ButtonISA = (props: ButtonProps) => {
    return(
        <Button
            variant='contained'
            {...props}
            sx={{
                ...props.sx,
                fontWeight: "bold",
                backgroundColor: process.env.REACT_APP_NEXUS_BLUE
            }}
        >
            {props.children}
        </Button>
    );
}