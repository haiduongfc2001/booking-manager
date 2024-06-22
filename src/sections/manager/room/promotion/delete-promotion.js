import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
} from "@mui/material";
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import * as RoomService from "src/services/room-service";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import PropTypes from "prop-types";

const DeletePromotion = ({
  isModalDeletePromotion,
  setIsModalDeletePromotion,
  roomTypeId,
  currentId,
  onRefresh,
}) => {
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setIsModalDeletePromotion(false);
  };

  const handleDelete = async () => {
    try {
      const response = await RoomService[API.ROOM_TYPE.PROMOTION.DELETE_PROMOTION]({
        room_type_id: String(roomTypeId).trim(),
        promotion_id: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        onRefresh();
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Dialog
      open={isModalDeletePromotion}
      onClose={handleCloseModal}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Xóa khuyến mãi</DialogTitle>
      <DialogContent>
        <Typography id="dialog-description">Bạn có chắc bạn muốn xóa khuyến mãi này?</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Xóa
        </Button>
        <Button variant="contained" color="inherit" onClick={handleCloseModal}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePromotion;

DeletePromotion.propTypes = {
  isModalDeletePromotion: PropTypes.bool.isRequired,
  setIsModalDeletePromotion: PropTypes.func.isRequired,
  roomTypeId: PropTypes.number.isRequired,
  currentId: PropTypes.number.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
