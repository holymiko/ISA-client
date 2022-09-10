import Box, { BoxProps } from '@mui/material/Box';


/**
 * Wraps children into row.
 * Takes 100% of width.
 * Has a 1rem gap between items.
 * @param props
 * @constructor
 */
export const BoxRow = (props: BoxProps) => {
  return (
    <Box
      sx={{
        ...props.sx,
        display: 'inline-flex',
        gap: '1rem',
        width: '1',
      }}
    >
      {props.children}
    </Box>
  );
};
