import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
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
  Autocomplete,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as StaffService from "src/services/staff-service";
import * as HotelService from "src/services/hotel-service";
import { API, GENDER, ROLE, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import { useDispatch, useSelector } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import dayjs from "dayjs";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const initialData = {
  email: "",
  full_name: "",
  gender: "",
  phone: "",
  role: "",
};

const CreateStaff = (props) => {
  const { isModalCreateStaff, setIsModalCreateStaff, onRefresh } = props;

  const [hotelList, setHotelList] = useState([]);
  const [hotelInfo, setHotelInfo] = useState(null);
  const hotel_id = useSelector((state) => state.auth.hotel_id);

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
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        dispatch(openLoadingApi());
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
      dispatch(closeLoadingApi());
    }
  };

  const handleCloseModalCreate = () => {
    setIsModalCreateStaff(false);
    formik.resetForm();
    setHotelInfo(null);
  };

  const formik = useFormik({
    initialValues: {
      ...initialData,
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Vui lòng nhập địa chỉ email hợp lệ!")
        .max(255)
        .required("Vui lòng nhập địa chỉ email!"),
      full_name: Yup.string().max(20).required("Vui lòng nhập họ và tên!"),
      gender: Yup.mixed()
        .oneOf([GENDER.MALE, GENDER.FEMALE, GENDER.OTHER])
        .required("Vui lòng chọn 1 giới tính!"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Số điện thoại chỉ gồm 10 số!")
        .required("Vui lòng nhập số điện thoại!")
        .min(10, "Số điện thoại phải dài chính xác 10 ký tự!")
        .max(10, "Số điện thoại phải dài chính xác 10 ký tự!"),
      role: Yup.mixed()
        .oneOf([ROLE.MANAGER, ROLE.RECEPTIONIST])
        .required("Vui lòng lựa chọn chức vụ của nhân viên!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        dispatch(openLoadingApi());
        const response = await StaffService[API.HOTEL.STAFF.CREATE_STAFF]({
          email: values.email.trim(),
          full_name: values.full_name.trim(),
          gender: values.gender.trim(),
          phone: values.phone.trim(),
          hotel_id: String(hotel_id).trim(),
          role: values.role.trim(),
        });

        if (response?.status === STATUS_CODE.CREATED) {
          handleCloseModalCreate();
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
        // handleCloseModalCreate();
        dispatch(closeLoadingApi());
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  useEffect(() => {
    if (isModalCreateStaff) {
      fetchData();
    }
  }, [isModalCreateStaff]);

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalCreateStaff) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalCreateStaff]);

  return (
    <Dialog
      open={isModalCreateStaff}
      onClose={handleCloseModalCreate}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          height: "auto",
          minWidth: "70%",
        },
      }}
    >
      <DialogTitle id="scroll-dialog-title">Tạo tài khoản nhân viên</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseModalCreate}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <form noValidate onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 3 }}>
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

              <Stack direction={{ md: "row", xs: "column" }} spacing={3}>
                <TextField
                  required
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  type="phone"
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={!!(formik.touched.phone && formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
                <FormControl
                  sx={{ width: "100%", m: 1, minWidth: 120 }}
                  error={!!(formik.touched.gender && formik.errors.gender)}
                >
                  <FormLabel id="radio-gender">Giới tính</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="radio-gender"
                    defaultValue=""
                    name="gender"
                    onBlur={formik.handleBlur}
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel value={GENDER.MALE} control={<Radio />} label="Nam" />
                    <FormControlLabel value={GENDER.FEMALE} control={<Radio />} label="Nữ" />
                    <FormControlLabel value={GENDER.OTHER} control={<Radio />} label="Khác" />
                  </RadioGroup>
                  {formik.touched.gender && formik.errors.gender && (
                    <FormHelperText>{formik.errors.gender}</FormHelperText>
                  )}
                </FormControl>
              </Stack>

              <Stack direction={{ md: "row", xs: "column" }} spacing={3}>
                <FormControl
                  fullWidth
                  sx={{ m: 1, minWidth: 120 }}
                  error={!!(formik.touched.role && formik.errors.role)}
                >
                  <FormLabel id="radio-role">Chức vụ</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="radio-role"
                    defaultValue=""
                    name="role"
                    onBlur={formik.handleBlur}
                    value={formik.values.role}
                    onChange={formik.handleChange}
                  >
                    {/* <FormControlLabel value={ROLE.MANAGER} control={<Radio />} label="Quản lý" /> */}
                    <FormControlLabel
                      value={ROLE.RECEPTIONIST}
                      control={<Radio />}
                      label="Lễ tân"
                    />
                  </RadioGroup>
                  {formik.touched.role && formik.errors.role && (
                    <FormHelperText>{formik.errors.role}</FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Stack>
          </Stack>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
        </DialogContent>
      </form>

      <DialogActions
        sx={{
          my: 3,
          mr: 3,
          display: { xs: "block", md: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Alert variant="filled" severity="info">
          Mật khẩu ngẫu nhiên sẽ được gửi tới email bạn cung cấp.
        </Alert>
        <Stack direction="row" sx={{ mt: 1 }} justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="success"
            sx={{ mr: 2 }}
            onClick={formik.handleSubmit}
          >
            Tạo
          </Button>
          <Button variant="contained" color="inherit" onClick={handleCloseModalCreate}>
            Hủy
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default CreateStaff;

CreateStaff.propTypes = {
  isModalCreateStaff: PropTypes.bool.isRequired,
  setIsModalCreateStaff: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
};
