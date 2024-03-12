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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as CustomerService from "../../services/CustomerService";
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/ToastMessage";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const initialData = {
  email: "",
  username: "",
  full_name: "",
  gender: "",
  phone: "",
  avatar: "",
  address: "",
  dob: "01/01/2001",
};

const CreateCustomer = (props) => {
  const { isModalCreateCustomer, setIsModalCreateCustomer, onRefresh } = props;

  const dispatch = useDispatch();

  const handleCloseModalCreate = () => {
    setIsModalCreateCustomer(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      ...initialData,
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Vui lòng nhập địa chỉ email hợp lệ!")
        .max(255)
        .required("Vui lòng nhập địa chỉ email!"),
      username: Yup.string().max(20).required("Vui lòng nhập tên người dùng!"),
      full_name: Yup.string().max(20).required("Vui lòng nhập họ và tên!"),
      gender: Yup.mixed()
        .oneOf(["male", "female", "other"])
        .required("Vui lòng nhập giới tính người dùng!"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Số điện thoại chỉ gồm 10 số!")
        .required("Vui lòng nhập số điện thoại!")
        .min(10, "Số điện thoại phải dài chính xác 10 ký tự!")
        .max(10, "Số điện thoại phải dài chính xác 10 ký tự!"),
      avatar: Yup.string(),
      address: Yup.string(),
      dob: Yup.string(),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const dobValue = values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : null;
        const response = await CustomerService[API.CUSTOMER.CREATE_CUSTOMER]({
          email: values.email.trim(),
          username: values.username.trim(),
          full_name: values.full_name.trim(),
          gender: values.gender.trim(),
          phone: values.phone.trim(),
          avatar: values.avatar.trim(),
          address: values.address.trim(),
          dob: dobValue,
        });

        if (response?.status === STATUS_CODE.CREATED) {
          onRefresh();
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        } else {
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.message));
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        handleCloseModalCreate();
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalCreateCustomer) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalCreateCustomer]);

  return (
    <Dialog
      open={isModalCreateCustomer}
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
      <DialogTitle id="scroll-dialog-title">Tạo tài khoản khách hàng</DialogTitle>
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

      <form noValidate onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
              <Stack direction="row" spacing={3}>
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
                  onChange={formik.handleChange}
                  value={formik.values.address}
                  error={!!(formik.touched.address && formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    required
                    label="Ngày sinh *"
                    name="dob"
                    onBlur={formik.handleBlur}
                    value={dayjs(formik.values.dob)}
                    onChange={(value) => {
                      formik.setFieldValue("dob", Date.parse(value));
                    }}
                    error={!!(formik.touched.dob && formik.errors.dob)}
                    helperText={formik.touched.dob && formik.errors.dob}
                    // slotProps={{ textField: { variant: "outlined" } }}
                  />
                </LocalizationProvider>
              </Stack>
            </Stack>
          </Stack>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
        </DialogContent>
      </form>

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
        <Button variant="contained" color="inherit" onClick={handleCloseModalCreate}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCustomer;

CreateCustomer.propTypes = {
  isModalCreateCustomer: PropTypes.bool.isRequired,
  setIsModalCreateCustomer: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
};
