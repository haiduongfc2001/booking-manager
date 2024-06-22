import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
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
  Avatar,
  Grid,
  CardMedia,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API, ROOM_STATUS, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import * as RoomService from "../../../services/room-service";
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import { SeverityPill } from "src/components/severity-pill";
import { StatusMapRoom } from "src/components/status-map";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const UpdateRoom = (props) => {
  const { isModalUpdateRoom, setIsModalUpdateRoom, hotelId, roomTypeId, currentId, onRefresh } =
    props;

  const [roomData, setRoomData] = useState([]);

  const dispatch = useDispatch();

  const getRoom = async () => {
    try {
      dispatch(openLoadingApi());

      const response = await RoomService[API.ROOM.GET_ROOM_BY_ID]({
        room_type_id: String(roomTypeId).trim(),
        room_id: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        setRoomData(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  useEffect(() => {
    if (isModalUpdateRoom && roomTypeId && currentId) {
      getRoom();
    }
  }, [isModalUpdateRoom, roomTypeId, currentId]);

  const handleCloseModalUpdate = () => {
    setIsModalUpdateRoom(false);
    formik.resetForm();
  };

  const initialValues = useMemo(
    () => ({
      number: roomData?.number || "",
      description: roomData?.description || "",
      submit: null,
    }),
    [roomData?.number, roomData?.description]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      number: Yup.string()
        .max(255, "Tên phòng không được vượt quá 255 ký tự")
        .required("Vui lòng nhập tên phòng!"),
      description: Yup.string()
        .min(10, "Mô tả phòng phải có ít nhất 10 ký tự!")
        .required("Vui lòng nhập mô tả về phòng!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        // const formData = new FormData();
        // formData.append("number", values.number.trim());
        // formData.append("description", values.description.trim());
        // formData.append("status", ROOM_STATUS.AVAILABLE);

        const response = await RoomService[API.ROOM.UPDATE_ROOM]({
          room_type_id: String(roomTypeId).trim(),
          room_id: String(currentId).trim(),
          // formData,
          number: values.number.trim(),
          description: values.description.trim(),
        });

        if (response?.status === STATUS_CODE.OK) {
          handleCloseModalUpdate();
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
          onRefresh();
        } else {
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  return (
    <Dialog
      open={isModalUpdateRoom}
      onClose={handleCloseModalUpdate}
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
        Chỉnh sửa thông tin phòng
        <IconButton
          aria-label="close"
          onClick={handleCloseModalUpdate}
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
          <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <TextField
                autoFocus
                fullWidth
                required
                label="Số phòng"
                name="number"
                type="text"
                onBlur={formik.handleBlur}
                value={formik.values.number}
                onChange={formik.handleChange}
                error={!!(formik.touched.number && formik.errors.number)}
                helperText={formik.touched.number && formik.errors.number}
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

            <Stack direction={{ xs: "column", sm: "row", width: "100%" }} spacing={3}>
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
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
        </form>
      </DialogContent>

      <DialogActions sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mr: 2 }}
          onClick={formik.handleSubmit}
        >
          OK
        </Button>
        <Button variant="contained" color="inherit" onClick={handleCloseModalUpdate}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateRoom;

UpdateRoom.propTypes = {
  isModalUpdateRoom: PropTypes.bool.isRequired,
  setIsModalUpdateRoom: PropTypes.func.isRequired,
  hotelId: PropTypes.number.isRequired,
  currentId: PropTypes.number.isRequired,
};
