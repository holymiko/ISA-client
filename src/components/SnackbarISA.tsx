import * as React from 'react';
import { AlertColor, Snackbar, SnackbarProps} from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

export interface SnackBarProps extends SnackbarProps{
  severity: AlertColor,
  open: boolean;
  setOpen: (value: boolean) => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const SnackbarISA = ({severity, children, open, setOpen}: SnackBarProps) => {

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {children}
      </Alert>
    </Snackbar>
  );
}
