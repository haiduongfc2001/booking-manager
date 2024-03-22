import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { API, STATUS_CODE } from "src/constant/constants";
import LoadingData from "src/layouts/loading/loading-data";
import * as RoomService from "../../../services/room-service";
import { getInitials } from "src/utils/get-initials";
import { neutral } from "src/theme/colors";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { capitalizeFirstLetter } from "src/utils/capitalize-letter";
import FormatNumber from "src/utils/format-number";
import { SeverityPill } from "src/components/severity-pill";
import { StatusMapRoom } from "src/components/status-map";

const DetailRoom = (props) => {
  const { isModalDetailRoom, setIsModalDetailRoom, hotelId, currentId } = props;

  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRoom = async () => {
    try {
      setLoading(true);

      const response = await RoomService[API.ROOM.GET_ROOM_BY_ID]({
        hotel_id: String(hotelId).trim(),
        room_id: String(currentId).trim(),
      });

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setRoomData(response.data);
      } else {
        // dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      // dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalDetailRoom && currentId) {
      getRoom();
    }
  }, [isModalDetailRoom, currentId]);

  const handleCloseModal = () => {
    setIsModalDetailRoom(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalDetailRoom) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalDetailRoom]);

  return (
    <Dialog
      open={isModalDetailRoom}
      onClose={handleCloseModal}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          height: "auto",
          minWidth: "80%",
        },
      }}
    >
      <DialogTitle id="scroll-dialog-title">Thông tin chi tiết</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseModal}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {loading ? (
          <LoadingData />
        ) : (
          <>
            <Stack spacing={3} sx={{ mt: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems={{ xs: "center", sm: "flex-start" }}
              >
                <Avatar
                  src={
                    roomData?.images?.find((image) => image.is_primary)?.url ||
                    (roomData?.images?.length > 0
                      ? roomData?.images[0]?.url
                      : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png")
                  }
                  sx={{
                    bgcolor: neutral[300],
                    width: "calc(100% / 3)",
                    height: "100%",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                  variant="rounded"
                >
                  {getInitials(roomData?.name)}
                </Avatar>

                <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      autoFocus
                      label="Số phòng"
                      name="number"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={roomData?.number}
                    />

                    <TextField
                      fullWidth
                      label="Loại phòng"
                      name="type"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={capitalizeFirstLetter(roomData?.type)}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      label="Giá"
                      name="price"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ flex: 1 }}
                      value={FormatNumber(roomData?.price)}
                    />
                    <TextField
                      fullWidth
                      label="Giá giảm"
                      name="discount"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ flex: 1 }}
                      value={FormatNumber(roomData?.discount)}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      label="Sức chứa"
                      name="capacity"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ flex: 1 }}
                      value={roomData?.capacity}
                    />

                    <Stack direction="row" spacing={3}>
                      <SeverityPill color={StatusMapRoom[roomData?.status]}>
                        {roomData?.role === "available" ? "Có sẵn" : "Không có sẵn"}
                      </SeverityPill>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      multiline
                      label="Mô tả"
                      name="description"
                      minRows={3}
                      maxRows={5}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ flex: 1 }}
                      value={roomData?.description}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        readOnly
                        label="Ngày tạo"
                        name="created_at"
                        value={dayjs(roomData?.created_at)}
                      />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        readOnly
                        label="Ngày cập nhật gần nhất"
                        name="updated_at"
                        value={dayjs(roomData?.updated_at)}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Stack>
              </Stack>

              {roomData.images && roomData.images.length > 0 && (
                <Box sx={{ width: "100%", height: "100%", overflowY: "scroll" }}>
                  <ImageList variant="masonry" cols={3} gap={8}>
                    {roomData.images.map((item) => (
                      <ImageListItem key={item.id}>
                        <img srcSet={item.url} src={item.url} alt={item.id} loading="lazy" />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              )}
            </Stack>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="inherit" onClick={handleCloseModal}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailRoom;

DetailRoom.propTypes = {
  isModalDetailRoom: PropTypes.bool.isRequired,
  setIsModalDetailRoom: PropTypes.func.isRequired,
  hotelId: PropTypes.number.isRequired,
  currentId: PropTypes.number.isRequired,
};
