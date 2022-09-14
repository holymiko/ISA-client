import Typography from '@mui/material/Typography';
import Box, {BoxProps} from "@mui/material/Box";

export interface TitleProps extends BoxProps{
    children: any;
}

export const PageTitle = (props: TitleProps) => {
    return (
        <Box sx={{mb: '3rem', ...props.sx,}} >
            <Typography
                sx={{
                    textAlign: 'left',
                    borderBottom: 1,
                    borderColor: "black",
                    borderWidth: "0.15rem",
                    pb: "0.3rem",
                    pl: "1rem",
                }}
                variant='h4'
                component='h4'
            >
                {props.children}
            </Typography>
        </Box>
    );
};