import Typography, {TypographyProps} from '@mui/material/Typography';

export interface TitleProps extends TypographyProps{
    children: any;
}

export const TypographyH5Bold = (props: TitleProps) => {
    return (
        <Typography
            sx={{
                fontWeight: "bold",
                ...props.sx,
            }}
            variant='h5'
            component='h5'
        >
            {props.children}
        </Typography>
    );
};