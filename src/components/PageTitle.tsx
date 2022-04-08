import Typography, {TypographyProps} from '@mui/material/Typography';

export interface TitleProps extends TypographyProps{
    children: any;
}

export const PageTitle = (props: TitleProps) => {
    return (
        <Typography
            sx={{
                ...props.sx,
                textAlign: 'center',
                my: '3rem',
            }}
            variant='h4'
            component='h4'
        >
            {props.children}
        </Typography>
    );
};