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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  FormControlLabel,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/Constants";
import * as CustomerService from "../../services/CustomerService";
import LoadingData from "src/layouts/loading/LoadingData";
import { showCommonAlert } from "src/utils/ToastMessage";
import { useDispatch } from "react-redux";

const EditCustomer = (props) => {
  const { isModalEditCustomer, setIsModalEditCustomer, currentId, fetchData } = props;

  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const getCustomer = async () => {
    try {
      setLoading(true);

      const response = await CustomerService[API.CUSTOMER.GET_CUSTOMER_BY_ID]({
        customerId: currentId,
      });

      if (response?.status === STATUS_CODE.OK) {
        setCustomerData(response.data);
      } else {
        // dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      // dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.FILTER_ERROR));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalEditCustomer && currentId) {
      getCustomer();
    }
  }, [isModalEditCustomer, currentId]);

  const handleCloseModalEdit = () => {
    setIsModalEditCustomer(false);
    formik.resetForm();
  };

  const initialValues = useMemo(
    () => ({
      email: customerData?.email,
      username: customerData?.username,
      full_name: customerData?.full_name,
      gender: customerData?.gender,
      phone: customerData?.phone,
      avatar_url: customerData?.avatar_url,
      address: customerData?.address,
      is_verified: customerData?.is_verified,
      submit: null,
    }),
    [
      customerData?.address,
      customerData?.avatar_url,
      customerData?.email,
      customerData?.full_name,
      customerData?.gender,
      customerData?.is_verified,
      customerData?.phone,
      customerData?.username,
    ]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Vui lòng nhập địa chỉ email hợp lệ!")
        .max(255)
        .required("Vui lòng nhập địa chỉ email!"),
      username: Yup.string().max(20).required("Vui lòng nhập tên người dùng!"),
      full_name: Yup.string().max(20).required("Vui lòng nhập tên!"),
      gender: Yup.mixed()
        .oneOf(["male", "female", "other"])
        .required("Vui lòng nhập địa chỉ tên người dùng!"),
      phone: Yup.string().max(12).required("Vui lòng nhập số điện thoại!"),
      avatar_url: Yup.string(),
      address: Yup.string(),
      is_verified: Yup.boolean(),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const response = await CustomerService[API.CUSTOMER.EDIT_CUSTOMER]({
          customerId: currentId,
          email: values.email,
          username: values.username,
          full_name: values.full_name,
          gender: values.gender,
          phone: values.phone,
          avatar_url: values.avatar_url,
          address: values.address,
        });

        if (response?.status === STATUS_CODE.OK) {
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
          fetchData();
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        handleCloseModalEdit();
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (isModalEditCustomer) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isModalEditCustomer]);

  return (
    <Dialog
      open={isModalEditCustomer}
      onClose={handleCloseModalEdit}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "80vh",
          height: "auto",
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
              <TextField
                error={!!(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="email"
                value={formik.values.email}
                required
              />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <TextField
                  error={!!(formik.touched.username && formik.errors.username)}
                  fullWidth
                  helperText={formik.touched.username && formik.errors.username}
                  label="Tên người dùng"
                  name="username"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.username}
                  required
                />

                <TextField
                  error={!!(formik.touched.full_name && formik.errors.full_name)}
                  fullWidth
                  helperText={formik.touched.full_name && formik.errors.full_name}
                  label="Họ và tên"
                  name="full_name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="text"
                  value={formik.values.full_name}
                  required
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <FormControl error={!!(formik.touched.gender && formik.errors.gender)} fullWidth>
                  <InputLabel id="customer-gender">Giới tính</InputLabel>
                  <Select
                    labelId="customer-gender"
                    name="gender"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.gender}
                    defaultValue={formik.values.gender}
                    required
                  >
                    <MenuItem value="male">Nam</MenuItem>
                    <MenuItem value="female">Nữ</MenuItem>
                    <MenuItem value="other">Khác</MenuItem>
                  </Select>
                  {formik.touched.gender && formik.errors.gender && (
                    <FormHelperText>{formik.errors.gender}</FormHelperText>
                  )}
                </FormControl>
                <TextField
                  error={!!(formik.touched.phone && formik.errors.phone)}
                  fullWidth
                  helperText={formik.touched.phone && formik.errors.phone}
                  label="Số điện thoại"
                  name="phone"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="phone"
                  value={formik.values.phone}
                  required
                />
              </Stack>

              <TextField
                error={!!(formik.touched.avatar_url && formik.errors.avatar_url)}
                fullWidth
                helperText={formik.touched.avatar_url && formik.errors.avatar_url}
                label="Ảnh đại diện"
                name="avatar_url"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.avatar_url}
              />
              <TextField
                error={!!(formik.touched.address && formik.errors.address)}
                fullWidth
                helperText={formik.touched.address && formik.errors.address}
                label="Địa chỉ"
                name="address"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.address}
              />
              {/* <CustomizedSwitches
              onChange={formik.handleChange}
              isChecked={formik.values.is_verified}
            /> */}

              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.is_verified}
                    onChange={formik.handleChange}
                    name="is_verified"
                    color="primary"
                  />
                }
                label={formik.values.is_verified ? "Verified" : "Not Verified"}
              />
            </Stack>
            {formik.errors.submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
                {formik.errors.submit}
              </Typography>
            )}
          </form>
        )}
      </DialogContent>

      <DialogActions sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          onClick={formik.handleSubmit}
          sx={{ mr: 2 }}
          variant="contained"
          color="success"
        >
          OK
        </Button>
        <Button onClick={handleCloseModalEdit} variant="contained" color="inherit">
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCustomer;

EditCustomer.propTypes = {
  isModalEditCustomer: PropTypes.bool.isRequired,
  setIsModalEditCustomer: PropTypes.func.isRequired,
  currentId: PropTypes.number.isRequired,
};
