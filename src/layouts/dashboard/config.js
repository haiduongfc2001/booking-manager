import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import DocumentCheckIcon from "@heroicons/react/24/solid/DocumentCheckIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { SvgIcon } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import SensorDoorIcon from "@mui/icons-material/SensorDoor";
import PolicyIcon from "@mui/icons-material/Policy";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export const items = [
  {
    title: "Tổng quan",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
    roles: ["ADMIN", "MANAGER", "RECEPTIONIST"],
  },
  {
    title: "Khách hàng",
    path: "/admin/customer",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
    roles: ["ADMIN"],
  },
  {
    title: "Nhân viên khách sạn",
    path: "/admin/staff",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
    roles: ["ADMIN"],
  },
  {
    title: "Khách sạn",
    path: "/admin/hotel",
    icon: (
      <SvgIcon fontSize="small">
        <HotelIcon />
      </SvgIcon>
    ),
    roles: ["ADMIN"],
  },
  {
    title: "Khách sạn của tôi",
    path: "/manager/hotel",
    icon: (
      <SvgIcon fontSize="small">
        <HotelIcon />
      </SvgIcon>
    ),
    roles: ["MANAGER"],
  },
  {
    title: "Phòng",
    path: "/manager/room-type",
    icon: (
      <SvgIcon fontSize="small">
        <SensorDoorIcon />
      </SvgIcon>
    ),
    roles: ["MANAGER", "RECEPTIONIST"],
  },
  {
    title: "Nhân viên của tôi",
    path: "/manager/staff",
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    ),
    roles: ["MANAGER"],
  },
  {
    title: "Chính sách",
    path: "/manager/policy",
    icon: (
      <SvgIcon fontSize="small">
        <PolicyIcon />
      </SvgIcon>
    ),
    roles: ["MANAGER"],
  },
  {
    title: "Đơn đặt phòng",
    path: "/manager/booking",
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingCartIcon />
      </SvgIcon>
    ),
    roles: ["MANAGER", "RECEPTIONIST"],
  },
  {
    title: "Đánh giá",
    path: "/manager/review",
    icon: (
      <SvgIcon fontSize="small">
        <RateReviewIcon />
      </SvgIcon>
    ),
    roles: ["MANAGER"],
  },
  // {
  //   title: "Tài khoản",
  //   path: "/account",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserIcon />
  //     </SvgIcon>
  //   ),
  //   roles: ["ADMIN", "MANAGER", "RECEPTIONIST"],
  // },
  {
    title: "Phòng",
    path: "/receptionist/room-type",
    icon: (
      <SvgIcon fontSize="small">
        <SensorDoorIcon />
      </SvgIcon>
    ),
    roles: [],
  },
  {
    title: "Kiểm tra trạng thái phòng",
    path: "/receptionist/booking-guest",
    icon: (
      <SvgIcon fontSize="small">
        <DocumentCheckIcon />
      </SvgIcon>
    ),
    roles: ["RECEPTIONIST"],
  },
  // {
  //   title: "Cài đặt",
  //   path: "/settings",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CogIcon />
  //     </SvgIcon>
  //   ),
  //   roles: ["ADMIN", "MANAGER", "RECEPTIONIST"],
  // },
  // {
  //   title: "Đăng nhập",
  //   path: "/auth/login",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <LockClosedIcon />
  //     </SvgIcon>
  //   ),
  //   roles: ["ADMIN", "MANAGER", "RECEPTIONIST"],
  // },
  // {
  //   title: "Đăng ký",
  //   path: "/auth/register",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserPlusIcon />
  //     </SvgIcon>
  //   ),
  //   roles: ["ADMIN", "MANAGER", "RECEPTIONIST"],
  // },
  // {
  //   title: "Error",
  //   path: "/404",
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <XCircleIcon />
  //     </SvgIcon>
  //   ),
  //   roles: ["ADMIN", "MANAGER", "RECEPTIONIST"],
  // },
];
