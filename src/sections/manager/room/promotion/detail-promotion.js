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
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  API,
  DISCOUNT_TYPE,
  PROMOTION_STATUS,
  STATUS_CODE,
  TOAST_KIND,
  TOAST_MESSAGE,
} from "src/constant/constants";
import * as RoomService from "src/services/room-service";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import { SeverityPill } from "src/components/severity-pill";
import { StatusMap } from "src/components/status-map";
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const DetailPromotion = (props) => {
  const { isModalDetailPromotion, setIsModalDetailPromotion, roomTypeId, currentId } = props;
  const dispatch = useDispatch();

  const [promotionData, setPromotionData] = useState([]);

  const getPromotion = async () => {
    try {
      dispatch(openLoadingApi());

      const response = await RoomService[API.ROOM_TYPE.PROMOTION.GET_PROMOTION_BY_ID]({
        room_type_id: String(roomTypeId).trim(),
        promotion_id: String(currentId).trim(),
      });

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setPromotionData(response.data);
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
    if (isModalDetailPromotion && currentId) {
      getPromotion();
    }
  }, [isModalDetailPromotion, currentId]);

  const handleCloseModal = () => {
    setIsModalDetailPromotion(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalDetailPromotion) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalDetailPromotion]);

  return (
    <Dialog
      open={isModalDetailPromotion}
      onClose={handleCloseModal}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          height: "auto",
          minWidth: "60%",
        },
      }}
    >
      <DialogTitle id="scroll-dialog-title">Thông tin khuyến mãi chi tiết</DialogTitle>
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
        <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center">
            <Box sx={{ width: { xs: "100%", md: "50%" }, height: "100%" }}>
              <SeverityPill color={StatusMap[promotionData?.is_active]}>
                {promotionData?.is_active === true ? "Đang hoạt động" : "Không hoạt động"}
              </SeverityPill>
            </Box>
            <TextField
              fullWidth
              autoFocus
              label="Mã khuyến mãi"
              name="code"
              InputProps={{
                readOnly: true,
              }}
              value={promotionData?.code || ""}
            />
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center">
            <TextField
              fullWidth
              label="Giảm giá theo"
              name="discount_type"
              InputProps={{
                readOnly: true,
              }}
              value={promotionData?.discount_type || ""}
            />
            <TextField
              fullWidth
              label="Giá trị"
              name="discount_value"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    {DISCOUNT_TYPE.PERCENTAGE === promotionData?.discount_type
                      ? "%"
                      : DISCOUNT_TYPE.FIXED_AMOUNT === promotionData?.discount_type
                      ? "đ"
                      : ""}
                  </InputAdornment>
                ),
              }}
              value={promotionData?.discount_value || ""}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs} width="50%">
              <DateTimePicker
                ampm={false}
                readOnly
                format="HH:mm:ss DD/MM/YYYY"
                label="Thời gian bắt đầu"
                sx={{ width: { xs: "100%", md: "50%" } }}
                defaultValue={dayjs(promotionData?.start_date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      flex: 1,
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                ampm={false}
                readOnly
                format="HH:mm:ss DD/MM/YYYY"
                label="Thời gian kết thúc"
                sx={{ width: { xs: "100%", md: "50%" } }}
                defaultValue={dayjs(promotionData?.end_date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{
                      flex: 1,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                readOnly
                format="HH:mm:ss DD/MM/YYYY"
                label="Ngày tạo"
                name="created_at"
                sx={{ width: { xs: "100%", md: "50%" } }}
                value={dayjs(promotionData?.created_at)}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                readOnly
                format="HH:mm:ss DD/MM/YYYY"
                label="Ngày cập nhật gần nhất"
                name="updated_at"
                sx={{ width: { xs: "100%", md: "50%" } }}
                value={dayjs(promotionData?.updated_at)}
              />
            </LocalizationProvider>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="inherit" onClick={handleCloseModal}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailPromotion;

DetailPromotion.propTypes = {
  isModalDetailPromotion: PropTypes.bool.isRequired,
  setIsModalDetailPromotion: PropTypes.func.isRequired,
  roomTypeId: PropTypes.number.isRequired,
  currentId: PropTypes.number.isRequired,
};
