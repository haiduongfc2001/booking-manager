import PropTypes from "prop-types";
import ComputerDesktopIcon from "@heroicons/react/24/solid/ComputerDesktopIcon";
import DeviceTabletIcon from "@heroicons/react/24/solid/DeviceTabletIcon";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import { Chart } from "src/components/chart";
import { useEffect, useState } from "react";
import * as CustomerService from "src/services/customer-service";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { API, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";

const useChartOptions = (labels) => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
    },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
    dataLabels: {
      enabled: false,
    },
    labels,
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    states: {
      active: {
        filter: {
          type: "none",
        },
      },
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      fillSeriesColor: false,
    },
  };
};

const iconMap = {
  "Đã xác thực": (
    <SvgIcon>
      <ComputerDesktopIcon />
    </SvgIcon>
  ),
  "Chưa xác thực": (
    <SvgIcon>
      <DeviceTabletIcon />
    </SvgIcon>
  ),
};

export const OverviewTraffic = (props) => {
  const { sx } = props;
  const [chartSeries, setChartSeries] = useState([]);
  const [labels, setLabels] = useState(["Đã xác thực", "Chưa xác thực"]);

  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const response = await CustomerService[API.CUSTOMER.GET_ALL_CUSTOMERS]();

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        const customers = response.data;

        const verifiedCount = customers.filter((customer) => customer.is_verified).length;
        const unverifiedCount = customers.length - verifiedCount;

        setChartSeries([verifiedCount, unverifiedCount]);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      console.error("Failed to fetch customer data", error);
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartOptions = useChartOptions(labels);

  return (
    <Card sx={sx}>
      <CardHeader title="Khách hàng" />
      <CardContent>
        <Chart height={300} options={chartOptions} series={chartSeries} type="donut" width="100%" />
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          {chartSeries.map((item, index) => {
            const label = labels[index];

            return (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {iconMap[label]}
                <Typography sx={{ my: 1 }} variant="h6">
                  {label}
                </Typography>
                <Typography color="text.secondary" variant="subtitle2">
                  {item}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTraffic.propTypes = {
  sx: PropTypes.object,
};
