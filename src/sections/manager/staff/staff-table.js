import PropTypes from "prop-types";
import { Box, Card, Typography } from "@mui/material";
import { useState } from "react";
import DeleteStaff from "./delete-staff";
import EditStaff from "./edit-staff";
import DetailStaff from "./detail-staff";
import LoadingData from "src/layouts/loading/loading-data";
import { Scrollbar } from "src/components/scroll-bar";
import { columns } from "./columns";
import CustomDataGrid from "src/components/data-grid/custom-data-grid";
import { ErrorOutline } from "@mui/icons-material";
import { HOTEL_ID_FAKE } from "src/constant/constants";

export const StaffTable = (props) => {
  const { items = [], loading = false, onRefresh = () => {} } = props;

  const [currentId, setCurrentId] = useState("");
  const [hotelId, setHotelId] = useState(HOTEL_ID_FAKE);
  const [isModalDeleteStaff, setIsModalDeleteStaff] = useState(false);
  const [isModalEditStaff, setIsModalEditStaff] = useState(false);
  const [isModalDetailStaff, setIsModalDetailStaff] = useState(false);

  const handleRowClick = (params) => {
    const clickedItem = items.find((item) => item.id === params.id);
    if (clickedItem) {
      setCurrentId(clickedItem?.id);
    } else {
      console.log("Item not found!");
    }
  };

  const handleOpenModalDetail = () => {
    setIsModalDetailStaff(true);
  };

  const handleOpenModalDelete = () => {
    setIsModalDeleteStaff(true);
  };

  const handleOpenModalEdit = () => {
    setIsModalEditStaff(true);
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ width: "100%" }}>
            {loading ? (
              <LoadingData />
            ) : items && items.length > 0 ? (
              <CustomDataGrid
                rows={items}
                columns={columns({
                  handleOpenModalDetail,
                  handleOpenModalDelete,
                  handleOpenModalEdit,
                })}
                onRowClick={handleRowClick}
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
                  Không có dữ liệu!
                </Typography>
              </Box>
            )}
          </Box>
        </Scrollbar>
      </Card>

      <DeleteStaff
        isModalDeleteStaff={isModalDeleteStaff}
        setIsModalDeleteStaff={setIsModalDeleteStaff}
        hotelId={parseInt(hotelId)}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />
      <EditStaff
        isModalEditStaff={isModalEditStaff}
        setIsModalEditStaff={setIsModalEditStaff}
        hotelId={parseInt(hotelId)}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />
      <DetailStaff
        isModalDetailStaff={isModalDetailStaff}
        setIsModalDetailStaff={setIsModalDetailStaff}
        hotelId={parseInt(hotelId)}
        currentId={parseInt(currentId)}
      />
    </>
  );
};

StaffTable.propTypes = {
  items: PropTypes.array,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
};
