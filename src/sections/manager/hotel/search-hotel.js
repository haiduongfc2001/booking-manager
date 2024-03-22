import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";

// Search for hotels
export const SearchHotel = () => (
  <OutlinedInput
    defaultValue=""
    fullWidth
    placeholder="Tìm kiếm khách sạn"
    startAdornment={
      <InputAdornment position="start">
        <SvgIcon color="action" fontSize="small">
          <MagnifyingGlassIcon />
        </SvgIcon>
      </InputAdornment>
    }
    sx={{ maxWidth: 500 }}
  />
);
