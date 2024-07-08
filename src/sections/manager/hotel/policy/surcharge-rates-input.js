import React from "react";
import { TextField, Stack, InputAdornment, Button, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const SurchargeRatesInput = ({ values, handleChange, handleAddAgeRange, handleRemoveAgeRange }) => {
  return (
    <Stack spacing={2}>
      {Object.keys(values.SURCHARGE_RATES).map((ageRange, index) => (
        <Stack key={index} direction="row" alignItems="center" spacing={2}>
          <TextField
            fullWidth
            label={`Độ tuổi ${ageRange}`}
            name={`SURCHARGE_RATES.${ageRange}`}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            value={values.SURCHARGE_RATES[ageRange]}
            onChange={handleChange}
          />
          {/* <IconButton color="error" onClick={() => handleRemoveAgeRange(ageRange)}>
            <RemoveCircleOutlineIcon />
          </IconButton> */}
        </Stack>
      ))}
      {/* <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={handleAddAgeRange}>
        Thêm độ tuổi
      </Button> */}
    </Stack>
  );
};

export default SurchargeRatesInput;
