import React, { useEffect, useMemo, useState } from "react";
import {
  Typography,
  Stack,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import * as HotelService from "src/services/hotel-service";
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";

const Page = () => {
  const [hotelId, setHotelId] = useState(10);
  const [hotelData, setHotelData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const dispatch = useDispatch();

  const getHotel = async () => {
    try {
      const response = await HotelService[API.HOTEL.GET_HOTEL_BY_ID]({
        hotel_id: hotelId,
      });

      if (response?.status === STATUS_CODE.OK) {
        setHotelData(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, "Server error"));
    }
  };

  useEffect(() => {
    getHotel();
  }, []);

  const fetchProvinces = async () => {
    // Replace this with your actual API call
    const response = await fetch("/api/provinces");
    const data = await response.json();
    setProvinces(data);
  };

  const fetchDistricts = async (provinceId) => {
    // Replace this with your actual API call
    const response = await fetch(`/api/districts?provinceId=${provinceId}`);
    const data = await response.json();
    setDistricts(data);
  };

  const fetchWards = async (districtId) => {
    // Replace this with your actual API call
    const response = await fetch(`/api/wards?districtId=${districtId}`);
    const data = await response.json();
    setWards(data);
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleCancelEdit = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const initialValues = useMemo(
    () => ({
      name: hotelData?.name || "",
      contact: hotelData?.contact || "",
      description: hotelData?.description || "",
      province: hotelData?.province || "",
      district: hotelData?.district || "",
      ward: hotelData?.ward || "",
      street: hotelData?.street || "",
      submit: null,
    }),
    [hotelData]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Vui lòng nhập tên khách sạn!"),
      address: Yup.string().required("Vui lòng nhập địa chỉ khách sạn!"),
      description: Yup.string()
        .min(10, "Mô tả quá ngắn!")
        .required("Vui lòng nhập mô tả về khách sạn!"),
      contact: Yup.string()
        .matches(/^\d{10}$/, "Số điện thoại phải bao gồm 10 số!")
        .required("Vui lòng nhập số điện thoại liên hệ của khách sạn!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const response = await HotelService[API.HOTEL.EDIT_HOTEL]({
          hotel_id: hotelId,
          name: values.name.trim(),
          contact: values.contact.trim(),
          description: values.description.trim(),
          address: `${values.street.trim()}, ${values.ward.trim()}, ${values.district.trim()}, ${values.province.trim()}`,
        });

        if (response?.status === STATUS_CODE.OK) {
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
          getHotel();
        } else {
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        handleCancelEdit();
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  return (
    <Box>
      <form noValidate onSubmit={formik.handleSubmit}>
        <Stack direction="row" spacing={3}>
          <TextField
            fullWidth
            required
            label="Tên khách sạn"
            name="name"
            type="text"
            InputProps={{
              readOnly: !isEditing,
            }}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={!!(formik.touched.name && formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Stack>
        <Stack direction="row" spacing={3} mt={3}>
          <FormControl fullWidth required>
            <InputLabel>Tỉnh/Thành phố</InputLabel>
            <Select
              label="Tỉnh/Thành phố"
              name="province"
              value={formik.values.province}
              onChange={(e) => {
                formik.handleChange(e);
                fetchDistricts(e.target.value);
              }}
              disabled={!isEditing}
            >
              {provinces.map((province) => (
                <MenuItem key={province.id} value={province.name}>
                  {province.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={3} mt={3}>
          <FormControl fullWidth required>
            <InputLabel>Quận/Huyện</InputLabel>
            <Select
              label="Quận/Huyện"
              name="district"
              value={formik.values.district}
              onChange={(e) => {
                formik.handleChange(e);
                fetchWards(e.target.value);
              }}
              disabled={!isEditing || !formik.values.province}
            >
              {districts.map((district) => (
                <MenuItem key={district.id} value={district.name}>
                  {district.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={3} mt={3}>
          <FormControl fullWidth required>
            <InputLabel>Phường/Xã</InputLabel>
            <Select
              label="Phường/Xã"
              name="ward"
              value={formik.values.ward}
              onChange={formik.handleChange}
              disabled={!isEditing || !formik.values.district}
            >
              {wards.map((ward) => (
                <MenuItem key={ward.id} value={ward.name}>
                  {ward.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={3} mt={3}>
          <TextField
            fullWidth
            required
            label="Đường/Phố"
            name="street"
            type="text"
            InputProps={{
              readOnly: !isEditing,
            }}
            onBlur={formik.handleBlur}
            value={formik.values.street}
            onChange={formik.handleChange}
            error={!!(formik.touched.street && formik.errors.street)}
            helperText={formik.touched.street && formik.errors.street}
          />
        </Stack>

        {formik.errors.submit && (
          <Typography color="error" sx={{ mt: 3 }} variant="body2">
            {formik.errors.submit}
          </Typography>
        )}
      </form>
    </Box>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
