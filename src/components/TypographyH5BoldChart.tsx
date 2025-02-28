import Typography, {TypographyProps} from '@mui/material/Typography';

export interface TitleProps extends TypographyProps{
    children: any;
}

export const TypographyH5BoldChart = (props: TitleProps) => {
    return (
        <Typography
            sx={{
                textAlign: 'left',
                pb: "0.3rem",
                pl: "2rem",
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