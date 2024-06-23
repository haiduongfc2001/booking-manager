import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  FormControl,
  FormHelperText,
  Avatar,
  Autocomplete,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API, GENDER, ROLE, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import * as StaffService from "src/services/staff-service";
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";
import { neutral } from "src/theme/colors";
import { getInitials } from "src/utils/get-initials";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { SeverityPill } from "src/components/severity-pill";
import { StatusMapRole } from "src/components/status-map";

const UpdateStaff = (props) => {
  const { isModalUpdateStaff, setIsModalUpdateStaff, hotelId, currentId, onRefresh } = props;

  const [staffData, setStaffData] = useState([]);

  const dispatch = useDispatch();

  const getStaff = async () => {
    try {
      dispatch(openLoadingApi());

      const response = await StaffService[API.HOTEL.STAFF.GET_STAFF_BY_ID]({
        hotel_id: String(hotelId).trim(),
        staff_id: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        setStaffData(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  useEffect(() => {
    if (isModalUpdateStaff && hotelId && currentId) {
      getStaff();
    }
  }, [isModalUpdateStaff, hotelId, currentId]);

  const handleCloseModalUpdate = () => {
    setIsModalUpdateStaff(false);
    formik.resetForm();
  };

  const initialValues = useMemo(
    () => ({
      email: staffData?.email || "",
      full_name: staffData?.full_name || "",
      gender: staffData?.gender || "",
      phone: staffData?.phone || "",
      hotel_id: staffData?.hotel_id || "",
      role: staffData?.role || "",
      submit: null,
    }),
    [staffData?.email, staffData?.full_name, staffData?.gender, staffData?.phone, staffData?.role]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Vui lòng nhập địa chỉ email hợp lệ!")
        .max(255)
        .required("Vui lòng nhập địa chỉ email!"),
      full_name: Yup.string().max(20).required("Vui lòng nhập họ và tên!"),
      gender: Yup.mixed()
        .oneOf([GENDER.MALE, GENDER.FEMALE, GENDER.OTHER])
        .required("Vui lòng chọn 1 giới tính!"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Số điện thoại chỉ gồm 10 số!")
        .required("Vui lòng nhập số điện thoại!")
        .min(10, "Số điện thoại phải dài chính xác 10 ký tự!")
        .max(10, "Số điện thoại phải dài chính xác 10 ký tự!"),
      hotel_id: Yup.string()
        .matches(/^\d+$/, "Hotel ID phải là chuỗi số!")
        .required("Vui lòng nhập chọn 1 khách sạn!"),
      role: Yup.mixed()
        .oneOf([ROLE.MANAGER, ROLE.RECEPTIONIST])
        .required("Vui lòng lựa chọn chức vụ của nhân viên!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        dispatch(openLoadingApi());
        const response = await StaffService[API.HOTEL.STAFF.UPDATE_STAFF]({
          staff_id: String(currentId).trim(),
          email: values.email.trim(),
          full_name: values.full_name.trim(),
          gender: values.gender.trim(),
          phone: values.phone.trim(),
          hotel_id: String(values.hotel_id).trim(),
          role: values.role.trim(),
        });

        if (response?.status === STATUS_CODE.OK) {
          handleCloseModalUpdate();
          onRefresh();
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        } else {
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        dispatch(closeLoadingApi());
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalUpdateStaff) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalUpdateStaff]);

  return (
    <Dialog
      open={isModalUpdateStaff}
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
      <DialogTitle id="scroll-dialog-title">
        Chỉnh sửa tài khoản của nhân viên {staffData?.full_name}
      </DialogTitle>
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

      <DialogContent dividers>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              alignItems={{ xs: "center", sm: "flex-start" }}
            >
              <Stack direction="column" spacing={3}>
                <Avatar
                  src={staffData?.avatar}
                  sx={{
                    bgcolor: neutral[300],
                    width: 256,
                    height: 256,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {getInitials(staffData?.full_name)}
                </Avatar>
                <SeverityPill color={StatusMapRole[staffData?.role]}>
                  {staffData?.role === ROLE.MANAGER ? "Quản lý" : "Lễ tân"}
                </SeverityPill>
              </Stack>

              <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                <Stack direction={{ md: "row", xs: "column" }} spacing={3}>
                  <TextField
                    autoFocus
                    fullWidth
                    required
                    label="Email"
                    name="email"
                    type="email"
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.email && formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                  <TextField
                    fullWidth
                    required
                    label="Họ và tên"
                    name="full_name"
                    type="text"
                    onBlur={formik.handleBlur}
                    value={formik.values.full_name}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.full_name && formik.errors.full_name)}
                    helperText={formik.touched.full_name && formik.errors.full_name}
                  />
                </Stack>

                <Stack direction={{ sm: "row", xs: "column" }} spacing={3}>
                  <TextField
                    fullWidth
                    required
                    label="Số điện thoại"
                    name="phone"
                    type="phone"
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.phone && formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </Stack>

                <Stack direction={{ md: "row", xs: "column" }} spacing={3}>
                  <FormControl
                    sx={{ width: "100%", m: 1, minWidth: 120 }}
                    error={!!(formik.touched.gender && formik.errors.gender)}
                  >
                    <FormLabel id="radio-gender">Giới tính</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="radio-gender"
                      defaultValue={staffData?.gender}
                      name="gender"
                      onBlur={formik.handleBlur}
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel value={GENDER.MALE} control={<Radio />} label="Nam" />
                      <FormControlLabel value={GENDER.FEMALE} control={<Radio />} label="Nữ" />
                      <FormControlLabel value={GENDER.OTHER} control={<Radio />} label="Khác" />
                    </RadioGroup>
                    {formik.touched.gender && formik.errors.gender && (
                      <FormHelperText>{formik.errors.gender}</FormHelperText>
                    )}
                  </FormControl>
                </Stack>

                <Stack direction="row" spacing={3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      readOnly
                      format="HH:mm:ss DD/MM/YYYY"
                      sx={{ width: { xs: "100%", md: "50%" } }}
                      label="Thời gian tạo"
                      name="created_at"
                      value={dayjs(staffData?.created_at)}
                    />
                  </LocalizationProvider>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      readOnly
                      format="HH:mm:ss DD/MM/YYYY"
                      sx={{ width: { xs: "100%", md: "50%" } }}
                      label="Cập nhật gần nhất"
                      name="updated_at"
                      value={dayjs(staffData?.updated_at)}
                    />
                  </LocalizationProvider>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          {formik.errors.submit && (
            <Typography color="error" variant="body2" sx={{ mt: 3 }}>
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

export default UpdateStaff;

UpdateStaff.propTypes = {
  isModalUpdateStaff: PropTypes.bool.isRequired,
  setIsModalUpdateStaff: PropTypes.func.isRequired,
  hotelId: PropTypes.number.isRequired,
  currentId: PropTypes.number.isRequired,
};
