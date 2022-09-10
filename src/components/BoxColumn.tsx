import Box, { BoxProps } from '@mui/material/Box';

export interface BoxExtendingProps extends BoxProps {
  children: any;
}

/**
 * Wraps components in column.
 * Has a 1rem gap between items.
 * @param props
 * @constructor
 */
export const BoxColumn = (props: BoxExtendingProps) => {
  return (
    <Box
      sx={{
        ...props.sx,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {props.children}
    </Box>
  );
};
