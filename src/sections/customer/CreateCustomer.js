import PropTypes from "prop-types";
import React from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalStyle } from "src/components/ModalStyle";

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
  const { isModalCreateCustomer, setIsModalCreateCustomer } = props;

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
      full_name: Yup.string().max(20).required("Vui lòng nhập tên!"),
      gender: Yup.mixed()
        .oneOf(["Male", "Female"])
        .required("Vui lòng nhập địa chỉ tên người dùng!"),
      phone: Yup.string().max(12).required("Vui lòng nhập số điện thoại!"),
      avatar_url: Yup.string(),
      address: Yup.string(),
      is_verified: Yup.boolean(),
    }),

    onSubmit: async (values, helpers) => {
      try {
        // await auth.signIn(values.email, values.phone);
        console.log(values);
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

  return (
    <Modal
      open={isModalCreateCustomer}
      onClose={handleCloseModalCreate}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={ModalStyle({ width: 50, maxWidth: 55, maxHeight: 85 })}>
        <Typography id="modal-title" variant="h5" component="div">
          Tạo tài khoản khách hàng
        </Typography>
        <form noValidate onSubmit={formik.handleSubmit}>
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
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
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
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.is_verified}
                  onChange={formik.handleChange}
                  name="is_verified"
                  color="primary"
                />
              }
              label={formik.values.is_verified ? "Đã xác thực" : "Chưa xác thực"}
            />
          </Stack>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" sx={{ mr: 2 }} variant="contained" color="success">
              OK
            </Button>
            <Button onClick={handleCloseModalCreate} variant="contained" color="inherit">
              Hủy
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateCustomer;

CreateCustomer.propTypes = {
  isModalCreateCustomer: PropTypes.bool.isRequired,
  setIsModalCreateCustomer: PropTypes.func.isRequired,
};
