import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { API, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { useEffect, useState } from "react";
import * as BookingService from "src/services/booking-service";
import { useRouter } from "next/navigation";

export const OverviewTotalBookings = (props) => {
  const { sx, tabIndex = 0 } = props;
  const [overviewTotalBookings, setOverviewTotalBookings] = useState({
    positive: false,
    totalBookings: 0,
    currentMonthCount: 0,
    percentageChange: 0,
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const getBookingStats = async () => {
    if (getBookingStats.current) {
      return;
    }

    getBookingStats.current = true;
    try {
      dispatch(openLoadingApi());

      const response = await BookingService[API.BOOKING.GET_BOOKING_STATS]();

      if (response?.status === STATUS_CODE.OK) {
        const data = response.data;
        const percentageChange = data.percentageChange || 0;
        const positive = percentageChange >= 0;

        setOverviewTotalBookings({
          ...overviewTotalBookings,
          totalBookings: data.totalBookings,
          currentMonthCount: data.currentMonthCount,
          percentageChange: Math.abs(percentageChange || 0),
          positive,
        });
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
    getBookingStats();
  }, []);

  return (
    <Card sx={sx} tabIndex={tabIndex} onClick={() => router.push("/admin/booking")}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Đơn đặt phòng
            </Typography>
            <Typography variant="h4">{overviewTotalBookings?.totalBookings}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <UsersIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        {overviewTotalBookings?.percentageChange && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon
                color={overviewTotalBookings?.positive ? "success" : "error"}
                fontSize="small"
              >
                {overviewTotalBookings?.positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography
                color={overviewTotalBookings?.positive ? "success.main" : "error.main"}
                variant="body2"
              >
                {overviewTotalBookings?.percentageChange}%
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="caption">
              So với tháng trước
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

OverviewTotalBookings.propTypes = {
  sx: PropTypes.object,
};
