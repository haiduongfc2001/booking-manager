import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
  FormHelperText,
  Avatar,
  Autocomplete,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import * as StaffService from "../../../services/staff-service";
import * as HotelService from "../../../services/hotel-service";
import LoadingData from "src/layouts/loading/loading-data";
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";
import { neutral } from "src/theme/colors";
import { getInitials } from "src/utils/get-initials";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const EditStaff = (props) => {
  const { isModalEditStaff, setIsModalEditStaff, hotelId, currentId, onRefresh } = props;

  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [hotelList, setHotelList] = useState([]);
  const [hotelInfo, setHotelInfo] = useState(null);

  const dispatch = useDispatch();

  const defaultProps = {
    options: hotelList,
    getOptionLabel: (option) => option.name,
  };

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      const response = await HotelService[API.HOTEL.GET_HOTEL_LIST]();

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setHotelList(response.data);
      } else {
        // dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      // dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    }
  };

  const getStaff = async () => {
    try {
      setLoading(true);

      const response = await StaffService[API.STAFF.GET_STAFF_BY_ID]({
        hotel_id: String(hotelId).trim(),
        staff_id: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
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
    if (isModalEditStaff && hotelId && currentId) {
      getStaff();
    }
  }, [isModalEditStaff, hotelId, currentId]);

  const handleCloseModalEdit = () => {
    setIsModalEditStaff(false);
    formik.resetForm();
    setHotelInfo(null);
  };

  const initialValues = useMemo(
    () => ({
      email: staffData?.email || "",
      full_name: staffData?.full_name || "",
      gender: staffData?.gender || "",
      phone: staffData?.phone || "",
      hotel_id: staffData?.hotel_id || "",
      dob: staffData?.dob || null,
      role: staffData?.role || "",
      submit: null,
    }),
    [
      staffData?.dob,
      staffData?.email,
      staffData?.full_name,
      staffData?.gender,
      staffData?.hotel_id,
      staffData?.phone,
      staffData?.role,
    ]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Vui lòng nhập địa chỉ email hợp lệ!")
        .max(255)
        .required("Vui lòng nhập địa chỉ email!"),
      full_name: Yup.string().max(20).required("Vui lòng nhập họ và tên!"),
      gender: Yup.mixed().oneOf(["male", "female", "other"]).required("Vui lòng chọn 1 giới tính!"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Số điện thoại chỉ gồm 10 số!")
        .required("Vui lòng nhập số điện thoại!")
        .min(10, "Số điện thoại phải dài chính xác 10 ký tự!")
        .max(10, "Số điện thoại phải dài chính xác 10 ký tự!"),
      hotel_id: Yup.string()
        .matches(/^\d+$/, "Hotel ID phải là chuỗi số!")
        .required("Vui lòng nhập chọn 1 khách sạn!"),
      dob: Yup.string(),
      role: Yup.mixed()
        .oneOf(["manager", "receptionist"])
        .required("Vui lòng lựa chọn chức vụ của nhân viên!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        dispatch(openLoadingApi());
        const dobValue = values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : null;
        const response = await StaffService[API.STAFF.EDIT_STAFF]({
          staff_id: String(currentId).trim(),
          email: values.email.trim(),
          full_name: values.full_name.trim(),
          gender: values.gender.trim(),
          phone: values.phone.trim(),
          hotel_id: String(values.hotel_id).trim(),
          dob: dobValue,
          role: values.role.trim(),
        });

        if (response?.status === STATUS_CODE.OK) {
          handleCloseModalEdit();
          onRefresh();
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        } else {
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

  useEffect(() => {
    if (isModalEditStaff) {
      fetchData();
    }
  }, [isModalEditStaff]);

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalEditStaff) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalEditStaff]);

  const getHotelNameById = (hotel_id) => {
    const hotel = hotelList.find((hotel) => hotel.id === hotel_id);
    return hotel ? hotel.name : "";
  };

  useEffect(() => {
    if (staffData?.hotel_id) {
      const hotelName = getHotelNameById(staffData.hotel_id);
      if (hotelName) {
        const hotelInfo = hotelList.find((hotel) => hotel.name === hotelName);
        setHotelInfo(hotelInfo);
      }
    }
  }, [staffData, hotelList]);

  return (
    <Dialog
      open={isModalEditStaff}
      onClose={handleCloseModalEdit}
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
      <DialogTitle id="scroll-dialog-title">Chỉnh sửa tài khoản</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseModalEdit}
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
          <form noValidate onSubmit={formik.handleSubmit}>
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
                  <Stack direction={{ md: "row", xs: "column" }} spacing={3}>
                    <TextField
                      autoFocus
                      fullWidth
                      required
                      label="Email"
                      name="email"
                      type="email"
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={!!(formik.touched.email && formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                      fullWidth
                      required
                      label="Họ và tên"
                      name="full_name"
                      type="text"
                      onBlur={formik.handleBlur}
                      value={formik.values.full_name}
                      onChange={formik.handleChange}
                      error={!!(formik.touched.full_name && formik.errors.full_name)}
                      helperText={formik.touched.full_name && formik.errors.full_name}
                    />
                  </Stack>

                  <Stack direction={{ sm: "row", xs: "column" }} spacing={3}>
                    <TextField
                      fullWidth
                      required
                      label="Số điện thoại"
                      name="phone"
                      type="phone"
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      error={!!(formik.touched.phone && formik.errors.phone)}
                      helperText={formik.touched.phone && formik.errors.phone}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        required
                        fullWidth
                        label="Ngày sinh *"
                        name="dob"
                        onBlur={formik.handleBlur}
                        value={dayjs(formik.values.dob)}
                        onChange={(value) => {
                          formik.setFieldValue("dob", Date.parse(value));
                        }}
                        error={!!(formik.touched.dob && formik.errors.dob)}
                        helperText={formik.touched.dob && formik.errors.dob}
                      />
                    </LocalizationProvider>
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <FormControl
                      sx={{ width: "100%", m: 1, minWidth: 120 }}
                      error={!!(formik.touched.gender && formik.errors.gender)}
                    >
                      <FormLabel id="radio-gender">Giới tính</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="radio-gender"
                        defaultValue={staffData?.gender}
                        name="gender"
                        onBlur={formik.handleBlur}
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                      >
                        <FormControlLabel value="male" control={<Radio />} label="Nam" />
                        <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                        <FormControlLabel value="other" control={<Radio />} label="Khác" />
                      </RadioGroup>
                      {formik.touched.gender && formik.errors.gender && (
                        <FormHelperText>{formik.errors.gender}</FormHelperText>
                      )}
                    </FormControl>
                  </Stack>

                  <Stack direction={{ md: "row", xs: "column" }} spacing={3}>
                    <Autocomplete
                      {...defaultProps}
                      fullWidth
                      id="hotel_id"
                      value={hotelInfo}
                      onChange={(event, newValue) => {
                        setHotelInfo(newValue);
                        formik.setFieldValue("hotel_id", newValue?.id || "");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Khách sạn"
                          onBlur={formik.handleBlur}
                          error={!!(formik.touched.hotel_id && formik.errors.hotel_id)}
                          helperText={formik.touched.hotel_id && formik.errors.hotel_id}
                        />
                      )}
                    />

                    <FormControl
                      fullWidth
                      sx={{ m: 1, minWidth: 120 }}
                      error={!!(formik.touched.role && formik.errors.role)}
                    >
                      <FormLabel id="radio-role">Chức vụ</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="radio-role"
                        defaultValue={staffData?.role}
                        name="role"
                        onBlur={formik.handleBlur}
                        value={formik.values.role}
                        onChange={formik.handleChange}
                      >
                        <FormControlLabel value="manager" control={<Radio />} label="Quản lý" />
                        <FormControlLabel value="receptionist" control={<Radio />} label="Lễ tân" />
                      </RadioGroup>
                      {formik.touched.role && formik.errors.role && (
                        <FormHelperText>{formik.errors.role}</FormHelperText>
                      )}
                    </FormControl>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            {formik.errors.submit && (
              <Typography color="error" variant="body2" sx={{ mt: 3 }}>
                {formik.errors.submit}
              </Typography>
            )}
          </form>
        )}
      </DialogContent>

      <DialogActions sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mr: 2 }}
          onClick={formik.handleSubmit}
        >
          OK
        </Button>
        <Button variant="contained" color="inherit" onClick={handleCloseModalEdit}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditStaff;

EditStaff.propTypes = {
  isModalEditStaff: PropTypes.bool.isRequired,
  setIsModalEditStaff: PropTypes.func.isRequired,
  hotelId: PropTypes.number.isRequired,
  currentId: PropTypes.number.isRequired,
};
