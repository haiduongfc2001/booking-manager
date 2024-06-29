import PropTypes from "prop-types";
// import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import HomeIcon from "@heroicons/react/24/solid/HomeIcon";
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from "@mui/material";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { API, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { useEffect, useState } from "react";
import * as HotelService from "src/services/hotel-service";
import { useRouter } from "next/navigation";

export const OverviewTotalHotels = (props) => {
  const { sx, tabIndex = 0 } = props;
  const [totalHotels, seTotalHotels] = useState(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const getTotalHotels = async () => {
    if (getTotalHotels.current) {
      return;
    }

    getTotalHotels.current = true;
    try {
      dispatch(openLoadingApi());

      const response = await HotelService[API.HOTEL.GET_TOTAL_HOTELS]();

      if (response?.status === STATUS_CODE.OK) {
        seTotalHotels(response.data);
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
    getTotalHotels();
  }, []);

  return (
    <Card sx={sx} tabIndex={tabIndex} onClick={() => router.push("/admin/hotel")}>
      <CardContent>
        <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Khách sạn
            </Typography>
            <Typography variant="h4">{totalHotels}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "primary.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              {/* <CurrencyDollarIcon /> */}
              <HomeIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalHotels.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object,
};
