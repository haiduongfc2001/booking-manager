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
import * as CustomerService from "src/services/customer-service";
import { useRouter } from "next/navigation";

export const OverviewTotalCustomers = (props) => {
  const { sx, tabIndex = 0 } = props;
  const [overviewTotalCustomers, setOverviewTotalCustomers] = useState({
    positive: false,
    totalCustomers: 0,
    currentMonthCount: 0,
    percentageChange: 0,
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const getCustomerStats = async () => {
    if (getCustomerStats.current) {
      return;
    }

    getCustomerStats.current = true;
    try {
      dispatch(openLoadingApi());

      const response = await CustomerService[API.CUSTOMER.GET_CUSTOMER_STATS]();

      if (response?.status === STATUS_CODE.OK) {
        const data = response.data;
        const percentageChange = data.percentageChange || 0;
        const positive = percentageChange >= 0;

        setOverviewTotalCustomers({
          ...overviewTotalCustomers,
          totalCustomers: data.totalCustomers,
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
    getCustomerStats();
  }, []);

  return (
    <Card sx={sx} tabIndex={tabIndex} onClick={() => router.push("/admin/customer")}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Khách hàng
            </Typography>
            <Typography variant="h4">{overviewTotalCustomers?.totalCustomers}</Typography>
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
        {overviewTotalCustomers?.percentageChange && (
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mt: 2 }}>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <SvgIcon
                color={overviewTotalCustomers?.positive ? "success" : "error"}
                fontSize="small"
              >
                {overviewTotalCustomers?.positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography
                color={overviewTotalCustomers?.positive ? "success.main" : "error.main"}
                variant="body2"
              >
                {overviewTotalCustomers?.percentageChange}%
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

OverviewTotalCustomers.propTypes = {
  sx: PropTypes.object,
};
