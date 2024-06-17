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
import { API, ROOM_STATUS, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
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
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";

const DetailRoom = (props) => {
  const { isModalDetailRoom, setIsModalDetailRoom, hotelId, roomTypeId, currentId } = props;
  const dispatch = useDispatch();

  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRoom = async () => {
    try {
      setLoading(true);

      const response = await RoomService[API.ROOM.GET_ROOM_BY_ID]({
        room_type_id: String(roomTypeId).trim(),
        room_id: String(currentId).trim(),
      });

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setRoomData(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
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
          <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <TextField
                fullWidth
                autoFocus
                label="Số phòng"
                name="number"
                InputProps={{
                  readOnly: true,
                }}
                value={roomData?.number || ""}
                sx={{ width: "50%" }}
              />
              <Box sx={{ width: "50%", height: "100%" }}>
                <SeverityPill color={StatusMapRoom[roomData?.status]}>
                  {roomData?.status === ROOM_STATUS.AVAILABLE ? "Đang có sẵn" : "Không có sẵn"}
                </SeverityPill>
              </Box>
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
                  sx={{ width: "50%" }}
                  value={dayjs(roomData?.created_at)}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  readOnly
                  label="Ngày cập nhật gần nhất"
                  name="updated_at"
                  sx={{ width: "50%" }}
                  value={dayjs(roomData?.updated_at)}
                />
              </LocalizationProvider>
            </Stack>
          </Stack>
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
