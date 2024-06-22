import PropTypes from "prop-types";
import { Box, Card, Typography } from "@mui/material";
import { useState } from "react";
import LoadingData from "src/layouts/loading/loading-data";
import { Scrollbar } from "src/components/scroll-bar";
import { columns } from "./columns";
import CustomDataGrid from "src/components/data-grid/custom-data-grid";
import { ErrorOutline } from "@mui/icons-material";
import DeletePromotion from "./delete-promotion";
import EditPromotion from "./edit-promotion";
import DetailPromotion from "./detail-promotion";

// The table displays the list of promotions
export const PromotionTable = (props) => {
  const {
    roomTypeData = {},
    roomTypeId,
    items = [],
    loading = false,
    onRefresh = () => {},
  } = props;

  const [currentId, setCurrentId] = useState("");
  const [isModalDetailPromotion, setIsModalDetailPromotion] = useState(false);
  const [isModalDeletePromotion, setIsModalDeletePromotion] = useState(false);
  const [isModalEditPromotion, setIsModalEditPromotion] = useState(false);

  const handleRowClick = (params) => {
    const clickedItem = items.find((item) => item.id === params.id);
    if (clickedItem) {
      setCurrentId(clickedItem?.id);
    } else {
      console.log("Item not found!");
    }
  };

  const handleOpenModalDetail = () => {
    setIsModalDetailPromotion(true);
  };

  const handleOpenModalDelete = () => {
    setIsModalDeletePromotion(true);
  };

  const handleOpenModalEdit = () => {
    setIsModalEditPromotion(true);
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
                  Chưa có khuyến mãi nào!
                </Typography>
              </Box>
            )}
          </Box>
        </Scrollbar>
      </Card>

      <DetailPromotion
        isModalDetailPromotion={isModalDetailPromotion}
        setIsModalDetailPromotion={setIsModalDetailPromotion}
        roomTypeId={parseInt(roomTypeId)}
        currentId={parseInt(currentId)}
      />

      <DeletePromotion
        isModalDeletePromotion={isModalDeletePromotion}
        setIsModalDeletePromotion={setIsModalDeletePromotion}
        roomTypeId={parseInt(roomTypeId)}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />

      <EditPromotion
        isModalEditPromotion={isModalEditPromotion}
        setIsModalEditPromotion={setIsModalEditPromotion}
        roomTypeData={roomTypeData}
        roomTypeId={parseInt(roomTypeId)}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />
    </>
  );
};

PromotionTable.propTypes = {
  roomTypeId: PropTypes.number.isRequired,
  items: PropTypes.array,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
};
