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
  IconButton,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { PAGINATION, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import * as ReviewService from "src/services/review-service";
import { API } from "src/constant/constants";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useDispatch, useSelector } from "react-redux";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { neutral } from "src/theme/colors";
import { getInitials } from "src/utils/get-initials";
import { showCommonAlert } from "src/utils/toast-message";
import FormatCurrency from "src/utils/format-currency";
import {
  getBookingStatusColor,
  getPaymentStatusColor,
  getRefundStatusColor,
} from "src/utils/get-status-color";
import ratingCategory from "src/utils/rating-category";
import calculateNumberOfNights from "src/utils/calculate-number-of-nights";
import { Line, Circle } from "rc-progress";
import { ratingData, ratingDataByReview } from "src/utils/rating-data";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Page = () => {
  const [reviewsData, setReviewsData] = useState([]);
  const [averageRatings, setAverageRatings] = useState({});
  const [countByRatingLevel, setCountByRatingLevel] = useState({});
  const [numReviews, setNumReviews] = useState(0);
  const [page, setPage] = useState(PAGINATION.INITIAL_PAGE);
  const [isReplying, setIsReplying] = useState(false);
  const [replyReview, setReplyReview] = useState("");
  const [reviewId, setReviewId] = useState(null);
  const [isEditingReply, setIsEditingReply] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReply, setEditReply] = useState("");

  const inputRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const hotel_id = useSelector((state) => state.auth.hotel_id);
  const staff_id = useSelector((state) => state.auth.user_id);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      dispatch(openLoadingApi());

      const response = await ReviewService[API.REVIEW.GET_HOTEL_REVIEWS]({
        hotel_id,
        page,
        size: PAGINATION.PAGE_SIZE,
      });

      if (response?.status === STATUS_CODE.OK) {
        setReviewsData(response.data.reviews);
        setAverageRatings(response.data.averageRatings);
        setCountByRatingLevel(response.data.countByRatingLevel);
        setNumReviews(response.data.totalReviews);
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
    if (hotel_id) {
      fetchData();
    }
  }, [page]);

  const handleBookingClick = (bookingId) => {
    router.push(`/manager/booking/detail/${bookingId}`);
  };

  const handleCreateReplyReview = async (reviewId) => {
    try {
      dispatch(openLoadingApi());

      const response = await ReviewService[API.REVIEW.CREATE_REPLY_REVIEW]({
        review_id: reviewId,
        staff_id,
        reply: replyReview,
      });

      if (response?.status === STATUS_CODE.CREATED) {
        fetchData();
        setReplyReview(response.data);
        setIsReplying(false);
        setReplyReview("");
        setReviewId(null);
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  const handleEditReplyReview = (reviewId) => {
    setIsEditingReply(true);
    setEditingReviewId(reviewId);
    const review = reviewsData.find((review) => review?.id === reviewId);
    setEditReply(review?.replyReview?.reply || "");
  };

  const handleDeleteReplyReview = async (replyReviewId) => {
    try {
      dispatch(openLoadingApi());

      const response = await ReviewService[API.REVIEW.DELETE_REPLY_REVIEW]({
        reply_review_id: replyReviewId,
      });

      if (response?.status === STATUS_CODE.OK) {
        fetchData();
        // setReviewsData((prevData) =>
        //   prevData.map((review) =>
        //     review?.id === reviewId ? { ...review, replyReview: null } : review
        //   )
        // );
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  const handleSaveEditReply = async (replyReviewId) => {
    try {
      dispatch(openLoadingApi());

      const response = await ReviewService[API.REVIEW.UPDATE_REPLY_REVIEW]({
        reply_review_id: replyReviewId,
        review_id: editingReviewId,
        staff_id,
        reply: editReply,
      });

      if (response?.status === STATUS_CODE.OK) {
        fetchData();
        // setReviewsData((prevData) =>
        //   prevData.map((review) =>
        //     review?.id === replyReviewId
        //       ? { ...review, replyReview: { ...review?.replyReview, reply: editReply } }
        //       : review
        //   )
        // );
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        setEditingReviewId(null);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  const handleCancelEditReply = () => {
    setEditingReviewId(null);
    setEditReply("");
    setIsEditingReply(false);
  };

  // Sử dụng giá trị ratings để tính toán phần trăm
  const percentRating = (averageRatings?.overall / 10) * 100;

  return (
    <>
      <Head>
        <title>Đánh giá</title>
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
                <Typography variant="h4">Danh sách các đánh giá</Typography>
              </Stack>
            </Stack>

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
                Số đánh giá: {numReviews}
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

            {numReviews !== 0 && (
              <Card>
                <Box display="flex" justifyContent="space-around" m={2}>
                  <Box
                    sx={{
                      width: 160,
                      height: 160,
                      position: "relative",
                    }}
                  >
                    <Circle
                      percent={percentRating}
                      strokeWidth={4}
                      strokeColor="#6366F1"
                      trailWidth={4}
                      trailColor="#e2e8f0"
                      style={{
                        width: 160,
                        height: 160,
                      }}
                    />
                    <Box
                      sx={{
                        top: "50%",
                        left: "50%",
                        display: "flex",
                        position: "absolute",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          color: "primary.main",
                          fontSize: "30px",
                          fontWeight: "600",
                          lineHeight: "42px",
                        }}
                      >
                        {averageRatings?.overall}
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          fontWeight: "400",
                        }}
                      >
                        {ratingCategory(averageRatings?.overall)}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      mr: 8,
                    }}
                  >
                    {ratingData(averageRatings).map((rating) => (
                      <Box
                        key={rating.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: "10px",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: "70px",
                            mr: "10px",
                          }}
                        >
                          {rating.criteria}
                        </Box>
                        <Box width={200}>
                          <Line
                            percent={parseFloat(rating.rating) * 10}
                            strokeWidth={4}
                            strokeColor="#6366F1"
                            trailWidth={4}
                            trailColor="#e2e8f0"
                            style={{
                              width: 200,
                            }}
                          />
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            textAlign: "right",
                            ml: "10px",
                          }}
                        >
                          {rating.rating}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Card>
            )}

            {reviewsData?.length > 0 ? (
              reviewsData.map((review) => {
                const roomBooking = review?.booking?.roomBookings?.[0];
                const roomType = roomBooking?.room?.roomType;
                const roomTypeName = roomType?.name || "Unknown Room Type";
                const roomImage =
                  roomType?.roomImages?.find((image) => image.is_primary)?.url ||
                  (roomType?.roomImages?.length > 0
                    ? roomType?.roomImages[0]?.url
                    : "/assets/no_image_available.png");

                const totals = review?.booking?.roomBookings?.reduce(
                  (acc, roomBooking) => {
                    acc.num_adults += roomBooking.num_adults || 0;
                    acc.num_children += roomBooking.num_children || 0;
                    acc.children_ages.push(...(roomBooking.children_ages || []));
                    return acc;
                  },
                  { num_adults: 0, num_children: 0, children_ages: [] }
                );

                const numNights = calculateNumberOfNights(
                  review?.booking?.check_in,
                  review?.booking?.check_out
                );

                const percentRatingByReview = (review?.averageRating / 10) * 100;

                return (
                  <Card key={review?.id} sx={{ p: 2, mb: 2 }}>
                    <Stack spacing={2} mt={2}>
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
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={
                            <SvgIcon fontSize="small">
                              <ArrowForwardIcon />
                            </SvgIcon>
                          }
                          onClick={() => handleBookingClick(review?.booking?.id)}
                        >
                          Xem chi tiết đơn đặt phòng
                        </Button>
                      </Stack>
                      <Stack
                        spacing={2}
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                      >
                        <Chip
                          label={`Mã đơn đặt phòng: ${review?.booking?.code}`}
                          color={"info"}
                          sx={{
                            width: "auto",
                            fontWeight: 700,
                          }}
                        />

                        {/* <Chip
                          label={`Trạng thái: ${review?.booking?.translateStatus}`}
                          color={getBookingStatusColor(review?.booking?.status)}
                          sx={{
                            width: "auto",
                            fontWeight: 700,
                          }}
                        /> */}
                      </Stack>

                      <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            readOnly
                            format="HH:mm:ss DD/MM/YYYY"
                            sx={{ width: "100%" }}
                            label="Check-in"
                            name="check_in"
                            value={dayjs(review?.booking?.check_in)}
                          />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            readOnly
                            format="HH:mm:ss DD/MM/YYYY"
                            sx={{ width: "100%" }}
                            label="Check-out"
                            name="check_out"
                            value={dayjs(review?.booking?.check_out)}
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
                      <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                        <TextField
                          fullWidth
                          label="Tổng giá phòng"
                          name="total_room_price"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={FormatCurrency(review?.booking?.total_room_price)}
                        />
                        <TextField
                          fullWidth
                          label="Thuế và phí"
                          name="tax_and_fee"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={FormatCurrency(review?.booking?.tax_and_fee)}
                        />
                        <TextField
                          fullWidth
                          label="Tổng tiền"
                          name="totalPrice"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={FormatCurrency(
                            review?.booking?.total_room_price + review?.booking?.tax_and_fee
                          )}
                        />
                      </Stack>
                      <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                        <TextField
                          fullWidth
                          label="Số phòng"
                          name="num_rooms"
                          type="text"
                          InputProps={{ readOnly: true }}
                          value={review?.booking?.roomBookings?.length}
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

                    <Stack spacing={2} direction={{ xs: "column", lg: "row" }}>
                      {(() => {
                        const customer = review?.customer;

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

                    <Typography variant="h6" my={2}>
                      Đánh giá của khách hàng
                    </Typography>

                    <Card>
                      <Stack
                        spacing={2}
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-around"
                        alignItems="center"
                        m={2}
                      >
                        <Box
                          sx={{
                            width: 96,
                            height: 96,
                            position: "relative",
                          }}
                        >
                          <Circle
                            percent={percentRatingByReview}
                            strokeWidth={4}
                            strokeColor="#6366F1"
                            trailWidth={4}
                            trailColor="#e2e8f0"
                            style={{
                              width: 96,
                              height: 96,
                            }}
                          />
                          <Box
                            sx={{
                              top: "50%",
                              left: "50%",
                              display: "flex",
                              position: "absolute",
                              transform: "translate(-50%, -50%)",
                              textAlign: "center",
                              alignItems: "center",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                color: "primary.main",
                                fontSize: "16px",
                                fontWeight: "600",
                                lineHeight: "20px",
                              }}
                            >
                              {review?.averageRating}
                            </Box>
                            <Box
                              component="span"
                              sx={{
                                fontWeight: "400",
                              }}
                            >
                              {ratingCategory(review?.averageRating)}
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            mr: 8,
                          }}
                        >
                          {ratingDataByReview(review).map((rating) => (
                            <Box
                              key={rating.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: "10px",
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  width: "70px",
                                  mr: "10px",
                                }}
                              >
                                {rating.criteria}
                              </Box>
                              <Box width={200}>
                                <Line
                                  percent={parseFloat(rating.rating) * 10}
                                  strokeWidth={4}
                                  strokeColor="#6366F1"
                                  trailWidth={4}
                                  trailColor="#e2e8f0"
                                  style={{
                                    width: 120,
                                  }}
                                />
                              </Box>
                              <Box
                                component="span"
                                sx={{
                                  textAlign: "right",
                                  ml: "10px",
                                }}
                              >
                                {rating.rating}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                        <Stack
                          spacing={2}
                          direction="column"
                          alignItems={"flex-end"}
                          sx={{ width: { xs: "100%", lg: "40%" } }}
                        >
                          <TextField
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={5}
                            label="Nhận xét"
                            name="comment"
                            type="text"
                            InputProps={{
                              readOnly: true,
                            }}
                            value={review?.comment}
                          />

                          {!isReplying && reviewId !== review?.id && !review?.replyReview && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{
                                width: "fit-content",
                              }}
                              onClick={() => {
                                setIsReplying(true);
                                setReviewId(review?.id);
                              }}
                            >
                              Phản hồi
                            </Button>
                          )}
                        </Stack>
                      </Stack>

                      {review?.replyReview &&
                        (() => {
                          return (
                            <Stack spacing={2} px={2} py={1} width="100%" alignItems={"flex-end"}>
                              {editingReviewId === review?.id ? (
                                <>
                                  <TextField
                                    fullWidth
                                    multiline
                                    autoFocus
                                    minRows={3}
                                    maxRows={5}
                                    label="Phản hồi"
                                    sx={{
                                      width: "80%",
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      bgcolor: "primary.light",
                                      borderRadius: 1,
                                    }}
                                    value={editReply}
                                    onChange={(e) => setEditReply(e.target.value)}
                                  />
                                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="success"
                                      onClick={() => {
                                        handleSaveEditReply(review?.replyReview?.id);
                                      }}
                                    >
                                      Lưu
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="inherit"
                                      onClick={handleCancelEditReply}
                                    >
                                      Hủy
                                    </Button>
                                  </Stack>
                                </>
                              ) : (
                                <>
                                  <TextField
                                    fullWidth
                                    multiline
                                    minRows={1}
                                    maxRows={5}
                                    label="Phản hồi"
                                    sx={{
                                      width: "80%",
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      bgcolor: "primary.light",
                                      borderRadius: 1,
                                    }}
                                    value={review?.replyReview?.reply}
                                  />
                                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      size="small"
                                      onClick={() => handleEditReplyReview(review?.id)}
                                    >
                                      <EditIcon />
                                    </Button>
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color="error"
                                      onClick={() =>
                                        handleDeleteReplyReview(review?.replyReview?.id)
                                      }
                                    >
                                      <DeleteIcon />
                                    </Button>
                                  </Stack>
                                </>
                              )}
                            </Stack>
                          );
                        })()}

                      {isReplying && reviewId === review?.id && (
                        <Stack spacing={2} direction={"column"} m={2} alignItems={"flex-end"}>
                          <TextField
                            fullWidth
                            multiline
                            autoFocus={isReplying}
                            minRows={3}
                            maxRows={5}
                            label="Phản hồi"
                            name="reply_comment"
                            type="text"
                            sx={{
                              width: "80%",
                              display: "flex",
                              justifyContent: "flex-end",
                              bgcolor: "primary.light",
                              borderRadius: 1,
                            }}
                            value={replyReview}
                            onChange={(e) => setReplyReview(e.target.value)}
                          />

                          <Stack spacing={2} direction="row" justifyContent="flex-end">
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleCreateReplyReview(review?.id)}
                            >
                              Tạo phản hồi
                            </Button>
                            <Button
                              variant="contained"
                              color="inherit"
                              onClick={() => {
                                setIsReplying(false);
                                setReplyReview("");
                                setReviewId(null);
                              }}
                            >
                              Hủy
                            </Button>
                          </Stack>
                        </Stack>
                      )}
                    </Card>
                  </Card>
                );
              })
            ) : (
              <Card display="flex" justifyContent={"center"} alignItems sx={{ p: 2 }}>
                <Typography variant="h4" textAlign="center">
                  Không tìm thấy đơn đặt phòng nào
                </Typography>
              </Card>
            )}
          </Stack>

          {reviewsData?.length > 0 && (
            <Stack spacing={2} my={2} direction="row" justifyContent="center">
              <Pagination
                showFirstButton
                showLastButton
                defaultPage={Math.min(1, Math.ceil(numReviews / PAGINATION.PAGE_SIZE))}
                boundaryCount={2}
                count={Math.ceil(numReviews / PAGINATION.PAGE_SIZE)}
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
