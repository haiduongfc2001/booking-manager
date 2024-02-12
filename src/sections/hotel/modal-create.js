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
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SeverityPill } from "src/components/severity-pill";
import { ModalStyle } from "src/components/modal-style";

const initialData = {
  hotel_name: "",
  image: "",
  address: "",
  description: "",
};

const CreateHotel = (props) => {
  const { isModalCreateHotel, setIsModalCreateHotel } = props;

  const handleCloseModalCreate = () => {
    setIsModalCreateHotel(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      ...initialData,
      submit: null,
    },
    validationSchema: Yup.object({
      hotel_name: Yup.string().max(255).required("Vui lòng nhập tên khách sạn!"),
      image: Yup.string().max(255).required("Vui lòng nhập ảnh!"),
      address: Yup.string().max(255).required("Vui lòng nhập địa chỉ của khách sạn!"),
      description: Yup.string().required("Vui lòng nhập mô tả về khách sạn!"),
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
      open={isModalCreateHotel}
      onClose={handleCloseModalCreate}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={ModalStyle({ width: 50, maxWidth: 55, maxHeight: 85 })}>
        <Typography id="modal-title" variant="h5" component="div">
          Tạo tài khoản quản lý
        </Typography>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <TextField
              autoFocus
              error={!!(formik.touched.hotel_name && formik.errors.hotel_name)}
              fullWidth
              helperText={formik.touched.hotel_name && formik.errors.hotel_name}
              label="Tên khách sạn"
              name="hotel_name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.hotel_name}
              required
            />
            <TextField
              error={!!(formik.touched.image && formik.errors.image)}
              fullWidth
              helperText={formik.touched.image && formik.errors.image}
              label="Ảnh"
              name="image"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.image}
              required
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
              required
            />

            <TextField
              error={!!(formik.touched.description && formik.errors.description)}
              fullWidth
              helperText={formik.touched.description && formik.errors.description}
              label="Mô tả"
              name="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.description}
              required
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

export default CreateHotel;

CreateHotel.propTypes = {
  isModalCreateHotel: PropTypes.bool.isRequired,
  setIsModalCreateHotel: PropTypes.func.isRequired,
};
