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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Avatar,
  SeverityPill,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import * as CustomerService from "../../services/customer-service";
import LoadingData from "src/layouts/loading/loading-data";
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";
import { neutral } from "src/theme/colors";
import { getInitials } from "src/utils/get-initials";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const EditCustomer = (props) => {
  const { isModalEditCustomer, setIsModalEditCustomer, currentId, onRefresh } = props;

  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const getCustomer = async () => {
    try {
      setLoading(true);

      const response = await CustomerService[API.CUSTOMER.GET_CUSTOMER_BY_ID]({
        customerId: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        setCustomerData(response.data);
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
    if (isModalEditCustomer && currentId) {
      getCustomer();
    }
  }, [isModalEditCustomer, currentId]);

  const handleCloseModalEdit = () => {
    setIsModalEditCustomer(false);
    formik.resetForm();
  };

  const initialValues = useMemo(
    () => ({
      email: customerData?.email || "",
      username: customerData?.username || "",
      full_name: customerData?.full_name || "",
      gender: customerData?.gender || "",
      phone: customerData?.phone || "",
      address: customerData?.address || "",
      dob: customerData?.dob || "",
      submit: null,
    }),
    [
      customerData?.address,
      customerData?.dob,
      customerData?.email,
      customerData?.full_name,
      customerData?.gender,
      customerData?.phone,
      customerData?.username,
    ]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Vui lòng nhập địa chỉ email hợp lệ!")
        .max(255)
        .required("Vui lòng nhập địa chỉ email!"),
      username: Yup.string().max(20).required("Vui lòng nhập tên người dùng!"),
      full_name: Yup.string().max(20).required("Vui lòng nhập tên!"),
      gender: Yup.mixed()
        .oneOf(["male", "female", "other"])
        .required("Vui lòng nhập địa chỉ tên người dùng!"),
      phone: Yup.string().max(12).required("Vui lòng nhập số điện thoại!"),
      address: Yup.string(),
      dob: Yup.string(),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const dobValue = values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : null;
        const response = await CustomerService[API.CUSTOMER.EDIT_CUSTOMER]({
          customerId: String(currentId).trim(),
          email: values.email.trim(),
          username: values.username.trim(),
          full_name: values.full_name.trim(),
          gender: values.gender.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          dob: dobValue,
        });

        if (response?.status === STATUS_CODE.OK) {
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
          onRefresh();
        } else {
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.message));
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        handleCloseModalEdit();
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalEditCustomer) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalEditCustomer]);

  return (
    <Dialog
      open={isModalEditCustomer}
      onClose={handleCloseModalEdit}
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
      <DialogTitle id="scroll-dialog-title">Chỉnh sửa tài khoản</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseModalEdit}
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
          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={3} sx={{ mt: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems={{ xs: "center", sm: "flex-start" }}
              >
                <Avatar
                  src={
                    customerData?.avatar ||
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
                  }
                  sx={{
                    bgcolor: neutral[300],
                    width: "calc(100% / 3)",
                    height: "auto",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                  variant="rounded"
                >
                  {getInitials(customerData?.full_name)}
                </Avatar>

                <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      required
                      label="Email"
                      name="email"
                      type="email"
                      sx={{ flex: 1 }}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={!!(formik.touched.email && formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      required
                      label="Tên người dùng"
                      name="username"
                      type="text"
                      onBlur={formik.handleBlur}
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      error={!!(formik.touched.username && formik.errors.username)}
                      helperText={formik.touched.username && formik.errors.username}
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

                  <Stack direction="row" spacing={3}>
                    <FormControl
                      fullWidth
                      variant="filled"
                      sx={{ m: 1, minWidth: 120 }}
                      error={!!(formik.touched.gender && formik.errors.gender)}
                    >
                      <InputLabel id="gender-label">Giới tính *</InputLabel>
                      <Select
                        required
                        labelId="gender-label"
                        name="gender"
                        onBlur={formik.handleBlur}
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value="male">Nam</MenuItem>
                        <MenuItem value="female">Nữ</MenuItem>
                        <MenuItem value="other">Khác</MenuItem>
                      </Select>
                      {formik.touched.gender && formik.errors.gender && (
                        <FormHelperText>{formik.errors.gender}</FormHelperText>
                      )}
                    </FormControl>
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

                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      name="address"
                      type="text"
                      onBlur={formik.handleBlur}
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      error={!!(formik.touched.address && formik.errors.address)}
                      helperText={formik.touched.address && formik.errors.address}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        required
                        label="Ngày sinh"
                        name="dob"
                        onBlur={formik.handleBlur}
                        value={dayjs(formik.values.dob)}
                        onChange={formik.handleChange}
                        error={!!(formik.touched.dob && formik.errors.dob)}
                        helperText={formik.touched.dob && formik.errors.dob}
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
        )}
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
        <Button variant="contained" color="inherit" onClick={handleCloseModalEdit}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCustomer;

EditCustomer.propTypes = {
  isModalEditCustomer: PropTypes.bool.isRequired,
  setIsModalEditCustomer: PropTypes.func.isRequired,
  currentId: PropTypes.number.isRequired,
};
