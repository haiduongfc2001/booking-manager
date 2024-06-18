import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  API,
  MANAGER_ID_FAKE,
  STATUS_CODE,
  TOAST_KIND,
  TOAST_MESSAGE,
} from "src/constant/constants";
import * as StaffService from "../../../services/staff-service";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import PropTypes from "prop-types";

const DeleteStaff = ({
  isModalDeleteStaff,
  setIsModalDeleteStaff,
  hotelId,
  currentId,
  onRefresh,
}) => {
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setIsModalDeleteStaff(false);
  };

  const handleDelete = async () => {
    try {
      if (currentId === MANAGER_ID_FAKE) return;
      const response = await StaffService[API.STAFF.DELETE_STAFF]({
        hotel_id: String(hotelId).trim(),
        staff_id: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        onRefresh();
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Dialog
      open={isModalDeleteStaff}
      onClose={handleCloseModal}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Xóa tài khoản</DialogTitle>
      {currentId === MANAGER_ID_FAKE ? (
        <>
          <DialogContent>
            <DialogContentText id="dialog-description">
              Bạn không thể xóa tài khoản của chính mình!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} variant="contained" color="inherit">
              Đóng
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogContent>
            <DialogContentText id="dialog-description">
              Bạn có chắc bạn muốn xóa tài khoản này?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDelete} variant="contained" color="error">
              Xóa
            </Button>
            <Button onClick={handleCloseModal} variant="contained" color="inherit">
              Hủy
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default DeleteStaff;

DeleteStaff.propTypes = {
  isModalDeleteStaff: PropTypes.bool.isRequired,
  setIsModalDeleteStaff: PropTypes.func.isRequired,
  hotelId: PropTypes.number.isRequired,
  currentId: PropTypes.number.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
