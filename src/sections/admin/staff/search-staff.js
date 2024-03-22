import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { InputAdornment, OutlinedInput, SvgIcon, Button } from "@mui/material";

export const SearchStaff = () => (
  <OutlinedInput
    defaultValue=""
    fullWidth
    placeholder="Tìm kiếm nhân viên"
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
