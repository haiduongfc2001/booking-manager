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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ImageListItemBar,
  IconButton,
  Card,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API, HOTEL_ID_FAKE, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
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
import { ErrorOutline } from "@mui/icons-material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Head from "next/head";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ImageIcon from "@mui/icons-material/Image";
import UpdateHotelImage from "src/sections/manager/hotel/update-hotel-image";
import HotelAmenities from "src/sections/manager/hotel/hotel-amenity";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const Page = () => {
  const [hotelId, setHotelId] = useState(HOTEL_ID_FAKE);
  const [hotelData, setHotelData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [openPopupAddImages, setOpenPopupAddImages] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const inputRef = useRef(null);

  const getHotel = async () => {
    if (getHotel.current) {
      return;
    }

    getHotel.current = true;

    try {
      dispatch(openLoadingApi());

      const response = await HotelService[API.HOTEL.GET_HOTEL_BY_ID]({
        hotel_id: hotelId,
      });

      if (response?.status === STATUS_CODE.OK) {
        setHotelData(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
      setIsUpdating(false);
      formik.resetForm();
    }
  };

  useEffect(() => {
    getHotel();
  }, []);

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

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (isUpdating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isUpdating]);

  const handleCancelUpdate = () => {
    formik.resetForm();
    setIsUpdating(false);
  };

  const handleUpdate = () => {
    setIsUpdating(true);
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
    [
      hotelData?.province,
      hotelData?.district,
      hotelData?.ward,
      hotelData?.street,
      hotelData?.contact,
      hotelData?.description,
      hotelData?.name,
    ]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().max(255).required("Vui lòng nhập tên khách sạn!"),
      province: Yup.string().min(1, "Quá ngắn!").required("Vui lòng nhập tỉnh/thành phố!"),
      district: Yup.string().min(1, "Quá ngắn!").required("Vui lòng nhập quận/huyện khách sạn!"),
      ward: Yup.string().min(1, "Quá ngắn!").required("Vui lòng nhập phường/xã khách sạn!"),
      street: Yup.string()
        .min(1, "Quá ngắn!")
        .required("Vui lòng nhập số nhà/tên đường khách sạn!"),
      description: Yup.string()
        .min(10, "Mô tả quá ngắn!")
        .required("Vui lòng nhập mô tả về khách sạn!"),
      contact: Yup.string()
        .matches(/^\d{10}$/, "Số điện thoại phải bao gồm 10 số!")
        .required("Vui lòng nhập số điện thoại liên hệ của khách sạn!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const selectedProvince = provinces.find((province) => province.id === values.province);
        const selectedDistrict = districts.find((district) => district.id === values.district);

        const response = await HotelService[API.HOTEL.UPDATE_HOTEL]({
          hotel_id: hotelId,
          name: values.name.trim(),
          contact: values.contact.trim(),
          description: values.description.trim(),
          province: selectedProvince.name,
          district: selectedDistrict.name,
          ward: values.ward.trim(),
          street: values.street.trim(),
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
        handleCancelUpdate();
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
                {/* <Stack alignItems="center" direction="row" spacing={1}>
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
                </Stack> */}
              </Stack>
            </Stack>

            <Grid container display="flex" alignItems="center" justifyContent="space-between">
              <Grid item xs={3} sx={{ display: "flex", justifyContent: "inherit", pr: 2 }}>
                <Button
                  endIcon={
                    <SvgIcon fontSize="small">
                      <ArrowForwardIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  color="primary"
                  onClick={() => router.push("/manager/room-type")}
                >
                  Xem danh sách các loại phòng
                </Button>
              </Grid>
              <Button
                sx={{ pr: 2 }}
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
              {/* <Grid item xs={3} sx={{ display: "flex", justifyContent: "inherit", pr: 2 }}>
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
              </Grid> */}
            </Grid>

            {hotelData ? (
              <Card key={hotelData?.id} sx={{ p: 2 }}>
                <Box>
                  <form noValidate onSubmit={formik.handleSubmit}>
                    <Stack spacing={3} sx={{ mt: 3 }}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={3}
                        alignItems={{ xs: "center", sm: "flex-start" }}
                      >
                        <Stack
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                          spacing={3}
                          sx={{ width: "calc(100% / 3)", height: "100%" }}
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
                              width: "100%",
                              height: "100%",
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                            }}
                            variant="rounded"
                          >
                            {getInitials(hotelData?.name)}
                          </Avatar>
                          {hotelData?.images?.length <= 0 && (
                            <Button
                              variant="contained"
                              color="success"
                              endIcon={<ImageIcon />}
                              onClick={() => setOpenPopupAddImages(true)}
                            >
                              Thêm ảnh
                            </Button>
                          )}
                        </Stack>
                        <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                            <TextField
                              inputRef={inputRef}
                              autoFocus={!isUpdating}
                              fullWidth
                              required={isUpdating}
                              label="Tên khách sạn"
                              name="name"
                              type="text"
                              InputProps={{
                                readOnly: !isUpdating,
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.name}
                              onChange={formik.handleChange}
                              error={!!(formik.touched.name && formik.errors.name)}
                              helperText={formik.touched.name && formik.errors.name}
                            />

                            <TextField
                              fullWidth
                              required={isUpdating}
                              label="Liên hệ"
                              name="contact"
                              type="text"
                              InputProps={{
                                readOnly: !isUpdating,
                              }}
                              onBlur={formik.handleBlur}
                              value={formik.values.contact}
                              onChange={formik.handleChange}
                              error={!!(formik.touched.contact && formik.errors.contact)}
                              helperText={formik.touched.contact && formik.errors.contact}
                            />
                          </Stack>

                          {isUpdating ? (
                            <>
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
                                    disabled={!isUpdating}
                                  >
                                    {provinces.map((province) => (
                                      <MenuItem key={province.id} value={province.id}>
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
                                    disabled={!isUpdating || !formik.values.province}
                                  >
                                    {districts.map((district) => (
                                      <MenuItem key={district.id} value={district.id}>
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
                                    disabled={!isUpdating || !formik.values.district}
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
                                    readOnly: !isUpdating,
                                  }}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.street}
                                  onChange={formik.handleChange}
                                  error={!!(formik.touched.street && formik.errors.street)}
                                  helperText={formik.touched.street && formik.errors.street}
                                />
                              </Stack>
                            </>
                          ) : (
                            <>
                              <Stack direction="row" spacing={3}>
                                <TextField
                                  fullWidth
                                  required={isUpdating}
                                  readOnly
                                  label="Địa chỉ"
                                  name="address"
                                  type="text"
                                  InputProps={{
                                    readOnly: !isUpdating,
                                  }}
                                  value={`${hotelData?.street}, ${hotelData?.ward}, ${hotelData?.district}, ${hotelData?.province}`}
                                />
                              </Stack>{" "}
                            </>
                          )}

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
                                readOnly: !isUpdating,
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
                                format="HH:mm:ss DD/MM/YYYY"
                                sx={{ width: { xs: "100%", md: "50%" } }}
                                label="Thời gian tạo"
                                name="created_at"
                                value={dayjs(hotelData?.created_at)}
                              />
                            </LocalizationProvider>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                readOnly
                                format="HH:mm:ss DD/MM/YYYY"
                                sx={{ width: { xs: "100%", md: "50%" } }}
                                label="Cập nhật gần nhất"
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
                            {isUpdating ? (
                              <Box
                                sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}
                              >
                                <Button
                                  type="submit"
                                  variant="contained"
                                  color="success"
                                  sx={{ mr: 2 }}
                                  onClick={formik.handleSubmit}
                                >
                                  Lưu thay đổi
                                </Button>
                                <Button
                                  variant="contained"
                                  color="inherit"
                                  onClick={handleCancelUpdate}
                                >
                                  Hủy
                                </Button>
                              </Box>
                            ) : (
                              <Button variant="contained" sx={{ mr: 2 }} onClick={handleUpdate}>
                                Chỉnh sửa
                              </Button>
                            )}
                          </Stack>
                        </Stack>
                      </Stack>
                    </Stack>

                    {formik.errors.submit && (
                      <Typography color="error" sx={{ mt: 3 }} variant="body2">
                        {formik.errors.submit}
                      </Typography>
                    )}
                  </form>
                </Box>

                {hotelData?.images && hotelData?.images.length > 0 && (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      overflowY: "auto",
                      maxHeight: 460,
                    }}
                  >
                    <ImageList variant="quilted" cols={4} gap={8} rowHeight={160}>
                      {hotelData?.images.map((image, index) => (
                        <ImageListItem
                          key={image.id}
                          cols={index === 0 ? 2 : 1}
                          rows={index === 0 ? 2 : 1}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "relative",
                            }}
                          >
                            <Image
                              fill
                              priority
                              // loading="lazy"
                              // loader={() => image.url}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              src={image.url}
                              alt={image.caption}
                              style={{
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <ImageListItemBar
                            sx={{
                              background:
                                "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                                "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                            }}
                            title={image.caption}
                            position="bottom"
                            actionIcon={
                              <IconButton
                                sx={{ color: "white" }}
                                aria-label={`star ${image.caption}`}
                              >
                                <StarBorderIcon />
                              </IconButton>
                            }
                            actionPosition="left"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ImageIcon />}
                        onClick={() => setOpenPopupAddImages(true)}
                      >
                        Sửa đổi ảnh
                      </Button>
                    </Box>
                  </Box>
                )}

                <HotelAmenities
                  hotelId={parseInt(hotelData?.id)}
                  amenities={hotelData?.hotelAmenities}
                />
              </Card>
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
          </Stack>
        </Container>
      </Box>

      {openPopupAddImages && hotelData && (
        <UpdateHotelImage
          onRefresh={getHotel}
          openPopupAddImages={openPopupAddImages}
          setOpenPopupAddImages={setOpenPopupAddImages}
          hotelData={hotelData}
          hotelId={hotelData?.id}
        />
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
