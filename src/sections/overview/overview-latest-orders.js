import { format } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scroll-bar";
import { SeverityPill } from "src/components/severity-pill";
import { useEffect, useState } from "react";
import * as BookingService from "src/services/booking-service";
import { API, ROLE, STATUS_CODE } from "src/constant/constants";
import { useDispatch, useSelector } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { useRouter } from "next/router";
import dayjs from "dayjs";

const StatusMap = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "error",
};

export const OverviewLatestOrders = (props) => {
  const { sx } = props;
  const [bookings, setBookings] = useState([]);

  const role = useSelector((state) => state.auth.role);
  const hotel_id = useSelector((state) => state.auth.hotel_id);
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchBookings = async () => {
    try {
      let response;

      if (role === ROLE.ADMIN) {
        response = await BookingService[API.BOOKING.GET_ALL_BOOKINGS]();
      } else if (role === ROLE.MANAGER || role === ROLE.RECEPTIONIST) {
        response = await BookingService[API.BOOKING.GET_ALL_BOOKINGS_BY_HOTEL_ID]({
          hotel_id,
          page: 1,
          size: 10,
        });
      } else {
        // Handle other roles if needed
        return;
      }

      if (response?.status === STATUS_CODE.OK) {
        setBookings(response.data);
      } else {
        dispatch(showCommonAlert("error", "Failed to fetch bookings"));
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      dispatch(showCommonAlert("error", "Failed to fetch bookings"));
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [role]);

  const handleViewAll = () => {
    // Xử lý khi click vào nút Xem tất cả
    switch (role) {
      case ROLE.ADMIN:
        router.push("/admin/booking");
        break;
      case ROLE.MANAGER:
      case ROLE.RECEPTIONIST:
        router.push("/manager/booking");
        break;
      // Thêm xử lý cho các role khác nếu cần
      default:
        dispatch(showCommonAlert("error", "Unauthorized access"));
        break;
    }
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Đơn đặt phòng" />
      <Scrollbar sx={{ flexGrow: 1 }}>
        <Box sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đặt phòng</TableCell>
                <TableCell>Khách hàng</TableCell>
                <TableCell sortDirection="desc">Ngày đặt</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings?.map((booking) => {
                const created_at = dayjs(booking?.created_at).format("DD/MM/YYYY");

                return (
                  <TableRow hover key={booking?.id}>
                    <TableCell>{booking?.code}</TableCell>
                    <TableCell>{booking?.customer?.full_name}</TableCell>
                    <TableCell>{created_at}</TableCell>
                    <TableCell>
                      <SeverityPill color={StatusMap[booking?.status]}>
                        {booking?.status}
                      </SeverityPill>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="inherit"
          endIcon={
            <SvgIcon fontSize="small">
              <ArrowRightIcon />
            </SvgIcon>
          }
          size="small"
          variant="text"
          onClick={handleViewAll}
        >
          Xem tất cả
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewLatestOrders.prototype = {
  sx: PropTypes.object,
};
