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
import { hotelData } from "src/components/Data";
import { SeverityPill } from "src/components/SeverityPill";
import { ModalStyle } from "src/components/ModalStyle";

const EditHotel = (props) => {
  const { isModalEditHotel, setIsModalEditHotel, currentId } = props;

  const hotel = hotelData.find((hotel) => hotel.hotel_id === currentId);

  const handleCloseModalEdit = () => {
    setIsModalEditHotel(false);
    formik.resetForm();
  };

  const initialValues = useMemo(
    () => ({
      hotel_name: hotel?.hotel_name || "",
      image: hotel?.image || "",
      address: hotel?.address || "",
      description: hotel?.description || "",
      submit: null,
    }),
    [currentId]
  );

  const formik = useFormik({
    initialValues,
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
        handleCloseModalEdit();
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  return (
    <Modal
      open={isModalEditHotel}
      onClose={handleCloseModalEdit}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={ModalStyle({ width: 50, maxWidth: 55, maxHeight: 85 })}>
        <Typography id="modal-title" variant="h5" component="div">
          Chỉnh sửa thông tin khách sạn
        </Typography>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <TextField
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
              type="address"
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
            <Button onClick={handleCloseModalEdit} variant="contained" color="inherit">
              Hủy
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditHotel;

EditHotel.propTypes = {
  isModalEditHotel: PropTypes.bool.isRequired,
  setIsModalEditHotel: PropTypes.func.isRequired,
  currentId: PropTypes.number.isRequired,
};
