import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
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
  Autocomplete,
  Box,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as HotelService from "src/services/hotel-service";
import * as AddressService from "src/services/address-service";
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const initialData = {
  name: "",
  street: "",
  ward: "",
  wardName: "",
  district: "",
  districtName: "",
  province: "",
  provinceName: "",
  description: "",
  contact: "",
};

const CreateHotel = (props) => {
  const { isModalCreateHotel, setIsModalCreateHotel, onRefresh } = props;

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const dispatch = useDispatch();

  const handleCloseModalCreate = () => {
    setIsModalCreateHotel(false);
    formik.resetForm();
  };

  const fetchProvinces = async () => {
    const response = await AddressService[API.ADDRESS.GET_ALL_PROVINCES]();
    const data = await response.data;
    setProvinces(data);
  };

  const fetchDistricts = async (provinceId) => {
    const response = await AddressService[API.ADDRESS.GET_ALL_DISTRICTS_BY_PROVINCE_ID]({
      province_id: provinceId,
    });
    const data = await response.data;
    setDistricts(data);
  };

  const fetchWards = async (districtId) => {
    const response = await AddressService[API.ADDRESS.GET_ALL_WARDS_BY_DISTRICT_ID]({
      district_id: districtId,
    });
    const data = await response.data;
    setWards(data);
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const formik = useFormik({
    initialValues: {
      ...initialData,
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Vui lòng nhập tên khách sạn!"),
      province: Yup.string().required("Vui lòng nhập tỉnh/thành phố!"),
      district: Yup.string().required("Vui lòng nhập quận/huyện khách sạn!"),
      ward: Yup.string().required("Vui lòng nhập phường/xã khách sạn!"),
      street: Yup.string().required("Vui lòng nhập số nhà/tên đường khách sạn!"),
      description: Yup.string()
        .min(10, "Mô tả quá ngắn!")
        .required("Vui lòng nhập mô tả về khách sạn!"),
      contact: Yup.string()
        .matches(/^\d{10}$/, "Số điện thoại phải bao gồm 10 số!")
        .required("Vui lòng nhập số điện thoại liên hệ của khách sạn!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        dispatch(openLoadingApi());
        const response = await HotelService[API.HOTEL.CREATE_HOTEL]({
          name: values.name.trim(),
          street: values.street.trim(),
          ward: values.wardName.trim(),
          district: values.districtName.trim(),
          province: values.provinceName.trim(),
          description: values.description.trim(),
          contact: values.contact.trim(),
        });

        if (response?.status === STATUS_CODE.CREATED) {
          handleCloseModalCreate();
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

  useEffect(() => {
    if (formik.values.province) {
      fetchDistricts(formik.values.province);
      formik.setFieldValue("district", "");
      formik.setFieldValue("ward", "");
    }
  }, [formik.values.province]);

  useEffect(() => {
    if (formik.values.district) {
      fetchWards(formik.values.district);
      formik.setFieldValue("ward", "");
    }
  }, [formik.values.district]);

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalCreateHotel) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalCreateHotel]);

  return (
    <Dialog
      open={isModalCreateHotel}
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
      <DialogTitle id="scroll-dialog-title">Tạo khách sạn mới</DialogTitle>
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
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <TextField
                  autoFocus
                  fullWidth
                  required
                  label="Tên khách sạn"
                  name="name"
                  type="text"
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={!!(formik.touched.name && formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />

                <TextField
                  fullWidth
                  required
                  label="Liên hệ"
                  name="contact"
                  type="text"
                  onBlur={formik.handleBlur}
                  value={formik.values.contact}
                  onChange={formik.handleChange}
                  error={!!(formik.touched.contact && formik.errors.contact)}
                  helperText={formik.touched.contact && formik.errors.contact}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <Autocomplete
                  id="province"
                  autoHighlight
                  fullWidth
                  options={provinces}
                  getOptionLabel={(option) => option.name}
                  value={provinces.find((opt) => opt.id === formik.values.province) || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("province", newValue?.id || "");
                    formik.setFieldValue("provinceName", newValue?.name || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tỉnh/Thành phố"
                      error={!!(formik.touched.province && formik.errors.province)}
                      helperText={formik.touched.province && formik.errors.province}
                    />
                  )}
                />
                <Autocomplete
                  id="district"
                  autoHighlight
                  fullWidth
                  options={districts}
                  getOptionLabel={(option) => option.name}
                  value={districts.find((opt) => opt.id === formik.values.district) || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("district", newValue?.id || "");
                    formik.setFieldValue("districtName", newValue?.name || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Quận/Huyện"
                      error={!!(formik.touched.district && formik.errors.district)}
                      helperText={formik.touched.district && formik.errors.district}
                    />
                  )}
                />
                <Autocomplete
                  id="ward"
                  autoHighlight
                  fullWidth
                  options={wards}
                  getOptionLabel={(option) => option.name}
                  value={wards.find((opt) => opt.id === formik.values.ward) || null}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("ward", newValue?.id || "");
                    formik.setFieldValue("wardName", newValue?.name || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Phường/Xã"
                      error={!!(formik.touched.ward && formik.errors.ward)}
                      helperText={formik.touched.ward && formik.errors.ward}
                    />
                  )}
                />
              </Stack>

              <TextField
                fullWidth
                required
                label="Tên đường"
                name="street"
                type="text"
                onBlur={formik.handleBlur}
                value={formik.values.street}
                onChange={formik.handleChange}
                error={!!(formik.touched.street && formik.errors.street)}
                helperText={formik.touched.street && formik.errors.street}
              />

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
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  error={!!(formik.touched.description && formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
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

export default CreateHotel;

CreateHotel.propTypes = {
  isModalCreateHotel: PropTypes.bool.isRequired,
  setIsModalCreateHotel: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
};
