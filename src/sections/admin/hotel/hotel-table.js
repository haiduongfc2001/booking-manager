import PropTypes from "prop-types";
import { Box, Card, Typography } from "@mui/material";
import { useState } from "react";
import DeleteHotel from "./delete-hotel";
import UpdateHotel from "./update-hotel";
import DetailHotel from "./detail-hotel";
import { Scrollbar } from "src/components/scroll-bar";
import { columns } from "./columns";
import CustomDataGrid from "src/components/data-grid/custom-data-grid";
import { ErrorOutline } from "@mui/icons-material";
import { DATAGRID_OPTIONS } from "src/constant/constants";

// The table displays the list of hotels
export const HotelTable = (props) => {
  const { items = [], onRefresh = () => {} } = props;

  const [currentId, setCurrentId] = useState("");
  const [isModalDeleteHotel, setIsModalDeleteHotel] = useState(false);
  const [isModalUpdateHotel, setIsModalUpdateHotel] = useState(false);
  const [isModalDetailHotel, setIsModalDetailHotel] = useState(false);

  const handleRowClick = (params) => {
    const clickedItem = items?.find((item) => item.id === params.id);
    if (clickedItem) {
      setCurrentId(clickedItem?.id);
    } else {
      console.log("Item not found!");
    }
  };

  const handleOpenModalDelete = () => {
    setIsModalDeleteHotel(true);
  };

  const handleOpenModalUpdate = () => {
    setIsModalUpdateHotel(true);
  };

  const handleOpenModalDetail = () => {
    setIsModalDetailHotel(true);
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ width: "100%" }}>
            {items?.length > 0 ? (
              <CustomDataGrid
                rows={items}
                columns={columns({
                  handleOpenModalDetail,
                  handleOpenModalDelete,
                  handleOpenModalUpdate,
                })}
                onRowClick={handleRowClick}
                height={DATAGRID_OPTIONS.TABLE_HEIGHT_10_ITEMS}
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

      <DeleteHotel
        isModalDeleteHotel={isModalDeleteHotel}
        setIsModalDeleteHotel={setIsModalDeleteHotel}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />

      <UpdateHotel
        isModalUpdateHotel={isModalUpdateHotel}
        setIsModalUpdateHotel={setIsModalUpdateHotel}
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

HotelTable.propTypes = {
  items: PropTypes.array,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
};
