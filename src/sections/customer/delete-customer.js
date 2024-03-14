import React from "react";
import { Button, Modal, Box, Typography } from "@mui/material";
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import * as CustomerService from "../../services/customer-service";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";

const DeleteCustomer = ({
  isModalDeleteCustomer,
  setIsModalDeleteCustomer,
  currentId,
  onRefresh,
}) => {
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setIsModalDeleteCustomer(false);
  };

  const handleDelete = async () => {
    try {
      const response = await CustomerService[API.CUSTOMER.DELETE_CUSTOMER]({
        customerId: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        onRefresh();
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
      }
    } catch (error) {
      // dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.FILTER_ERROR));
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Modal
      open={isModalDeleteCustomer}
      onClose={handleCloseModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "30%",
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 2.5,
        }}
      >
        <Typography id="modal-title" variant="h5" component="div">
          Xóa tài khoản
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          Bạn có chắc bạn muốn xóa tài khoản này?
        </Typography>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleDelete} sx={{ mr: 2 }} variant="contained" color="error">
            Xóa
          </Button>
          <Button onClick={handleCloseModal} variant="contained" color="inherit">
            Hủy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteCustomer;
