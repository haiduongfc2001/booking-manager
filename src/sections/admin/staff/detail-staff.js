import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SeverityPill } from "src/components/severity-pill";
import { StatusMapRole } from "src/components/status-map";
import { API, ROLE, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import LoadingData from "src/layouts/loading/loading-data";
import * as StaffService from "../../../services/staff-service";
import { getInitials } from "src/utils/get-initials";
import { neutral } from "src/theme/colors";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { getGenderLabel } from "src/utils/get-gender-label";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";

const DetailStaff = (props) => {
  const { isModalDetailStaff, setIsModalDetailStaff, hotelId, currentId } = props;

  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const getStaff = async () => {
    try {
      setLoading(true);

      const response = await StaffService[API.STAFF.GET_STAFF_BY_ID]({
        hotel_id: String(hotelId).trim(),
        staff_id: String(currentId).trim(),
      });

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setStaffData(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalDetailStaff && hotelId && currentId) {
      getStaff();
    }
  }, [isModalDetailStaff, hotelId, currentId]);

  const handleCloseModal = () => {
    setIsModalDetailStaff(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalDetailStaff) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalDetailStaff]);

  return (
    <Dialog
      open={isModalDetailStaff}
      onClose={handleCloseModal}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          height: "auto",
          minWidth: "80%",
        },
      }}
    >
      <DialogTitle id="scroll-dialog-title">Thông tin chi tiết</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseModal}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {loading ? (
          <LoadingData />
        ) : (
          <>
            <Stack spacing={3} sx={{ mt: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                alignItems={{ xs: "center", sm: "flex-start" }}
              >
                <Avatar
                  src={staffData?.avatar}
                  sx={{
                    bgcolor: neutral[300],
                    width: "calc(100% / 3)",
                    height: "auto",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {getInitials(staffData?.full_name)}
                </Avatar>

                <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                  <Stack direction="row" spacing={3}>
                    <TextField
                      autoFocus
                      fullWidth
                      label="Email"
                      name="email"
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ flex: 1 }}
                      value={staffData?.email}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="full_name"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={staffData?.full_name}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <TextField
                      fullWidth
                      label="Giới tính"
                      name="gender"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={getGenderLabel(staffData?.gender)}
                    />
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={staffData?.phone}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        readOnly
                        label="Ngày sinh"
                        name="dob"
                        sx={{ width: "50%" }}
                        value={dayjs(staffData?.dob)}
                      />
                    </LocalizationProvider>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        readOnly
                        label="Ngày tạo"
                        name="dob"
                        sx={{ width: "50%" }}
                        value={dayjs(staffData?.created_at)}
                      />
                    </LocalizationProvider>
                  </Stack>

                  <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                    <SeverityPill color={StatusMapRole[staffData?.role]}>
                      {staffData?.role === ROLE.MANAGER ? "Quản lý" : "Lễ tân"}
                    </SeverityPill>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="inherit" onClick={handleCloseModal}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailStaff;

DetailStaff.propTypes = {
  isModalDetailStaff: PropTypes.bool.isRequired,
  setIsModalDetailStaff: PropTypes.func.isRequired,
  hotelId: PropTypes.number.isRequired,
  currentId: PropTypes.number.isRequired,
};
