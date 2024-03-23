import { useTheme } from "@emotion/react";
import { darken, lighten, styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";

const getBackgroundColor = (color, mode) =>
  mode === "dark" ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBackgroundColor = (color, mode) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

const getSelectedBackgroundColor = (color, mode) =>
  mode === "dark" ? darken(color, 0.5) : lighten(color, 0.5);

const getSelectedHoverBackgroundColor = (color, mode) =>
  mode === "dark" ? darken(color, 0.4) : lighten(color, 0.4);

export const StyledDataGrid = styled(DataGrid)(() => {
  const theme = useTheme();

  return {
    "& .super-app-theme--status-available": {
      backgroundColor: getBackgroundColor(
        theme.palette.background.success.light,
        theme.palette.mode
      ),
      "&:hover": {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.background.success.main,
          theme.palette.mode
        ),
      },
      "&.Mui-selected": {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.background.success.main,
          theme.palette.mode
        ),
        "&:hover": {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.background.success.main,
            theme.palette.mode
          ),
        },
      },
    },
    "& .super-app-theme--status-unavailable": {
      backgroundColor: getBackgroundColor(theme.palette.background.error.main, theme.palette.mode),
      "&:hover": {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.background.error.main,
          theme.palette.mode
        ),
      },
      "&.Mui-selected": {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.background.error.main,
          theme.palette.mode
        ),
        "&:hover": {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.background.error.main,
            theme.palette.mode
          ),
        },
      },
    },
  };
});
