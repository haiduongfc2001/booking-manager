import PropTypes from "prop-types";
import { Box, Card, Typography } from "@mui/material";
import { useState } from "react";
import LoadingData from "src/layouts/loading/loading-data";
import { Scrollbar } from "src/components/scroll-bar";
import { columns } from "./columns";
import CustomDataGrid from "src/components/data-grid/custom-data-grid";
import { ErrorOutline } from "@mui/icons-material";

// The table displays the list of rooms
export const RoomTable = (props) => {
  const { items = [], loading = false } = props;

  const [currentId, setCurrentId] = useState("");

  const handleRowClick = (params) => {
    const clickedItem = items.find((item) => item.id === params.id);
    if (clickedItem) {
      setCurrentId(clickedItem?.id);
    } else {
      console.log("Item not found!");
    }
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            {loading ? (
              <LoadingData />
            ) : items && items.length > 0 ? (
              <CustomDataGrid rows={items} columns={columns({})} onRowClick={handleRowClick} />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  p: 2,
                }}
              >
                <ErrorOutline sx={{ mr: 1 }} />
                <Typography variant="body1" color="neutral.900">
                  No data available
                </Typography>
              </Box>
            )}
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

RoomTable.propTypes = {
  items: PropTypes.array,
  loading: PropTypes.bool,
};
