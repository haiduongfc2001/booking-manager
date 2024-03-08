import PropTypes from "prop-types";
import { Box, Card, Typography } from "@mui/material";
import { useState } from "react";
import DeleteHotel from "./DeleteHotel";
import EditHotel from "./EditHotel";
import DetailHotel from "./DetailHotel";
import LoadingData from "src/layouts/loading/LoadingData";
import { Scrollbar } from "src/components/ScrollBar";
import { columns } from "./columns";
import CustomDataGrid from "src/components/data-grid/CustomDataGrid";
import { ErrorOutline } from "@mui/icons-material";

// The table displays the list of hotels
export const HotelsTable = (props) => {
  const { items = [], loading = false, onRefresh = () => {} } = props;

  const [currentId, setCurrentId] = useState("");
  const [isModalDeleteHotel, setIsModalDeleteHotel] = useState(false);
  const [isModalEditHotel, setIsModalEditHotel] = useState(false);
  const [isModalDetailHotel, setIsModalDetailHotel] = useState(false);

  const handleOpenModalDelete = (id) => {
    setCurrentId(id);
    setIsModalDeleteHotel(true);
  };

  const handleOpenModalEdit = (id) => {
    setCurrentId(id);
    setIsModalEditHotel(true);
  };

  const handleOpenModalDetail = (id) => {
    setCurrentId(id);
    setIsModalDetailHotel(true);
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            {loading ? (
              <LoadingData />
            ) : items && items.length > 0 ? (
              <CustomDataGrid
                items={items}
                columns={columns({
                  handleOpenModalDetail,
                  handleOpenModalDelete,
                  handleOpenModalEdit,
                })}
              />
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

      <DeleteHotel
        isModalDeleteHotel={isModalDeleteHotel}
        setIsModalDeleteHotel={setIsModalDeleteHotel}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />

      <EditHotel
        isModalEditHotel={isModalEditHotel}
        setIsModalEditHotel={setIsModalEditHotel}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />

      <DetailHotel
        isModalDetailHotel={isModalDetailHotel}
        setIsModalDetailHotel={setIsModalDetailHotel}
        currentId={parseInt(currentId)}
      />
    </>
  );
};

HotelsTable.propTypes = {
  items: PropTypes.array,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
};
