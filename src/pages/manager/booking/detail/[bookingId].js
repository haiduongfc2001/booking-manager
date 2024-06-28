import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  TextField,
  Card,
  Avatar,
  Chip,
  InputAdornment,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { HOTEL_ID_FAKE, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import * as BookingService from "src/services/booking-service";
import { API } from "src/constant/constants";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { neutral } from "src/theme/colors";
import { getInitials } from "src/utils/get-initials";
import { showCommonAlert } from "src/utils/toast-message";
import UpdateBooking from "src/sections/manager/room/update-room-type";
import FormatCurrency from "src/utils/format-currency";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { SeverityPill } from "src/components/severity-pill";
import { getBookingStatusColor, getPaymentStatusColor } from "src/utils/get-status-color";
import calculateNumberOfNights from "src/utils/calculate-number-of-nights";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const bookingId = params.bookingId;

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
        <title>Chi tiết đơn đặt phòng</title>
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
                <Typography variant="h4">Chi tiết đơn đặt phòng</Typography>
              </Stack>
            </Stack>
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
                onClick={() => router.push("/manager/booking")}
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
              <Card key={bookingData?.id} sx={{ p: 2, mb: 2 }}>
                {(() => {
                  const roomBooking = bookingData?.roomBookings?.[0] || {};
                  const roomType = roomBooking?.room?.roomType || {};
                  const roomTypeName = roomType?.name || "Unknown Room Type";
                  const roomImage =
                    roomType?.roomImages?.find((image) => image.is_primary)?.url ||
                    (roomType?.roomImages?.length > 0
                      ? roomType?.roomImages[0]?.url
                      : "/assets/no_image_available.png");

                  const totals = bookingData?.roomBookings?.reduce(
                    (acc, roomBooking) => {
                      acc.num_adults += roomBooking.num_adults || 0;
                      acc.num_children += roomBooking.num_children || 0;
                      acc.children_ages.push(...(roomBooking.children_ages || []));
                      return acc;
                    },
                    { num_adults: 0, num_children: 0, children_ages: [] }
                  );

                  const numNights = calculateNumberOfNights(
                    bookingData?.check_in,
                    bookingData?.check_out
                  );

                  return (
                    <>
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
                              width: { xs: 128, sm: 96 },
                              height: { xs: 128, sm: 96 },
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                            }}
                            variant="rounded"
                          >
                            {getInitials(roomTypeName)}
                          </Avatar>
                          <Typography variant="h6">{roomTypeName}</Typography>
                        </Stack>
                      </Stack>

                      <Stack spacing={2} mt={2}>
                        <Stack
                          spacing={2}
                          direction={{ xs: "column", md: "row" }}
                          justifyContent="space-between"
                        >
                          <Chip
                            label={`Mã đơn đặt phòng: ${bookingData?.code}`}
                            color={"info"}
                            sx={{
                              width: "auto",
                              fontWeight: 700,
                            }}
                          />

                          <Chip
                            label={`Trạng thái: ${bookingData?.translateStatus}`}
                            color={getBookingStatusColor(bookingData?.status)}
                            sx={{
                              width: "auto",
                              fontWeight: 700,
                            }}
                          />

                          <Chip
                            label={`Thanh toán: ${bookingData?.payment?.translateStatus}`}
                            color={getPaymentStatusColor(bookingData?.payment?.status)}
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
                              value={dayjs(bookingData?.check_in)}
                            />
                          </LocalizationProvider>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              readOnly
                              format="HH:mm:ss DD/MM/YYYY"
                              sx={{ width: "100%" }}
                              label="Check-out"
                              name="check_out"
                              value={dayjs(bookingData?.check_out)}
                            />
                          </LocalizationProvider>
                          <TextField
                            fullWidth
                            label="Số đêm"
                            name="night"
                            type="text"
                            InputProps={{
                              readOnly: true,
                            }}
                            value={numNights}
                          />
                        </Stack>
                        <Typography variant="h6" my={2}>
                          Thông tin khách hàng
                        </Typography>
                        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                          {(() => {
                            const customer = bookingData?.customer || {};

                            return (
                              <>
                                <TextField
                                  fullWidth
                                  label="Email"
                                  name="email"
                                  type="text"
                                  InputProps={{ readOnly: true }}
                                  value={customer?.email || ""}
                                />
                                <TextField
                                  fullWidth
                                  label="Họ tên"
                                  name="full_name"
                                  type="text"
                                  InputProps={{ readOnly: true }}
                                  value={customer?.full_name || ""}
                                />
                                <TextField
                                  fullWidth
                                  label="Số điện thoại"
                                  name="phone"
                                  type="text"
                                  InputProps={{ readOnly: true }}
                                  value={customer?.phone || ""}
                                />
                              </>
                            );
                          })()}
                        </Stack>
                        <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
                          <Stack
                            spacing={2}
                            direction={{ xs: "column" }}
                            width={{ xs: "100%", md: "50%" }}
                          >
                            <Typography variant="h6" my={2}>
                              Chi phí
                            </Typography>
                            <TextField
                              fullWidth
                              label="Tổng giá phòng"
                              name="total_room_price"
                              type="text"
                              InputProps={{
                                readOnly: true,
                              }}
                              value={FormatCurrency(bookingData?.total_room_price)}
                            />
                            <TextField
                              fullWidth
                              label="Thuế và phí"
                              name="tax_and_fee"
                              type="text"
                              InputProps={{
                                readOnly: true,
                              }}
                              value={FormatCurrency(bookingData?.tax_and_fee)}
                            />
                            <TextField
                              fullWidth
                              label="Tổng tiền"
                              name="totalPrice"
                              type="text"
                              InputProps={{
                                readOnly: true,
                              }}
                              value={FormatCurrency(bookingData?.totalPrice)}
                            />
                          </Stack>
                          <Stack
                            spacing={2}
                            direction={{ xs: "column" }}
                            width={{ xs: "100%", md: "50%" }}
                          >
                            <Typography variant="h6" my={2}>
                              Số lượng người
                            </Typography>
                            <TextField
                              fullWidth
                              label="Số phòng"
                              name="num_rooms"
                              type="text"
                              InputProps={{ readOnly: true }}
                              value={bookingData?.roomBookings?.length || 0}
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
                            {totals?.num_children > 0 && (
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
                          Danh sách phòng
                        </Typography>
                        {(() => {
                          const roomBookings = bookingData?.roomBookings || [];

                          const formatGuestInfo = (numAdults, numChildren, childrenAges) => {
                            let result = `${numAdults} người lớn`;

                            if (numChildren > 0) {
                              result += `, ${numChildren} trẻ em`;

                              if (childrenAges && childrenAges.length > 0) {
                                result += ` (${childrenAges.join(" tuổi, ")} tuổi)`;
                              }
                            }

                            return result;
                          };

                          return (
                            <>
                              {roomBookings?.length > 0 &&
                                roomBookings.map((roomBooking, index) => (
                                  <Stack bgcolor="#f2f3ff" m={1} p={2} borderRadius={"20px"}>
                                    <Typography variant="subtitle1">Phòng {index + 1}</Typography>
                                    <Stack
                                      key={roomBooking.id}
                                      direction={{ xs: "column" }}
                                      spacing={3}
                                      my={2}
                                    >
                                      <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                                        <TextField
                                          fullWidth
                                          label="Số phòng"
                                          name="type"
                                          type="text"
                                          sx={{
                                            borderRadius: 1,
                                            "& .MuiInputBase-input": {
                                              bgcolor: "background.paper",
                                            },
                                            width: { xs: "100%", md: "30%" },
                                          }}
                                          InputProps={{ readOnly: true }}
                                          value={roomBooking?.room?.number || ""}
                                        />
                                        <TextField
                                          fullWidth
                                          label="Thông tin khách"
                                          name="guest_info"
                                          type="text"
                                          sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                                          InputProps={{ readOnly: true }}
                                          value={formatGuestInfo(
                                            roomBooking?.num_adults || 0,
                                            roomBooking?.num_children || 0,
                                            roomBooking?.children_ages || []
                                          )}
                                        />
                                      </Stack>
                                      <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                                        <TextField
                                          fullWidth
                                          label="Giá phòng gốc"
                                          name="base_price"
                                          type="text"
                                          sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                                          InputProps={{
                                            readOnly: true,
                                            endAdornment: (
                                              <InputAdornment position="end">/đêm</InputAdornment>
                                            ),
                                          }}
                                          value={FormatCurrency(roomBooking?.base_price)}
                                        />
                                        <TextField
                                          fullWidth
                                          label="Giảm giá"
                                          name="discount"
                                          type="text"
                                          sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                                          InputProps={{ readOnly: true }}
                                          value={FormatCurrency(roomBooking?.discount)}
                                        />
                                        <TextField
                                          fullWidth
                                          label="Phụ thu"
                                          name="surcharge"
                                          type="text"
                                          sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                                          InputProps={{ readOnly: true }}
                                          value={FormatCurrency(roomBooking?.surcharge)}
                                        />
                                        <TextField
                                          fullWidth
                                          label="Tổng tiền phòng"
                                          name="total"
                                          type="text"
                                          sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                                          InputProps={{ readOnly: true }}
                                          value={`${FormatCurrency(
                                            (roomBooking?.base_price - roomBooking?.discount) *
                                              numNights
                                          )} cho 2 đêm`}
                                        />
                                      </Stack>
                                    </Stack>
                                  </Stack>
                                ))}
                            </>
                          );
                        })()}
                      </Stack>
                    </>
                  );
                })()}
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
