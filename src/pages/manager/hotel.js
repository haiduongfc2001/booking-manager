import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Typography,
  Stack,
  TextField,
  Avatar,
  Container,
  SvgIcon,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import * as HotelService from "src/services/hotel-service";
import LoadingData from "src/layouts/loading/loading-data";
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
import { ErrorOutline } from "@mui/icons-material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import EditHotel from "src/sections/manager/hotel/edit-hotel";

const Page = () => {
  const [hotelId, setHotelId] = useState(10);
  const [hotelData, setHotelData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const getHotel = async () => {
    if (getHotel.current) {
      return;
    }

    getHotel.current = true;

    try {
      setLoading(true);

      const response = await HotelService[API.HOTEL.GET_HOTEL_BY_ID]({
        hotel_id: hotelId,
      });

      if (response?.status === STATUS_CODE.OK) {
        setHotelData(response.data);
      } else {
        // dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      // dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHotel();
  }, []);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

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
          hotel_id: hotelId,
          name: values.name.trim(),
          contact: values.contact.trim(),
          description: values.description.trim(),
          address: values.address.trim(),
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
    <>
      <Head>
        <title>Hotel</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Khách sạn</Typography>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack>
              </Stack>
            </Stack>

            <Grid container justifyContent="flex-end">
              <Grid item xs={3} sx={{ display: "flex", justifyContent: "inherit", pr: 2 }}>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <ArrowPathIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  color="secondary"
                  onClick={getHotel}
                >
                  Làm mới
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>
      {loading ? (
        <LoadingData />
      ) : hotelData ? (
        <Box
          sx={{
            mx: 3,
            mb: 3,
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 4,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #ddd",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <Box>
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
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png")
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
                        inputRef={inputRef}
                        autoFocus={!isEditing}
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

                      <TextField
                        fullWidth
                        required
                        label="Liên hệ"
                        name="contact"
                        type="text"
                        InputProps={{
                          readOnly: !isEditing,
                        }}
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
                        InputProps={{
                          readOnly: !isEditing,
                        }}
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
                        multiline
                        label="Mô tả"
                        name="description"
                        type="text"
                        minRows={3}
                        maxRows={5}
                        InputProps={{
                          readOnly: !isEditing,
                        }}
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

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                      spacing={3}
                    >
                      {isEditing ? (
                        <Box sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            sx={{ mr: 2 }}
                            onClick={formik.handleSubmit}
                          >
                            Lưu thay đổi
                          </Button>
                          <Button variant="contained" color="inherit" onClick={handleCancelEdit}>
                            Hủy
                          </Button>
                        </Box>
                      ) : (
                        <Button variant="contained" sx={{ mr: 2 }} onClick={handleEdit}>
                          Chỉnh sửa
                        </Button>
                      )}
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
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            p: 2,
          }}
        >
          <ErrorOutline sx={{ mr: 1 }} />
          <Typography variant="body1" color="neutral.900">
            Không có dữ liệu!
          </Typography>
        </Box>
      )}

      <EditHotel onRefresh={getHotel} hotelData={hotelData} hotelId={hotelId} />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
