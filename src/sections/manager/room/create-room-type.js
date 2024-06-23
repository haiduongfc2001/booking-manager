import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
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
  Avatar,
  Chip,
  InputAdornment,
  FormControl,
  FormControlLabel,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import * as RoomService from "src/services/room-service";
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const initialData = {
  name: "",
  description: "",
  base_price: "",
  free_breakfast: true,
  standard_occupant: "",
  max_children: "",
  max_occupant: "",
  max_extra_bed: 0,
  views: [],
  area: "",
};

const CreateRoomType = (props) => {
  const { isModalCreateRoomType, setIsModalCreateRoomType, hotelId, onRefresh } = props;

  const [inputValue, setInputValue] = useState("");

  const dispatch = useDispatch();

  const handleCloseModalCreate = () => {
    setIsModalCreateRoomType(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      ...initialData,
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên là bắt buộc"),
      description: Yup.string().required("Mô tả là bắt buộc"),
      base_price: Yup.number()
        .required("Giá cơ bản là bắt buộc")
        .positive("Giá cơ bản phải là một số dương"),
      free_breakfast: Yup.boolean().required("Thông tin bữa sáng miễn phí là bắt buộc"),
      standard_occupant: Yup.number()
        .required("Số người tiêu chuẩn là bắt buộc")
        .positive("Số người tiêu chuẩn phải là một số dương"),
      max_children: Yup.number()
        .required("Số trẻ em tối đa là bắt buộc")
        .min(0, "Số trẻ em tối đa phải ít nhất là 0"),
      max_occupant: Yup.number()
        .required("Sức chứa tối đa là bắt buộc")
        .positive("Sức chứa tối đa phải là một số dương"),
      max_extra_bed: Yup.number()
        .required("Số giường phụ tối đa là bắt buộc")
        .min(0, "Số giường phụ tối đa phải ít nhất là 0"),
      views: Yup.array().of(Yup.string()).nullable(),
      area: Yup.number().nullable().positive("Diện tích phải là một số dương"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const valuesToSend = {
          name: values.name.trim(),
          description: values.description.trim(),
          base_price: Number(String(values.base_price).trim()),
          free_breakfast: values.free_breakfast,
          standard_occupant: Number(String(values.standard_occupant).trim()),
          max_children: Number(String(values.max_children).trim()),
          max_occupant: Number(String(values.max_occupant).trim()),
          max_extra_bed: 0,
          views: values.views ? values.views : [],
          area: values.area ? Number(String(values.area).trim()) : null,
        };

        dispatch(openLoadingApi());

        const response = await RoomService[API.ROOM_TYPE.CREATE_ROOM_TYPE]({
          hotel_id: String(hotelId).trim(),
          data: valuesToSend,
        });

        if (response?.status === STATUS_CODE.CREATED) {
          handleCloseModalCreate();
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

  const handleViewsChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      const newViews = [...formik.values.views, inputValue.trim()];
      formik.setFieldValue("views", newViews);
      setInputValue("");
    }
  };

  const handleDeleteView = (viewToDelete) => {
    const createdViews = formik.values.views.filter((view) => view !== viewToDelete);
    formik.setFieldValue("views", createdViews);
  };

  return (
    <Dialog
      open={isModalCreateRoomType}
      onClose={handleCloseModalCreate}
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
      <DialogTitle
        id="scroll-dialog-title"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backgroundColor: "white",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        Tạo loại phòng mới
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
      </DialogTitle>

      <DialogContent dividers>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Stack spacing={3} sx={{ mt: 3 }}>
            <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <TextField
                  autoFocus
                  fullWidth
                  required
                  label="Loại phòng"
                  name="name"
                  type="text"
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={!!(formik.touched.name && formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
                <TextField
                  fullWidth
                  required
                  label="Giá phòng"
                  name="base_price"
                  type="text"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">vnđ/đêm</InputAdornment>,
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.base_price}
                  onChange={formik.handleChange}
                  error={!!(formik.touched.base_price && formik.errors.base_price)}
                  helperText={formik.touched.base_price && formik.errors.base_price}
                />
                <FormControl
                  component="fieldset"
                  fullWidth
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.free_breakfast}
                        onChange={(event) =>
                          formik.setFieldValue("free_breakfast", event.target.checked)
                        }
                        name="free_breakfast"
                        color="primary"
                      />
                    }
                    label={
                      formik.values.free_breakfast
                        ? "Giá đã bao gồm bữa sáng"
                        : "Giá chưa bao gồm bữa sáng"
                    }
                    sx={{ marginLeft: 0 }}
                  />
                  {formik.touched.free_breakfast && formik.errors.free_breakfast && (
                    <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                      {formik.errors.free_breakfast}
                    </Typography>
                  )}
                </FormControl>
              </Stack>

              <Stack direction="row" spacing={3}>
                <TextField
                  fullWidth
                  required
                  multiline
                  label="Mô tả"
                  name="description"
                  type="text"
                  minRows={3}
                  maxRows={5}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={!!(formik.touched.description && formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Stack>

              <Stack direction="row" spacing={3}>
                <TextField
                  fullWidth
                  required
                  label="Số người tiêu chuẩn"
                  name="standard_occupant"
                  type="text"
                  onBlur={formik.handleBlur}
                  value={formik.values.standard_occupant}
                  onChange={formik.handleChange}
                  error={!!(formik.touched.standard_occupant && formik.errors.standard_occupant)}
                  helperText={formik.touched.standard_occupant && formik.errors.standard_occupant}
                />
                <TextField
                  fullWidth
                  required
                  label="Số trẻ em thêm tối đa"
                  name="max_children"
                  type="text"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.max_children}
                  error={!!(formik.touched.max_children && formik.errors.max_children)}
                  helperText={formik.touched.max_children && formik.errors.max_children}
                />
                <TextField
                  fullWidth
                  required
                  label="Sức chứa tối đa"
                  name="max_occupant"
                  type="text"
                  onBlur={formik.handleBlur}
                  value={formik.values.max_occupant}
                  onChange={formik.handleChange}
                  error={!!(formik.touched.max_occupant && formik.errors.max_occupant)}
                  helperText={formik.touched.max_occupant && formik.errors.max_occupant}
                />
              </Stack>

              <Stack direction="row" spacing={3}>
                <TextField
                  fullWidth
                  required
                  label="Diện tích"
                  name="area"
                  type="text"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m&sup2;</InputAdornment>,
                  }}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.area}
                  error={!!(formik.touched.area && formik.errors.area)}
                  helperText={formik.touched.area && formik.errors.area}
                />
              </Stack>
              <Stack direction="row" spacing={3} display="flex">
                <TextField
                  fullWidth
                  label="Hướng nhìn (nhập và nhấn Enter để thêm)..."
                  name="views"
                  onBlur={formik.handleBlur}
                  value={inputValue}
                  onChange={handleViewsChange}
                  onKeyDown={handleInputKeyPress}
                  error={!!(formik.touched.views && formik.errors.views)}
                  helperText={formik.touched.views && formik.errors.views}
                />
              </Stack>
              <Stack spacing={2} direction={"row"}>
                {formik.values.views.map((view, index) => (
                  <Chip
                    key={index}
                    label={view}
                    onDelete={() => handleDeleteView(view)}
                    sx={{ margin: "1px", width: "fit-content" }}
                    color="primary"
                  />
                ))}
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
          Tạo
        </Button>
        <Button variant="contained" color="inherit" onClick={handleCloseModalCreate}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoomType;

CreateRoomType.propTypes = {
  isModalCreateRoomType: PropTypes.bool.isRequired,
  setIsModalCreateRoomType: PropTypes.func.isRequired,
  hotelId: PropTypes.number.isRequired,
  onRefresh: PropTypes.func,
};
