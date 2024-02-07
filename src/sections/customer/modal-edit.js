import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef } from "react";
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
  Grid,
  FormHelperText,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { customerData } from "src/components/data";
import CustomizedSwitches from "src/pages/test";

// const initialData = {
//   email: "",
//   username: "",
//   full_name: "",
//   gender: "",
//   phone: "",
//   avatar_url: "",
//   address: "",
//   is_verified: false,
// };

const EditCustomer = (props) => {
  const { isModalEditCustomer, setIsModalEditCustomer, currentId } = props;

  const handleCloseModalEdit = () => {
    setIsModalEditCustomer(false);
  };

  const initialValues = useMemo(
    () => ({
      email: customerData[parseInt(currentId) - 1]?.email || "",
      username: customerData[parseInt(currentId) - 1]?.username || "",
      full_name: customerData[parseInt(currentId) - 1]?.full_name || "",
      gender: customerData[parseInt(currentId) - 1]?.gender || "",
      phone: customerData[parseInt(currentId) - 1]?.phone || "",
      avatar_url: customerData[parseInt(currentId) - 1]?.avatar_url || "",
      address: customerData[parseInt(currentId) - 1]?.address || "",
      is_verified: customerData[parseInt(currentId) - 1]?.is_verified || false,
      submit: null,
    }),
    [currentId]
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
        handleCloseModalEdit();
        console.log(values);
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  const emailInputRef = useRef(null);

  useEffect(() => {
    if (isModalEditCustomer && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [isModalEditCustomer]);

  return (
    <Modal
      open={isModalEditCustomer}
      onClose={handleCloseModalEdit}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          maxWidth: "55%",
          maxHeight: "85%",
          overflowY: "auto",
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="modal-title" variant="h5" component="div">
          Chỉnh sửa tài khoản
        </Typography>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <TextField
              inputRef={emailInputRef}
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
            {/* <CustomizedSwitches
              onChange={formik.handleChange}
              isChecked={formik.values.is_verified}
            /> */}

            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.is_verified}
                  onChange={formik.handleChange}
                  name="is_verified"
                  color="primary"
                />
              }
              label={formik.values.is_verified ? "Verified" : "Not Verified"}
            />
          </Stack>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" sx={{ mr: 2 }} variant="contained" color="error">
              OK
            </Button>
            <Button onClick={handleCloseModalEdit} variant="contained" color="inherit">
              Hủy
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditCustomer;

EditCustomer.propTypes = {
  isModalEditCustomer: PropTypes.bool.isRequired,
  setIsModalEditCustomer: PropTypes.func.isRequired,
  currentId: PropTypes.string.isRequired,
};
