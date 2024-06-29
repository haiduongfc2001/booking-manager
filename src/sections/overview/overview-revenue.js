import PropTypes from "prop-types";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import {
  API,
  HOTEL_ID_FAKE,
  ROLE,
  STATUS_CODE,
  TOAST_KIND,
  TOAST_MESSAGE,
} from "src/constant/constants";
import { useDispatch, useSelector } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { useEffect, useState } from "react";
import * as BookingService from "src/services/booking-service";
import { useRouter } from "next/navigation";
import FormatCurrency from "src/utils/format-currency";

export const OverviewRevenue = (props) => {
  const { sx } = props;
  const [overviewRevenue, setOverviewRevenue] = useState({
    positive: false,
    totalRevenue: 0,
    currentMonthCount: 0,
    percentageChange: 0,
  });
  const [hotelId, setHotelId] = useState(HOTEL_ID_FAKE);

  const role = useSelector((state) => state.auth.role);

  const dispatch = useDispatch();
  const router = useRouter();

  const getRevenueStats = async () => {
    if (getRevenueStats.current) {
      return;
    }

    getRevenueStats.current = true;
    try {
      dispatch(openLoadingApi());

      let response;

      switch (role) {
        case ROLE.ADMIN:
          response = await BookingService[API.BOOKING.GET_TOTAL_BOOKING_REVENUE]();
          break;
        case ROLE.MANAGER:
        case ROLE.RECEPTIONIST:
          response = await BookingService[API.BOOKING.GET_TOTAL_BOOKING_REVENUE_BY_HOTEL_ID]({
            hotel_id: hotelId,
          });
          break;
        default:
          return;
      }

      if (response?.status === STATUS_CODE.OK) {
        const data = response.data;
        const percentageChange = data.percentageChange || 0;
        const positive = percentageChange >= 0;

        setOverviewRevenue({
          ...overviewRevenue,
          totalRevenue: data.totalRevenue,
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
    getRevenueStats();
  }, []);

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Doanh thu
            </Typography>
            <Typography variant="h5">{FormatCurrency(overviewRevenue.totalRevenue)}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        {overviewRevenue?.percentageChange && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon color={overviewRevenue?.positive ? "success" : "error"} fontSize="small">
                {overviewRevenue?.positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography
                color={overviewRevenue?.positive ? "success.main" : "error.main"}
                variant="body2"
              >
                {overviewRevenue?.percentageChange}%
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

OverviewRevenue.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired,
};
