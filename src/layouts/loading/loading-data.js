/**
 * © Copyright OpenWay VietNam
 * @author duongdh
 * @create date 2023-11-22 11:48:31
 * @desc Component Loading while waiting for data returned from the server
 */
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import FontSize from "../layouts/FontSize";
import { TableStyle } from "./TableStyle";

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
        <Typography sx={{ ml: 2, fontSize: FontSize.VeryNormal }}>
          Loading...
        </Typography>
      </Grid>
    </Box>
  );
}

export default LoadingData;
