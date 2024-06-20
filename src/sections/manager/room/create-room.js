import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as RoomService from "../../../services/room-service";
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";

const initialData = {
  number: "",
  description: "",
};

const CreateRoom = (props) => {
  const { isModalCreateRoom, setIsModalCreateRoom, roomTypeId, onRefresh } = props;

  const dispatch = useDispatch();

  const handleCloseModalCreate = () => {
    setIsModalCreateRoom(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      ...initialData,
      submit: null,
    },
    validationSchema: Yup.object({
      number: Yup.string()
        .max(255, "Tên phòng không được vượt quá 255 ký tự")
        .required("Vui lòng nhập tên phòng!"),
      description: Yup.string()
        .min(1, "Mô tả phòng phải có ít nhất 1 ký tự!")
        .required("Vui lòng nhập mô tả về phòng!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const response = await RoomService[API.ROOM.CREATE_ROOM]({
          room_type_id: String(roomTypeId).trim(),
          number: values.number.trim(),
          description: values.description.trim(),
        });

        if (response?.status === STATUS_CODE.CREATED) {
          handleCloseModalCreate();
          onRefresh();
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        } else {
          helpers.setErrors({ submit: response.data.message });
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.response.data.message });
        helpers.setSubmitting(false);
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  const numberElementRef = useRef(null);
  useEffect(() => {
    if (isModalCreateRoom) {
      const { current: numberElement } = numberElementRef;
      if (numberElement !== null) {
        numberElement.focus();
      }
    }
  }, [isModalCreateRoom]);

  return (
    <Dialog
      open={isModalCreateRoom}
      onClose={handleCloseModalCreate}
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
      <DialogTitle
        id="scroll-dialog-title"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backgroundColor: "white",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        Tạo phòng mới
        <IconButton
          aria-label="close"
          onClick={handleCloseModalCreate}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <TextField
                  autoFocus
                  fullWidth
                  required
                  label="Số phòng"
                  name="number"
                  type="text"
                  ref={numberElementRef}
                  onBlur={formik.handleBlur}
                  value={formik.values.number}
                  onChange={formik.handleChange}
                  error={!!(formik.touched.number && formik.errors.number)}
                  helperText={formik.touched.number && formik.errors.number}
                />
              </Stack>

              <Stack direction="row" spacing={3}>
                <TextField
                  fullWidth
                  required
                  multiline
                  label="Mô tả"
                  name="description"
                  type="text"
                  minRows={3}
                  maxRows={5}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={!!(formik.touched.description && formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Stack>
            </Stack>
          </Stack>

          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
        </form>
      </DialogContent>

      <DialogActions
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 1100,
          my: 3,
          mr: 3,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mr: 2 }}
          onClick={formik.handleSubmit}
        >
          Tạo phòng mới
        </Button>
        <Button variant="contained" color="inherit" onClick={handleCloseModalCreate}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoom;

CreateRoom.propTypes = {
  isModalCreateRoom: PropTypes.bool.isRequired,
  setIsModalCreateRoom: PropTypes.func.isRequired,
  // roomTypeId: PropTypes.number.isRequired,
  onRefresh: PropTypes.func,
};
