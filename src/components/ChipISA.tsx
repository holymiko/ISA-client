import {Chip, ChipProps} from "@mui/material";
import Typography from "@mui/material/Typography";


export const ChipISA = (props: ChipProps) => {
    return <Chip
        sx={{chipCustom: {
            borderRadius: '9px', //some style
            '& .MuiChip-label': {fontSize: 23}, // sub-selector
        }, ...props.sx}}
        label={<Typography sx={{fontWeight: "bold",}}>{props.label}</Typography>}
        style={props.style}
        color={props.color}
    />
};
