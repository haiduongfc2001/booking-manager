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
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import * as HotelService from "../../services/HotelService";
import LoadingData from "src/layouts/loading/LoadingData";
import { showCommonAlert } from "src/utils/ToastMessage";
import { useDispatch } from "react-redux";
import { neutral } from "src/theme/Colors";
import { getInitials } from "src/utils/GetInitials";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

const EditHotel = (props) => {
  const { isModalEditHotel, setIsModalEditHotel, currentId, onRefresh } = props;

  const [hotelData, setHotelData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const getHotel = async () => {
    try {
      setLoading(true);

      const response = await HotelService[API.HOTEL.GET_HOTEL_BY_ID]({
        hotelId: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        setHotelData(response.data);
      } else {
        // dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      // dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.FILTER_ERROR));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalEditHotel && currentId) {
      getHotel();
    }
  }, [isModalEditHotel, currentId]);

  const handleCloseModalEdit = () => {
    setIsModalEditHotel(false);
    formik.resetForm();
  };

  const initialValues = useMemo(
    () => ({
      name: hotelData?.name || "",
      contact: hotelData?.contact || "",
      description: hotelData?.description || "",
      address: hotelData?.address || "",
      submit: null,
    }),
    [hotelData?.address, hotelData?.contact, hotelData?.description, hotelData?.name]
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
          hotelId: String(currentId).trim(),
          name: values.name.trim(),
          contact: values.contact.trim(),
          description: values.description.trim(),
          address: values.address.trim(),
        });

        if (response?.status === STATUS_CODE.OK) {
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
          onRefresh();
        } else {
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.message));
        }
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

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalEditHotel) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalEditHotel]);

  return (
    <Dialog
      open={isModalEditHotel}
      onClose={handleCloseModalEdit}
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
        onClick={handleCloseModalEdit}
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
        {loading ? (
          <LoadingData />
        ) : (
          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={3} sx={{ mt: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems={{ xs: "center", sm: "flex-start" }}
              >
                <Avatar
                  src={
                    hotelData?.images?.length > 0
                      ? hotelData?.images[0]?.url
                      : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
                  }
                  sx={{
                    bgcolor: neutral[300],
                    width: "calc(100% / 3)",
                    height: "100%",
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
                      label="Địa chỉ"
                      name="address"
                      type="text"
                      onBlur={formik.handleBlur}
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      error={!!(formik.touched.address && formik.errors.address)}
                      helperText={formik.touched.address && formik.errors.address}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      label="Mô tả"
                      name="description"
                      type="text"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.description}
                      error={!!(formik.touched.description && formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                    />
                  </Stack>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        readOnly
                        label="Ngày tạo"
                        name="created_at"
                        value={dayjs(hotelData?.created_at)}
                      />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        readOnly
                        label="Ngày cập nhật gần nhất"
                        name="updated_at"
                        value={dayjs(hotelData?.updated_at)}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Stack>
              </Stack>

              {hotelData.images && hotelData.images.length > 0 && (
                <Box sx={{ width: "100%", height: "100%", overflowY: "scroll" }}>
                  <ImageList variant="masonry" cols={3} gap={8}>
                    {hotelData.images.map((item) => (
                      <ImageListItem key={item.id}>
                        <img srcSet={item.url} src={item.url} alt={item.id} loading="lazy" />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              )}
            </Stack>
            {formik.errors.submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
                {formik.errors.submit}
              </Typography>
            )}
          </form>
        )}
      </DialogContent>

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
        <Button variant="contained" color="inherit" onClick={handleCloseModalEdit}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditHotel;

EditHotel.propTypes = {
  isModalEditHotel: PropTypes.bool.isRequired,
  setIsModalEditHotel: PropTypes.func.isRequired,
  currentId: PropTypes.number.isRequired,
};
