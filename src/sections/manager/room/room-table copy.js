import PropTypes from "prop-types";
import { Box, Card, Typography } from "@mui/material";
import { useState } from "react";
import { Scrollbar } from "src/components/scroll-bar";
import { columns } from "./columns";
import CustomDataGrid from "src/components/data-grid/custom-data-grid";
import { ErrorOutline } from "@mui/icons-material";
import DetailRoom from "./detail-room";
import DeleteRoom from "./delete-room";
import UpdateRoom from "./update-room";

// The table displays the list of rooms
export const RoomTable = (props) => {
  const { roomTypeId, hotelId, items = [], onRefresh = () => {} } = props;

  const [currentId, setCurrentId] = useState("");
  const [isModalDetailRoom, setIsModalDetailRoom] = useState(false);
  const [isModalDeleteRoom, setIsModalDeleteRoom] = useState(false);
  const [isModalUpdateRoom, setIsModalUpdateRoom] = useState(false);

  const handleRowClick = (params) => {
    const clickedItem = items?.find((item) => item.id === params.id);
    if (clickedItem) {
      setCurrentId(clickedItem?.id);
    } else {
      console.log("Item not found!");
    }
  };

  const handleOpenModalDetail = () => {
    setIsModalDetailRoom(true);
  };

  const handleOpenModalDelete = () => {
    setIsModalDeleteRoom(true);
  };

  const handleOpenModalUpdate = () => {
    setIsModalUpdateRoom(true);
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

      <DetailRoom
        isModalDetailRoom={isModalDetailRoom}
        setIsModalDetailRoom={setIsModalDetailRoom}
        hotelId={parseInt(hotelId)}
        roomTypeId={parseInt(roomTypeId)}
        currentId={parseInt(currentId)}
      />

      <DeleteRoom
        isModalDeleteRoom={isModalDeleteRoom}
        setIsModalDeleteRoom={setIsModalDeleteRoom}
        hotelId={parseInt(hotelId)}
        roomTypeId={parseInt(roomTypeId)}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />

      <UpdateRoom
        isModalUpdateRoom={isModalUpdateRoom}
        setIsModalUpdateRoom={setIsModalUpdateRoom}
        hotelId={parseInt(hotelId)}
        roomTypeId={parseInt(roomTypeId)}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />
    </>
  );
};

RoomTable.propTypes = {
  // roomTypeId: PropTypes.number.isRequired,
  hotelId: PropTypes.number.isRequired,
  items: PropTypes.array,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
};
