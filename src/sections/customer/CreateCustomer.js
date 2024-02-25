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
import { API, STATUS_CODE } from "src/constant/Constants";

const initialData = {
  email: "",
  username: "",
  full_name: "",
  gender: "",
  phone: "",
  avatar_url: "",
  address: "",
  is_verified: false,
};

const CreateCustomer = (props) => {
  const { isModalCreateCustomer, setIsModalCreateCustomer, fetchData } = props;

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
      avatar_url: Yup.string(),
      address: Yup.string(),
      is_verified: Yup.boolean(),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const response = await CustomerService[API.CUSTOMER.CREATE_CUSTOMER]({
          email: values.email,
          username: values.username,
          full_name: values.full_name,
          gender: values.gender,
          phone: values.phone,
          avatar_url: values.avatar_url,
          address: values.address,
        });

        if (response && response.status === STATUS_CODE.CREATED) {
          fetchData();
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
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "80vh",
          height: "auto",
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
            <TextField
              autoFocus
              error={!!(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              required
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <TextField
                error={!!(formik.touched.username && formik.errors.username)}
                fullWidth
                helperText={formik.touched.username && formik.errors.username}
                label="Tên người dùng"
                name="username"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.username}
                required
              />

              <TextField
                error={!!(formik.touched.full_name && formik.errors.full_name)}
                fullWidth
                helperText={formik.touched.full_name && formik.errors.full_name}
                label="Họ và tên"
                name="full_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.full_name}
                required
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <FormControl error={!!(formik.touched.gender && formik.errors.gender)} fullWidth>
                <InputLabel id="customer-gender">Giới tính</InputLabel>
                <Select
                  labelId="customer-gender"
                  name="gender"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.gender}
                  required
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
                error={!!(formik.touched.phone && formik.errors.phone)}
                fullWidth
                helperText={formik.touched.phone && formik.errors.phone}
                label="Số điện thoại"
                name="phone"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="phone"
                value={formik.values.phone}
                required
              />
            </Stack>

            <TextField
              error={!!(formik.touched.avatar_url && formik.errors.avatar_url)}
              fullWidth
              helperText={formik.touched.avatar_url && formik.errors.avatar_url}
              label="Ảnh đại diện"
              name="avatar_url"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.avatar_url}
            />
            <TextField
              error={!!(formik.touched.address && formik.errors.address)}
              fullWidth
              helperText={formik.touched.address && formik.errors.address}
              label="Địa chỉ"
              name="address"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.address}
            />
            {/* <FormControlLabel
              control={
                <Switch
                  checked={formik.values.is_verified}
                  onChange={formik.handleChange}
                  name="is_verified"
                  color="primary"
                />
              }
              label={formik.values.is_verified ? "Đã xác thực" : "Chưa xác thực"}
            /> */}
          </Stack>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" sx={{ mr: 2 }} variant="contained" color="success">
            OK
          </Button>
          <Button onClick={handleCloseModalCreate} variant="contained" color="inherit">
            Hủy
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCustomer;

CreateCustomer.propTypes = {
  isModalCreateCustomer: PropTypes.bool.isRequired,
  setIsModalCreateCustomer: PropTypes.func.isRequired,
  fetchData: PropTypes.func,
};
