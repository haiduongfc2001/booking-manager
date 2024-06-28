import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Card,
  Grid,
  TextField,
  Avatar,
  Pagination,
  Chip,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  HOTEL_ID_FAKE,
  PAGINATION,
  STATUS_CODE,
  TOAST_KIND,
  TOAST_MESSAGE,
} from "src/constant/constants";
import * as BookingService from "src/services/booking-service";
import { API } from "src/constant/constants";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch } from "react-redux";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { neutral } from "src/theme/colors";
import { getInitials } from "src/utils/get-initials";
import { showCommonAlert } from "src/utils/toast-message";
import FormatCurrency from "src/utils/format-currency";
import { SearchBooking } from "src/sections/manager/booking/search-booking";
import {
  getBookingStatusColor,
  getPaymentStatusColor,
  getRefundStatusColor,
} from "src/utils/get-status-color";

const Page = () => {
  const [hotelId, setHotelId] = useState(HOTEL_ID_FAKE);
  const [bookingsData, setBookingsData] = useState([]);
  const [numBookings, setNumBookings] = useState(0);
  const [page, setPage] = useState(PAGINATION.INITIAL_PAGE);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const inputRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      dispatch(openLoadingApi());

      const response = await BookingService[API.BOOKING.GET_ALL_BOOKINGS_BY_HOTEL_ID]({
        hotel_id: hotelId,
        page,
        size: PAGINATION.PAGE_SIZE,
      });

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setBookingsData(response.data);
        setNumBookings(response.totalBookings);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    scrollToTop();
  }, [page]);

  const handleBookingClick = (bookingId) => {
    router.push(`/manager/booking/detail/${bookingId}`);
  };

  return (
    <>
      <Head>
        <title>Đơn đặt phòng</title>
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
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">Danh sách các đơn đặt phòng</Typography>
              </Stack>
            </Stack>
            <Card sx={{ p: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <SearchBooking />
              </Stack>
            </Card>

            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pr: 2,
              }}
            >
              <Button variant="contained" color="info">
                Số đơn đặt phòng: {numBookings}
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
            </Grid>

            {bookingsData?.length > 0 &&
              bookingsData.map((booking) => {
                const roomBooking = booking?.roomBookings?.[0];
                const roomType = roomBooking?.room?.roomType;
                const roomTypeName = roomType?.name || "Unknown Room Type";
                const roomImage =
                  roomType?.roomImages?.find((image) => image.is_primary)?.url ||
                  (roomType?.roomImages?.length > 0
                    ? roomType?.roomImages[0]?.url
                    : "/assets/no_image_available.png");
                const totals = booking?.roomBookings.reduce(
                  (acc, roomBooking) => {
                    acc.num_adults += roomBooking.num_adults;
                    acc.num_children += roomBooking.num_children;
                    acc.children_ages.push(...(roomBooking.children_ages || []));
                    return acc;
                  },
                  { num_adults: 0, num_children: 0, children_ages: [] }
                );

                return (
                  <Card key={booking?.id} sx={{ p: 2, mb: 2 }}>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems="center"
                        spacing={2}
                      >
                        <Avatar
                          src={roomImage}
                          sx={{
                            bgcolor: neutral[300],
                            width: 64,
                            height: 64,
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                          }}
                          variant="rounded"
                        >
                          {getInitials(roomTypeName)}
                        </Avatar>
                        <Typography variant="h6">{roomTypeName}</Typography>
                      </Stack>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={
                          <SvgIcon fontSize="small">
                            <ArrowForwardIcon />
                          </SvgIcon>
                        }
                        onClick={() => handleBookingClick(booking?.id)}
                      >
                        Xem chi tiết
                      </Button>
                    </Stack>

                    <Stack spacing={2} mt={2}>
                      <Stack
                        spacing={2}
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                      >
                        <Chip
                          label={`Mã đơn đặt phòng: ${booking?.code}`}
                          color={"info"}
                          sx={{
                            width: "auto",
                            fontWeight: 700,
                          }}
                        />

                        <Chip
                          label={`Trạng thái: ${booking?.translateStatus}`}
                          color={getBookingStatusColor(booking?.status)}
                          sx={{
                            width: "auto",
                            fontWeight: 700,
                          }}
                        />
                      </Stack>

                      <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            readOnly
                            format="HH:mm:ss DD/MM/YYYY"
                            sx={{ width: "100%" }}
                            label="Check-in"
                            name="check_in"
                            value={dayjs(booking?.check_in)}
                          />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            readOnly
                            format="HH:mm:ss DD/MM/YYYY"
                            sx={{ width: "100%" }}
                            label="Check-out"
                            name="check_out"
                            value={dayjs(booking?.check_out)}
                          />
                        </LocalizationProvider>
                      </Stack>
                      <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                        <TextField
                          fullWidth
                          label="Tổng giá phòng"
                          name="total_room_price"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={FormatCurrency(booking?.total_room_price)}
                        />
                        <TextField
                          fullWidth
                          label="Thuế và phí"
                          name="tax_and_fee"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={FormatCurrency(booking?.tax_and_fee)}
                        />
                        <TextField
                          fullWidth
                          label="Tổng tiền"
                          name="totalPrice"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={FormatCurrency(booking?.totalPrice)}
                        />
                      </Stack>
                      <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                        <TextField
                          fullWidth
                          label="Số phòng"
                          name="num_rooms"
                          type="text"
                          InputProps={{ readOnly: true }}
                          value={booking?.roomBookings?.length}
                        />
                        <TextField
                          fullWidth
                          label="Số lượng người lớn"
                          name="num_adults"
                          type="text"
                          InputProps={{ readOnly: true }}
                          value={totals?.num_adults}
                        />
                        <TextField
                          fullWidth
                          label="Số lượng trẻ em"
                          name="num_children"
                          type="text"
                          InputProps={{ readOnly: true }}
                          value={totals?.num_children}
                        />
                        {roomBooking?.num_children > 0 && (
                          <TextField
                            fullWidth
                            label="Tuổi của trẻ em"
                            name="children_ages"
                            type="text"
                            InputProps={{ readOnly: true }}
                            value={totals?.children_ages?.join(", ") || "Không có"}
                          />
                        )}
                      </Stack>
                    </Stack>

                    <Typography variant="h6" my={2}>
                      Thông tin khách hàng
                    </Typography>

                    <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                      {(() => {
                        const customer = booking?.customer;

                        return (
                          <>
                            <TextField
                              fullWidth
                              label="Email"
                              name="email"
                              type="text"
                              InputProps={{ readOnly: true }}
                              value={customer?.email}
                            />
                            <TextField
                              fullWidth
                              label="Họ tên"
                              name="full_name"
                              type="text"
                              InputProps={{ readOnly: true }}
                              value={customer?.full_name}
                            />
                            <TextField
                              fullWidth
                              label="Số điện thoại"
                              name="phone"
                              type="text"
                              InputProps={{ readOnly: true }}
                              value={customer?.phone}
                            />
                          </>
                        );
                      })()}
                    </Stack>
                  </Card>
                );
              })}
          </Stack>

          {bookingsData?.length > 0 && (
            <Stack spacing={2} my={2} direction="row" justifyContent="center">
              <Pagination
                showFirstButton
                showLastButton
                defaultPage={Math.min(1, Math.ceil(numBookings / PAGINATION.PAGE_SIZE))}
                boundaryCount={2}
                count={Math.ceil(numBookings / PAGINATION.PAGE_SIZE)} // Sử dụng Math.ceil để làm tròn lên
                color="primary"
                page={page}
                onChange={handleChange}
              />
            </Stack>
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
