import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  API,
  DISCOUNT_TYPE,
  PROMOTION_STATUS,
  STATUS_CODE,
  TOAST_KIND,
} from "src/constant/constants";
import * as RoomService from "src/services/room-service";
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import { SeverityPill } from "src/components/severity-pill";
import { StatusMap } from "src/components/status-map";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { DateTimePicker, MobileDateTimePicker, renderTimeViewClock } from "@mui/x-date-pickers";

const UpdatePromotion = (props) => {
  const {
    isModalUpdatePromotion,
    setIsModalUpdatePromotion,
    roomTypeData,
    roomTypeId,
    currentId,
    onRefresh,
  } = props;

  const [promotionData, setPromotionData] = useState([]);

  const dispatch = useDispatch();

  const getPromotion = async () => {
    try {
      dispatch(openLoadingApi());

      const response = await RoomService[API.ROOM_TYPE.PROMOTION.GET_PROMOTION_BY_ID]({
        room_type_id: String(roomTypeId).trim(),
        promotion_id: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        setPromotionData(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  useEffect(() => {
    if (isModalUpdatePromotion && roomTypeId && currentId) {
      getPromotion();
    }
  }, [isModalUpdatePromotion, roomTypeId, currentId]);

  const handleCloseModalUpdate = () => {
    setIsModalUpdatePromotion(false);
    formik.resetForm();
  };

  const initialValues = useMemo(
    () => ({
      code: promotionData?.code,
      discount_type: promotionData?.discount_type,
      discount_value: promotionData?.discount_value,
      start_date: dayjs(promotionData?.start_date),
      end_date: dayjs(promotionData?.end_date),
      is_active: promotionData?.is_active,
      submit: null,
    }),
    [
      promotionData?.code,
      promotionData?.discount_type,
      promotionData?.discount_value,
      promotionData?.start_date,
      promotionData?.end_date,
      promotionData?.is_active,
    ]
  );

  const formik = useFormik({
    initialValues,
    // validationSchema: Yup.object({
    //   code: Yup.string()
    //     .min(8, "Mã khuyến mãi phải có ít nhất 8 ký tự")
    //     .max(12, "Mã khuyến mãi không được vượt quá 12 ký tự")
    //     .required("Vui lòng nhập mã khuyến mãi!"),
    //   discount_type: Yup.mixed()
    //     .oneOf([DISCOUNT_TYPE.PERCENTAGE, DISCOUNT_TYPE.FIXED_AMOUNT], "Loại giảm giá không hợp lệ")
    //     .required("Vui lòng chọn loại giảm giá!"),
    //   discount_value: Yup.string()
    //     .matches(/^\d+$/, "Giá trị phải là số")
    //     .when("discount_type", (discount_type, schema) => {
    //       return discount_type === DISCOUNT_TYPE.PERCENTAGE
    //         ? schema
    //             .min(1, "Giá trị giảm giá phải ít nhất là 1%")
    //             .max(100, "Giá trị giảm giá không được vượt quá 100%")
    //         : schema
    //             .min(1, "Giá trị giảm giá phải lớn hơn 0!")
    //             .max(
    //               roomTypeData?.base_price,
    //               `Giá trị giảm giá không được vượt quá ${roomTypeData?.base_price}!`
    //             );
    //     })
    //     .required("Vui lòng nhập giá trị!"),
    //   start_date: Yup.date()
    //     .test(
    //       "is-greater-than-now",
    //       "Thời gian bắt đầu phải lớn hơn thời gian hiện tại",
    //       (value) => {
    //         return !value || dayjs().isBefore(dayjs(value));
    //       }
    //     )
    //     .required("Vui lòng chọn thời gian bắt đầu!"),
    //   end_date: Yup.date()
    //     .min(Yup.ref("start_date"), "Thời gian kết thúc phải lớn hơn thời gian bắt đầu")
    //     .required("Vui lòng chọn thời gian kết thúc!"),
    // }),

    onSubmit: async (values, helpers) => {
      try {
        dispatch(openLoadingApi());

        const response = await RoomService[API.ROOM_TYPE.PROMOTION.UPDATE_PROMOTION]({
          room_type_id: String(roomTypeId).trim(),
          promotion_id: String(currentId).trim(),
          code: values.code.trim(),
          discount_type: values.discount_type.trim(),
          discount_value: values.discount_value,
          start_date: values.start_date,
          end_date: values.end_date,
          is_active: values.is_active,
        });

        if (response?.status === STATUS_CODE.OK) {
          handleCloseModalUpdate();
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
          onRefresh();
        } else {
          helpers.setErrors({ submit: response.data.message });
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        dispatch(closeLoadingApi());
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  const handleCreatePromotionCode = () => {
    const length = Math.floor(Math.random() * 5) + 8;
    const code = Array(length)
      .fill(null)
      .map(() => Math.random().toString(36).charAt(2))
      .join("")
      .toUpperCase();
    formik.setFieldValue("code", code);
  };

  return (
    <Dialog
      open={isModalUpdatePromotion}
      onClose={handleCloseModalUpdate}
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
      <DialogTitle id="scroll-dialog-title" sx={{ borderBottom: "1px solid #e0e0e0" }}>
        Chỉnh sửa khuyến mãi
        <IconButton
          aria-label="close"
          onClick={handleCloseModalUpdate}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
              <Box sx={{ width: { xs: "100%", md: "50%" }, height: "100%" }}>
                <SeverityPill color={StatusMap[promotionData?.is_active]}>
                  {promotionData?.is_active === true ? "Đang hoạt động" : "Không hoạt động"}
                </SeverityPill>
              </Box>
              <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center">
                <TextField
                  autoFocus
                  fullWidth
                  required
                  label="Mã khuyến mãi"
                  name="code"
                  type="text"
                  sx={{ width: { xs: "100%", md: "60%" }, height: "100%" }}
                  onBlur={formik.handleBlur}
                  value={formik.values.code}
                  onChange={(e) => {
                    formik.setFieldValue("code", e.target.value.toUpperCase());
                  }}
                  error={!!(formik.touched.code && formik.errors.code)}
                  helperText={formik.touched.code && formik.errors.code}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleCreatePromotionCode}
                >
                  Tạo mã ngẫu nhiên
                </Button>
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center">
                <FormControl
                  fullWidth
                  required
                  error={!!(formik.touched.discount_type && formik.errors.discount_type)}
                >
                  <InputLabel id="discount-type-label">Giảm giá theo</InputLabel>
                  <Select
                    labelId="discount-type-label"
                    id="discount-type"
                    name="discount_type"
                    value={formik.values.discount_type}
                    onChange={formik.handleChange}
                    label="Giảm giá theo"
                  >
                    <MenuItem value={DISCOUNT_TYPE.PERCENTAGE}>Phần trăm</MenuItem>
                    <MenuItem value={DISCOUNT_TYPE.FIXED_AMOUNT}>Số tiền cố định</MenuItem>
                  </Select>
                </FormControl>

                {formik.values.discount_type && (
                  <TextField
                    fullWidth
                    required
                    label="Giá trị"
                    name="discount_value"
                    type="type"
                    inputMode="numeric"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {DISCOUNT_TYPE.PERCENTAGE === formik.values.discount_type
                            ? "%"
                            : DISCOUNT_TYPE.FIXED_AMOUNT === formik.values.discount_type
                            ? "đ"
                            : ""}
                        </InputAdornment>
                      ),
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.discount_value}
                    onChange={formik.handleChange}
                    error={!!(formik.touched.discount_value && formik.errors.discount_value)}
                    helperText={formik.touched.discount_value && formik.errors.discount_value}
                  />
                )}
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                  <MobileDateTimePicker
                    ampm={false}
                    label="Thời gian bắt đầu"
                    format="HH:mm:ss DD/MM/YYYY"
                    sx={{ width: { xs: "100%", md: "50%" } }}
                    minDate={
                      dayjs(formik.values.start_date).isBefore(dayjs())
                        ? dayjs(formik.values.start_date)
                        : dayjs().subtract(1, "hour")
                    }
                    views={["year", "day", "hours", "minutes", "seconds"]}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                    value={dayjs(formik.values.start_date)}
                    onChange={(newValue) => formik.setFieldValue("start_date", newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{ flex: 1 }}
                        error={formik.touched.start_date && Boolean(formik.errors.start_date)}
                        helperText={
                          formik.touched.start_date && typeof formik.errors.start_date === "string"
                            ? formik.errors.start_date
                            : ""
                        }
                      />
                    )}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                  <MobileDateTimePicker
                    ampm={false}
                    label="Thời gian kết thúc"
                    format="HH:mm:ss DD/MM/YYYY"
                    sx={{ width: { xs: "100%", md: "50%" } }}
                    minDate={dayjs(formik.values.start_date).add(2, "hours")}
                    value={dayjs(formik.values.end_date)}
                    onChange={(newValue) => formik.setFieldValue("end_date", newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        sx={{ flex: 1 }}
                        error={formik.touched.end_date && Boolean(formik.errors.end_date)}
                        helperText={
                          formik.touched.end_date && typeof formik.errors.end_date === "string"
                            ? formik.errors.end_date
                            : ""
                        }
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
                    sx={{ width: { xs: "100%", md: "50%" } }}
                    label="Thời gian tạo"
                    name="created_at"
                    value={dayjs(promotionData?.created_at)}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    readOnly
                    format="HH:mm:ss DD/MM/YYYY"
                    sx={{ width: { xs: "100%", md: "50%" } }}
                    label="Cập nhật gần nhất"
                    name="updated_at"
                    value={dayjs(promotionData?.updated_at)}
                  />
                </LocalizationProvider>
              </Stack>
            </Stack>
          </Stack>

          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
        </form>
      </DialogContent>

      <DialogActions sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mr: 2 }}
          onClick={formik.handleSubmit}
        >
          Lưu thay đổi
        </Button>
        <Button variant="contained" color="inherit" onClick={handleCloseModalUpdate}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdatePromotion;

UpdatePromotion.propTypes = {
  isModalUpdatePromotion: PropTypes.bool.isRequired,
  setIsModalUpdatePromotion: PropTypes.func.isRequired,
  hotelId: PropTypes.number.isRequired,
  currentId: PropTypes.number.isRequired,
};
