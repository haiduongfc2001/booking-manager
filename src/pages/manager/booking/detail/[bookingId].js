import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Card,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  ImageList,
  ImageListItem,
  Avatar,
  ImageListItemBar,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { RoomTable } from "src/sections/manager/room/room-table";
import { HOTEL_ID_FAKE, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import * as BookingService from "src/services/room-service";
import { API } from "src/constant/constants";
import CreateRoom from "src/sections/manager/room/create-room";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import DeleteBooking from "src/sections/manager/room/delete-room-type";
import BookingBeds from "src/sections/manager/room/bed/bed";
import { useDispatch } from "react-redux";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { neutral } from "src/theme/colors";
import { getInitials } from "src/utils/get-initials";
import ImageIcon from "@mui/icons-material/Image";
import UpdateBookingImage from "src/sections/manager/room/update-room-type-image";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Image from "next/image";
import { showCommonAlert } from "src/utils/toast-message";
import UpdateBooking from "src/sections/manager/room/update-room-type";
import BookingAmenities from "src/sections/manager/room/room-type-amenity/room-type-amenity";
import BookingPromotions from "src/sections/manager/room/promotion/promotion";
import FormatCurrency from "src/utils/format-currency";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const listRoomsRef = useRef(null);

  const bookingId = params.bookingId;

  const [hotelId, setHotelId] = useState(HOTEL_ID_FAKE);
  const [bookingData, setBookingData] = useState({});
  const [isModalUpdateBooking, setIsModalUpdateBooking] = useState(false);

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      dispatch(openLoadingApi());

      const response = await BookingService[API.BOOKING.GET_BOOKING_BY_ID]({
        booking_id: bookingId,
      });

      if (response?.status === STATUS_CODE.OK) {
        setBookingData(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Chi tiết loại phòng</title>
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
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: "flex", justifyContent: "space-between", pr: 2 }}
            >
              <Button
                startIcon={
                  <SvgIcon fontSize="small">
                    <ArrowLeftIcon />
                  </SvgIcon>
                }
                variant="contained"
                color="inherit"
                onClick={() => router.push("/manager/room-type")}
              >
                Quay lại
              </Button>
              <Button
                startIcon={
                  <SvgIcon fontSize="small">
                    <ArrowPathIcon />
                  </SvgIcon>
                }
                variant="contained"
                color="secondary"
                onClick={fetchData}
              >
                Làm mới
              </Button>
            </Stack>

            {bookingId && (
              <Card key={bookingData?.id} sx={{ p: 2 }}>
                <Stack
                  direction={"row"}
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6">{bookingData?.name}</Typography>
                </Stack>

                <Box
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "center", sm: "flex-start" }}
                  p={2}
                  mt={2}
                  bgcolor={"#f2f3f5"}
                  borderRadius={"20px"}
                  sx={{
                    "& .MuiFormControl-root": {
                      bgcolor: "background.paper",
                      borderRadius: 1,
                    },
                  }}
                >
                  <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ width: "100%" }}>
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      spacing={3}
                      sx={{ width: "calc(100% / 3)", height: "100%" }}
                    >
                      <Avatar
                        src={
                          bookingData?.roomImages?.find((image) => image.is_primary)?.url ||
                          (bookingData?.roomImages?.length > 0
                            ? bookingData?.roomImages[0]?.url
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
                        {getInitials(bookingData?.name)}
                      </Avatar>
                    </Stack>

                    <Stack spacing={3} direction="column">
                      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                        <TextField
                          // inputRef={inputRef}
                          // autoFocus
                          fullWidth
                          label="Tên loại phòng"
                          name="name"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={bookingData?.name}
                        />
                      </Stack>
                      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                        <TextField
                          fullWidth
                          label="Giá phòng"
                          name="base_price"
                          type="text"
                          InputProps={{
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">/đêm</InputAdornment>,
                          }}
                          value={FormatCurrency(bookingData?.base_price)}
                        />
                        <TextField
                          fullWidth
                          label="Bữa sáng"
                          name="free_breakfast"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={
                            bookingData?.free_breakfast
                              ? "Giá đã bao gồm bữa sáng"
                              : "Giá chưa bao gồm bữa sáng"
                          }
                        />
                      </Stack>
                      <Stack direction="row" spacing={3}>
                        <TextField
                          fullWidth
                          multiline
                          label="Mô tả"
                          name="description"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          minRows={3}
                          maxRows={5}
                          value={bookingData?.description}
                        />
                      </Stack>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                        <TextField
                          fullWidth
                          label="Số người tiêu chuẩn"
                          name="standard_occupant"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={bookingData?.standard_occupant}
                        />
                        <TextField
                          fullWidth
                          label="Số trẻ em thêm tối đa"
                          name="max_children"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={bookingData?.max_children}
                        />
                        <TextField
                          fullWidth
                          label="Sức chứa tối đa"
                          name="max_occupant"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={bookingData?.max_occupant}
                        />
                      </Stack>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                        <TextField
                          fullWidth
                          label="Hướng nhìn"
                          name="views"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={bookingData?.views}
                        />
                        <TextField
                          fullWidth
                          label="Diện tích"
                          name="area"
                          type="text"
                          InputProps={{
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">m&sup2;</InputAdornment>,
                          }}
                          value={bookingData?.area}
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
                            value={dayjs(bookingData?.created_at)}
                          />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            readOnly
                            format="HH:mm:ss DD/MM/YYYY"
                            sx={{ width: { xs: "100%", md: "50%" } }}
                            label="Cập nhật gần nhất"
                            name="updated_at"
                            value={dayjs(bookingData?.updated_at)}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack spacing={3} sx={{ mt: 3, width: "100%" }}>
                    <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                        spacing={3}
                      >
                        <Button
                          variant="contained"
                          sx={{ mr: 2 }}
                          onClick={() => setIsModalUpdateBooking(true)}
                        >
                          Chỉnh sửa
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>
              </Card>
            )}
          </Stack>
        </Container>
      </Box>

      {bookingData?.id && isModalUpdateBooking && (
        <UpdateBooking
          isModalUpdateBooking={isModalUpdateBooking}
          setIsModalUpdateBooking={setIsModalUpdateBooking}
          bookingData={bookingData}
          onRefresh={fetchData}
        />
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
