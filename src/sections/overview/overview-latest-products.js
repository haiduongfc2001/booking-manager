import { formatDistanceToNow } from "date-fns";
import PropTypes from "prop-types";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";
import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  SvgIcon,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as StaffService from "src/services/staff-service";
import { API, ROLE, STATUS_CODE } from "src/constant/constants";
import { useDispatch, useSelector } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { getStaffStatusColor } from "src/utils/get-status-color";
import { useRouter } from "next/router";

export const OverviewLatestProducts = (props) => {
  const { sx } = props;
  const [staffs, setStaffs] = useState([]);

  const role = useSelector((state) => state.auth.role);
  const hotel_id = useSelector((state) => state.auth.hotel_id);
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchStaffs = async () => {
    try {
      let response;

      if (role === ROLE.ADMIN) {
        response = await StaffService[API.HOTEL.STAFF.GET_ALL_STAFFS]();
      } else if (role === ROLE.MANAGER || role === ROLE.RECEPTIONIST) {
        response = await StaffService[API.HOTEL.STAFF.GET_ALL_STAFFS_BY_HOTEL_ID]({
          hotel_id,
        });
      } else {
        return;
      }

      if (response?.status === STATUS_CODE.OK) {
        setStaffs(response.data);
      } else {
        dispatch(showCommonAlert("error", "Failed to fetch staffs"));
      }
    } catch (error) {
      console.error("Failed to fetch staffs", error);
      dispatch(showCommonAlert("error", "Failed to fetch staffs"));
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, [role]);

  const handleViewAll = () => {
    switch (role) {
      case ROLE.ADMIN:
        router.push("/admin/staff");
        break;
      case ROLE.MANAGER:
        router.push("/manager/staff");
        break;
      default:
        dispatch(showCommonAlert("error", "Bạn không có quyền truy cập vào tài nguyên ngày!"));
        break;
    }
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Nhân viên khách sạn" />
      <List>
        {staffs?.map((staff, index) => {
          const hasDivider = index < staffs?.length - 1;
          // const ago = formatDistanceToNow(staff?.updated_at);

          return (
            <ListItem divider={hasDivider} key={staff?.id}>
              <ListItemAvatar>
                {staff?.avatar ? (
                  <Box
                    component="img"
                    src={staff?.avatar}
                    sx={{
                      borderRadius: 1,
                      height: 48,
                      width: 48,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      borderRadius: 1,
                      backgroundColor: "neutral.200",
                      height: 48,
                      width: 48,
                    }}
                  />
                )}
              </ListItemAvatar>
              <ListItemText
                primary={staff?.full_name}
                primaryTypographyProps={{ variant: "subtitle1" }}
                secondary={`${staff?.email}`}
                secondaryTypographyProps={{ variant: "body2" }}
              />
              <IconButton edge="end">
                <SvgIcon>
                  <EllipsisVerticalIcon />
                </SvgIcon>
              </IconButton>
            </ListItem>
          );
        })}
      </List>
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

OverviewLatestProducts.propTypes = {
  staffs: PropTypes.array,
  sx: PropTypes.object,
};
