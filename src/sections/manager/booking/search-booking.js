import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";

// Search for Bookings
export const SearchBooking = () => (
  <OutlinedInput
    defaultValue=""
    fullWidth
    placeholder="Tìm kiếm đơn đặt phòng"
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
