import Box, { BoxProps } from '@mui/material/Box';


/**
 * Grey background, round edges
 * @param props
 * @constructor
 */
export const BoxChart = (props: BoxProps) => {
    return (
        <Box
            sx={{
                my: "3rem",
                pb: "1rem", pl: "1rem", pr: "2rem", pt: "2rem",
                borderRadius: 3,
                backgroundColor: "whitesmoke",
                ...props.sx,
            }}>
          {props.children}
        </Box>
    );
};
