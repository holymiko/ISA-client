import Box, { BoxProps } from '@mui/material/Box';


/**
 * Wraps children into column.
 * Takes 100% of height.
 * @param props
 * @constructor
 */
export const BoxColumnCenter = (props: BoxProps) => {
  return (
    <Box
        display={'flex'}
        alignContent={'center'}
        alignItems={'center'}
        sx={{height: 1.0, ...props.sx}}
    >
      {props.children}
    </Box>
  );
};
