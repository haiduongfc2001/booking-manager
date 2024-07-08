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
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import * as HotelService from "src/services/hotel-service";
import * as AddressService from "src/services/address-service";
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";
import { neutral } from "src/theme/colors";
import { getInitials } from "src/utils/get-initials";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const UpdateHotel = (props) => {
  const { isModalUpdateHotel, setIsModalUpdateHotel, currentId, onRefresh } = props;

  const [hotelData, setHotelData] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isModalUpdateHotel && currentId) {
      getHotel();
      fetchProvinces(); // Fetch provinces on component mount
    }
  }, [isModalUpdateHotel, currentId]);

  const getHotel = async () => {
    try {
      dispatch(openLoadingApi());

      const response = await HotelService[API.HOTEL.GET_HOTEL_BY_ID]({
        hotel_id: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        setHotelData(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  const fetchProvinces = async () => {
    // Replace this with your actual API call
    const response = await AddressService[API.ADDRESS.GET_ALL_PROVINCES]();
    const data = await response.data;
    setProvinces(data);
  };

  const fetchDistricts = async (provinceId) => {
    // Replace this with your actual API call
    const response = await AddressService[API.ADDRESS.GET_ALL_DISTRICTS_BY_PROVINCE_ID]({
      province_id: provinceId,
    });
    const data = await response.data;
    setDistricts(data);
  };

  const fetchWards = async (districtId) => {
    // Replace this with your actual API call
    const response = await AddressService[API.ADDRESS.GET_ALL_WARDS_BY_DISTRICT_ID]({
      district_id: districtId,
    });
    const data = await response.data;
    setWards(data);
  };

  const handleCloseModalUpdate = () => {
    setIsModalUpdateHotel(false);
    formik.resetForm();
  };

  const initialValues = useMemo(
    () => ({
      name: hotelData?.name || "",
      contact: hotelData?.contact || "",
      description: hotelData?.description || "",
      street: hotelData?.street || "",
      ward: hotelData?.ward || "",
      district: hotelData?.district || "",
      province: hotelData?.province || "",
      submit: null,
    }),
    [hotelData]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Vui lòng nhập tên khách sạn!"),
      street: Yup.string().required("Vui lòng nhập số nhà/tên đường khách sạn!"),
      ward: Yup.string().required("Vui lòng nhập phường/xã khách sạn!"),
      district: Yup.string().required("Vui lòng nhập quận/huyện khách sạn!"),
      province: Yup.string().required("Vui lòng nhập tỉnh/thành phố khách sạn!"),
      description: Yup.string()
        .min(10, "Mô tả quá ngắn!")
        .required("Vui lòng nhập mô tả về khách sạn!"),
      contact: Yup.string()
        .matches(/^\d{10}$/, "Số điện thoại phải bao gồm 10 số!")
        .required("Vui lòng nhập số điện thoại liên hệ của khách sạn!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const response = await HotelService[API.HOTEL.UPDATE_HOTEL]({
          hotel_id: String(currentId).trim(),
          name: values.name.trim(),
          contact: values.contact.trim(),
          description: values.description.trim(),
          street: values.street.trim(),
          ward: values.ward.trim(),
          district: values.district.trim(),
          province: values.province.trim(),
        });

        if (response?.status === STATUS_CODE.OK) {
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
          onRefresh();
        } else {
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        handleCloseModalUpdate();
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalUpdateHotel) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalUpdateHotel]);

  return (
    <Dialog
      open={isModalUpdateHotel}
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
      <DialogTitle id="scroll-dialog-title">Chỉnh sửa khách sạn</DialogTitle>
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
              <Avatar
                src={
                  hotelData?.images?.find((image) => image.is_primary)?.url ||
                  (hotelData?.images?.length > 0
                    ? hotelData?.images[0]?.url
                    : "/assets/no_image_available.png")
                }
                sx={{
                  bgcolor: neutral[300],
                  width: 256,
                  height: 256,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                variant="rounded"
              >
                {getInitials(hotelData?.name)}
              </Avatar>
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
                </Stack>

                <Stack direction="row" spacing={3}>
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

                <Stack direction="row" spacing={3}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    rows={3}
                    label="Mô tả"
                    name="description"
                    type="text"
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.description && formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Stack>

                <Stack direction="row" spacing={3}>
                  <Autocomplete
                    id="province"
                    autoHighlight
                    fullWidth
                    options={provinces}
                    getOptionLabel={(option) => option.name}
                    value={
                      provinces.find((province) => province.name === formik.values.province) || null
                    }
                    onChange={(e, value) => {
                      formik.setFieldValue("province", value?.name || "");
                      fetchDistricts(value?.id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        label="Tỉnh/Thành phố"
                        name="province"
                        onBlur={formik.handleBlur}
                        error={!!(formik.touched.province && formik.errors.province)}
                        helperText={formik.touched.province && formik.errors.province}
                      />
                    )}
                  />
                </Stack>

                <Stack direction="row" spacing={3}>
                  <Autocomplete
                    id="district"
                    autoHighlight
                    fullWidth
                    options={districts}
                    getOptionLabel={(option) => option.name}
                    value={
                      districts.find((district) => district.name === formik.values.district) || null
                    }
                    onChange={(e, value) => {
                      formik.setFieldValue("district", value?.name || "");
                      fetchWards(value?.id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        label="Quận/Huyện"
                        name="district"
                        onBlur={formik.handleBlur}
                        error={!!(formik.touched.district && formik.errors.district)}
                        helperText={formik.touched.district && formik.errors.district}
                      />
                    )}
                  />
                </Stack>

                <Stack direction="row" spacing={3}>
                  <Autocomplete
                    id="ward"
                    autoHighlight
                    fullWidth
                    options={wards}
                    getOptionLabel={(option) => option.name}
                    value={wards.find((ward) => ward.name === formik.values.ward) || null}
                    onChange={(e, value) => formik.setFieldValue("ward", value?.name || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        required
                        label="Phường/Xã"
                        name="ward"
                        onBlur={formik.handleBlur}
                        error={!!(formik.touched.ward && formik.errors.ward)}
                        helperText={formik.touched.ward && formik.errors.ward}
                      />
                    )}
                  />
                </Stack>

                <Stack direction="row" spacing={3}>
                  <TextField
                    fullWidth
                    required
                    label="Địa chỉ"
                    name="street"
                    type="text"
                    onBlur={formik.handleBlur}
                    value={formik.values.street}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.street && formik.errors.street)}
                    helperText={formik.touched.street && formik.errors.street}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseModalUpdate} color="primary">
          Hủy
        </Button>
        <Button
          onClick={formik.submitForm}
          disabled={!formik.isValid || formik.isSubmitting}
          variant="contained"
          sx={{ bgcolor: neutral[800], color: neutral[50] }}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UpdateHotel.propTypes = {
  isModalUpdateHotel: PropTypes.bool.isRequired,
  setIsModalUpdateHotel: PropTypes.func.isRequired,
  currentId: PropTypes.number.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default UpdateHotel;
