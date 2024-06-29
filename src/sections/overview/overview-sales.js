import PropTypes from "prop-types";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  SvgIcon,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Chart } from "src/components/chart";
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
import FormatCurrency from "src/utils/format-currency";

const useChartOptions = () => {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
      type: "solid",
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "40px",
      },
    },
    stroke: {
      colors: ["transparent"],
      show: true,
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        color: theme.palette.divider,
        show: true,
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      categories: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      labels: {
        offsetY: 5,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${FormatCurrency(value)}` : `${value}`),
        offsetX: -10,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };
};

export const OverviewSales = (props) => {
  const { sx } = props;
  const chartOptions = useChartOptions();
  const [hotelId, setHotelId] = useState(HOTEL_ID_FAKE);
  const [chartSeries, setChartSeries] = useState([]);

  const role = useSelector((state) => state.auth.role);

  const dispatch = useDispatch();

  const getBookingStats = async () => {
    if (getBookingStats.current) {
      return;
    }

    getBookingStats.current = true;
    try {
      dispatch(openLoadingApi());

      let response;

      switch (role) {
        case ROLE.ADMIN:
          response = await BookingService[API.BOOKING.GET_MONTH_BOOKING_REVENUE]();
          break;
        case ROLE.MANAGER:
        case ROLE.RECEPTIONIST:
          response = await BookingService[API.BOOKING.GET_MONTH_BOOKING_REVENUE_BY_HOTEL_ID]({
            hotel_id: hotelId,
          });
          break;
        default:
          return;
      }

      if (response?.status === STATUS_CODE.OK) {
        setChartSeries(response.data);
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
    <Card sx={sx}>
      <CardHeader
        action={
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startIcon={
              <SvgIcon fontSize="small">
                <ArrowPathIcon />
              </SvgIcon>
            }
          >
            Đồng bộ
          </Button>
        }
        title="Doanh thu"
      />
      <CardContent>
        <Chart height={350} options={chartOptions} series={chartSeries} type="bar" width="100%" />
      </CardContent>
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
        >
          Tổng quan
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewSales.protoTypes = {
  chartSeries: PropTypes.array.isRequired,
  sx: PropTypes.object,
};
