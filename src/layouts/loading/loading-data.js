import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { TableStyle } from "src/layouts/table-style";
import FontSize from "src/layouts/font-size";

// LoadingData component
function LoadingData() {
  return (
    <Box sx={TableStyle}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2.5,
        }}
      >
        <CircularProgress size={60} />
        <Typography sx={{ ml: 2, fontSize: FontSize.VeryNormal }}>Loading...</Typography>
      </Grid>
    </Box>
  );
}

export default LoadingData;
