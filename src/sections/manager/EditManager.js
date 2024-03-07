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
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { managerData } from "src/components/Data";
import { SeverityPill } from "src/components/SeverityPill";
import { ModalStyle } from "src/components/ModalStyle";

const EditManager = (props) => {
  const { isModalEditManager, setIsModalEditManager, currentId } = props;

  const manager = managerData.find((manager) => manager.id === currentId);

  const handleCloseModalEdit = () => {
    setIsModalEditManager(false);
    formik.resetForm();
  };

  const initialValues = useMemo(
    () => ({
      email: manager?.email || "",
      full_name: manager?.full_name || "",
      gender: manager?.gender || "",
      phone: manager?.phone || "",
      hotel_id: manager?.hotel_id || "",
      avatar: manager?.avatar || "",
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
      full_name: Yup.string().max(20).required("Vui lòng nhập tên!"),
      gender: Yup.mixed()
        .oneOf(["Male", "Female"])
        .required("Vui lòng nhập địa chỉ tên người dùng!"),
      hotel_id: Yup.string().required("Vui lòng nhập tên khách sạn mà người này quản lý!"),
      phone: Yup.string().max(12).required("Vui lòng nhập số điện thoại!"),
      avatar: Yup.string(),
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
        handleCloseModalEdit();
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  return (
    <Modal
      open={isModalEditManager}
      onClose={handleCloseModalEdit}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={ModalStyle({ width: 50, maxWidth: 55, maxHeight: 85 })}>
        <Typography id="modal-title" variant="h5" component="div">
          Chỉnh sửa tài khoản
        </Typography>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <TextField
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
                <InputLabel id="manager-gender">Giới tính</InputLabel>
                <Select
                  labelId="manager-gender"
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
              error={!!(formik.touched.hotel_id && formik.errors.hotel_id)}
              fullWidth
              helperText={formik.touched.hotel_id && formik.errors.hotel_id}
              label="Địa chỉ"
              name="hotel_id"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.hotel_id}
              required
            />

            <TextField
              error={!!(formik.touched.avatar && formik.errors.avatar)}
              fullWidth
              helperText={formik.touched.avatar && formik.errors.avatar}
              label="Ảnh đại diện"
              name="avatar"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.avatar}
            />

            <SeverityPill color="primary">Quản lý khách sạn</SeverityPill>
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
            <Button onClick={handleCloseModalEdit} variant="contained" color="inherit">
              Hủy
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditManager;

EditManager.propTypes = {
  isModalEditManager: PropTypes.bool.isRequired,
  setIsModalEditManager: PropTypes.func.isRequired,
  currentId: PropTypes.number.isRequired,
};
