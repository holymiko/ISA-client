import Typography, {TypographyProps} from '@mui/material/Typography';

export interface TitleProps extends TypographyProps{
    children: any;
}

export const TypographyH6Bold = (props: TitleProps) => {
    return (
        <Typography
            sx={{
                fontWeight: "bold",
                ...props.sx,
            }}
            variant='h6'
            component='h6'
        >
            {props.children}
        </Typography>
    );
};