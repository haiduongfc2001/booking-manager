import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { API, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import * as RoomTypeService from "src/services/room-service";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

const DeleteRoomType = ({
  confirmDeleteRoomType,
  setConfirmDeleteRoomType,
  hotelId,
  currentId,
  onRefresh = () => {},
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCloseDialog = () => {
    setConfirmDeleteRoomType(false);
  };

  const handleDelete = async () => {
    try {
      const response = await RoomTypeService[API.ROOM_TYPE.DELETE_ROOM_TYPE]({
        hotel_id: hotelId,
        room_type_id: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        onRefresh();
        router.push("/manager/room-type");
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Dialog
      open={confirmDeleteRoomType}
      onClose={handleCloseDialog}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Xóa loại phòng</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">
          Bạn có chắc bạn muốn xóa loại phòng này?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDelete} variant="contained" color="error">
          Xóa
        </Button>
        <Button onClick={handleCloseDialog} variant="contained" color="inherit">
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRoomType;

DeleteRoomType.propTypes = {
  confirmDeleteRoomType: PropTypes.bool.isRequired,
  setConfirmDeleteRoomType: PropTypes.func.isRequired,
  hotelId: PropTypes.number.isRequired,
  currentId: PropTypes.number.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
