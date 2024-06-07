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
  Avatar,
  Grid,
  CardMedia,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API, IMAGE, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import * as RoomService from "../../../services/room-service";
import LoadingData from "src/layouts/loading/loading-data";
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";
import { neutral } from "src/theme/colors";
import { getInitials } from "src/utils/get-initials";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Box from "@mui/material/Box";

const EditRoom = (props) => {
  const { isModalEditRoom, setIsModalEditRoom, hotelId, currentId, onRefresh } = props;

  const [roomData, setRoomData] = useState([]);
  const [roomImageId, setRoomImageId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalDeleteRoomImage, setIsModalDeleteRoomImage] = useState(false);
  const [selectedRoomImage, setSelectedRoomImage] = useState(null);

  const dispatch = useDispatch();

  const getRoom = async () => {
    try {
      setLoading(true);

      const response = await RoomService[API.ROOM.GET_ROOM_BY_ID]({
        hotel_id: String(hotelId).trim(),
        room_id: String(currentId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        setRoomData(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalEditRoom && hotelId && currentId) {
      getRoom();
    }
  }, [isModalEditRoom, hotelId, currentId]);

  const handleCloseModalEdit = () => {
    setIsModalEditRoom(false);
    formik.resetForm();
    formikUpdateImage.resetForm();
    formikAddImage.resetForm();
  };

  const handleAddImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.name = "images";
    input.multiple = true;
    input.accept = "image/*";

    input.addEventListener("change", (event) => {
      const selectedImages = Array.from(event.target.files);

      // Prioritize early return for error handling
      if (
        selectedImages.length + formikAddImage.values.images.length + roomData?.images?.length >
        5
      ) {
        const images = 5 - roomData.images.length;
        dispatch(showCommonAlert(TOAST_KIND.ERROR, `Chỉ được thêm tối đa ${images} ảnh!`));
        return;
      }

      // Directly update formikAddImage with concise spread syntax
      formikAddImage.setValues((prevValues) => ({
        ...prevValues,
        images: [...prevValues.images, ...selectedImages],
        captions: [...prevValues.captions, ...new Array(selectedImages.length).fill("")], // Initialize captions for new images
        is_primarys: [...prevValues.is_primarys, ...new Array(selectedImages.length).fill(false)], // Initialize is_primarys for new images
      }));
    });

    // Trigger file selection dialog immediately
    input.click();
  };

  const handleRemoveImage = (index) => {
    formikAddImage.setValues((prevData) => {
      const updatedImages = [...prevData.images];
      const updatedCaptions = [...prevData.captions];
      const updatedIsPrimarys = [...prevData.is_primarys];

      updatedImages.splice(index, 1);
      updatedCaptions.splice(index, 1);
      updatedIsPrimarys.splice(index, 1);

      return {
        ...prevData,
        images: updatedImages,
        captions: updatedCaptions,
        is_primarys: updatedIsPrimarys,
      };
    });
  };

  const handleCaptionChange = (index, caption) => {
    formikAddImage.setValues((prevData) => {
      const updatedCaptions = [...prevData.captions];
      updatedCaptions[index] = caption;

      return { ...prevData, captions: updatedCaptions };
    });
  };

  const handleIsPrimaryChange = (index) => {
    formikAddImage.setValues((prevData) => {
      const updatedIsPrimarys = [...prevData.is_primarys];
      updatedIsPrimarys.fill(false); // Reset all to false
      updatedIsPrimarys[index] = true;

      // If all is_primarys are false, default to the first image
      if (!updatedIsPrimarys.some((value) => value)) {
        updatedIsPrimarys[0] = true;
      }

      return { ...prevData, is_primarys: updatedIsPrimarys };
    });
  };

  const handleOpenModalDeleteRoomImage = (image_id) => {
    setRoomImageId(image_id);
    setIsModalDeleteRoomImage(true);
  };

  const handleCloseModalDeleteRoomImage = () => {
    setRoomImageId("");
    setIsModalDeleteRoomImage(false);
  };

  const handleDeleteRoomImage = async () => {
    try {
      const response = await RoomService[API.ROOM.DELETE_ROOM_IMAGE_BY_ID]({
        hotel_id: String(hotelId).trim(),
        room_id: String(currentId).trim(),
        room_image_id: String(roomImageId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        getRoom();
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      handleCloseModalDeleteRoomImage();
    }
  };

  const initialValues = useMemo(
    () => ({
      number: roomData?.number || "",
      type: roomData?.type || "",
      price: roomData?.price || "",
      discount: roomData?.discount || "",
      capacity: roomData?.capacity || "",
      description: roomData?.description || "",
      submit: null,
    }),
    [
      roomData?.capacity,
      roomData?.description,
      roomData?.discount,
      roomData?.number,
      roomData?.price,
      roomData?.type,
    ]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      number: Yup.string()
        .max(255, "Tên phòng không được vượt quá 255 ký tự")
        .required("Vui lòng nhập tên phòng!"),
      type: Yup.string().required("Vui lòng nhập loại phòng!"),
      price: Yup.number()
        .required("Vui lòng nhập giá phòng!")
        .min(0, "Giá phòng phải lớn hơn hoặc bằng 0"),
      discount: Yup.number()
        .when("price", (price, schema) => {
          return price
            ? schema
                .min(0, "Giá giảm phải lớn hơn hoặc bằng 0")
                .max(price, "Giá giảm không được lớn hơn giá phòng")
            : schema;
        })
        .required("Vui lòng nhập giá phòng khi đã giảm giá!"),
      capacity: Yup.number()
        .required("Vui lòng nhập sức chứa của phòng!")
        .integer("Sức chứa phải là số nguyên!")
        .min(1, "Sức chứa phải lớn hơn hoặc bằng 1"),
      description: Yup.string()
        .min(10, "Mô tả phòng phải có ít nhất 10 ký tự!")
        .required("Vui lòng nhập mô tả về phòng!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const formData = new FormData();
        formData.append("number", values.number.trim());
        formData.append("type", values.type.trim());
        formData.append("price", Number(String(values.price).trim()));
        formData.append("discount", Number(String(values.discount).trim()));
        formData.append("capacity", Number(String(values.capacity).trim()));
        formData.append("description", values.description.trim());
        formData.append("status", "available");

        const response = await RoomService[API.ROOM.EDIT_ROOM]({
          hotel_id: String(hotelId).trim(),
          room_id: String(currentId).trim(),
          formData,
        });

        if (response?.status === STATUS_CODE.OK) {
          handleCloseModalEdit();
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
          onRefresh();
        } else {
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  const handleEditRoomImage = (image) => {
    setSelectedRoomImage(image);
  };

  const formikUpdateImage = useFormik({
    initialValues: {
      caption: selectedRoomImage ? selectedRoomImage.caption : "",
      is_primary: selectedRoomImage ? selectedRoomImage.is_primary : false,
    },
    validationSchema: Yup.object({
      caption: Yup.string().required("Cần có chú thích cho ảnh!"),
      is_primary: Yup.boolean(),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const response = await RoomService[API.ROOM.UPDATE_ROOM_IMAGE_BY_ID]({
          hotel_id: String(hotelId).trim(),
          room_id: String(currentId).trim(),
          room_image_id: String(selectedRoomImage.id).trim(),
          caption: values.caption,
          is_primary: values.is_primary,
        });

        if (response?.status === STATUS_CODE.OK) {
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
          getRoom();
        } else {
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  const handleCancelEdit = () => {
    setSelectedRoomImage(null);
  };

  const formikAddImage = useFormik({
    initialValues: {
      images: [],
      captions: [],
      is_primarys: [],
      submit: null,
    },
    validationSchema: Yup.object({
      images: Yup.array().max(
        IMAGE.MAX_NUMBER_OF_IMAGES - roomData?.images?.length,
        `Cho phép tối đa ${IMAGE.MAX_NUMBER_OF_IMAGES - roomData?.images?.length} hình ảnh!`
      ),
      captions: Yup.array().of(Yup.string().required("Cần có chú thích cho ảnh!")),
      is_primarys: Yup.array().of(Yup.boolean()),
    }),

    onSubmit: async (values, helpers) => {
      const formData = new FormData();
      values.images.forEach((image, index) => {
        formData.append("images", image);
        formData.append("captions", values.captions[index]);
        formData.append("is_primarys", values.is_primarys[index]);
      });

      try {
        const response = await RoomService[API.ROOM.CREATE_ROOM_IMAGES]({
          hotel_id: String(hotelId).trim(),
          room_id: String(currentId).trim(),
          formData,
        });

        if (response?.status === STATUS_CODE.CREATED) {
          formikAddImage.resetForm();
          getRoom();
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        } else {
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  return (
    <Dialog
      open={isModalEditRoom}
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
        Chỉnh sửa thông tin phòng
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
      </DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <LoadingData />
        ) : (
          <>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3} sx={{ mt: 3 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={3}
                  alignItems={{ xs: "center", sm: "flex-start" }}
                >
                  <Avatar
                    src={
                      roomData?.images?.find((image) => image.is_primary)?.url ||
                      (roomData?.images?.length > 0
                        ? roomData?.images[0]?.url
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png")
                    }
                    sx={{
                      bgcolor: neutral[300],
                      width: "calc(100% / 3)",
                      height: "100%",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    variant="rounded"
                  >
                    {getInitials(roomData?.name)}
                  </Avatar>
                  <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                      <TextField
                        autoFocus
                        fullWidth
                        required
                        label="Số phòng"
                        name="number"
                        type="text"
                        onBlur={formik.handleBlur}
                        value={formik.values.number}
                        onChange={formik.handleChange}
                        error={!!(formik.touched.number && formik.errors.number)}
                        helperText={formik.touched.number && formik.errors.number}
                      />
                      <TextField
                        fullWidth
                        required
                        label="Loại phòng"
                        name="type"
                        type="text"
                        onBlur={formik.handleBlur}
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        error={!!(formik.touched.type && formik.errors.type)}
                        helperText={formik.touched.type && formik.errors.type}
                      />
                    </Stack>

                    <Stack direction="row" spacing={3}>
                      <TextField
                        fullWidth
                        required
                        label="Sức chứa"
                        name="capacity"
                        type="text"
                        onBlur={formik.handleBlur}
                        value={formik.values.capacity}
                        onChange={formik.handleChange}
                        error={!!(formik.touched.capacity && formik.errors.capacity)}
                        helperText={formik.touched.capacity && formik.errors.capacity}
                      />
                      <TextField
                        fullWidth
                        required
                        label="Giá gốc"
                        name="price"
                        type="text"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.price}
                        error={!!(formik.touched.price && formik.errors.price)}
                        helperText={formik.touched.price && formik.errors.price}
                      />
                      <TextField
                        fullWidth
                        required
                        label="Giảm giá"
                        name="discount"
                        type="text"
                        onBlur={formik.handleBlur}
                        value={formik.values.discount}
                        onChange={formik.handleChange}
                        error={!!(formik.touched.discount && formik.errors.discount)}
                        helperText={formik.touched.discount && formik.errors.discount}
                      />
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

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          readOnly
                          label="Ngày tạo"
                          name="created_at"
                          value={dayjs(roomData?.created_at)}
                        />
                      </LocalizationProvider>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          readOnly
                          label="Ngày cập nhật gần nhất"
                          name="updated_at"
                          value={dayjs(roomData?.updated_at)}
                        />
                      </LocalizationProvider>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
            </form>

            {/* images for room */}
            <Box
              sx={{
                my: 4,
                bgcolor: "background.default",
                width: "100%",
                borderRadius: 4,
              }}
            >
              <Grid container spacing={2} justifyContent="center">
                {roomData.images?.map((image, index) => (
                  <Grid item xs={12} key={index} sx={{ p: "0 !important", mt: 2 }}>
                    <Grid container spacing={2} alignItems="center" direction="column">
                      <Grid
                        item
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mx: 2, mt: 1 }}
                      >
                        <CardMedia
                          component="img"
                          src={image.url}
                          alt={`${index + 1}`}
                          sx={{
                            width: 160,
                            height: 160,
                            objectFit: "cover",
                            mb: 2,
                            borderRadius: "20%",
                            mr: 2,
                          }}
                        />

                        {selectedRoomImage === image ? (
                          <>
                            <TextField
                              fullWidth
                              required
                              multiline
                              label="Mô tả ảnh"
                              name={`caption-${index}`}
                              type="text"
                              minRows={3}
                              maxRows={5}
                              sx={{ backgroundColor: "white", mr: 2 }}
                              value={formikUpdateImage.values.caption}
                              onChange={(e) =>
                                formikUpdateImage.setFieldValue(`caption`, e.target.value)
                              }
                              error={
                                !!(
                                  formikUpdateImage.touched.caption &&
                                  formikUpdateImage.errors.caption
                                )
                              }
                              helperText={
                                formikUpdateImage.touched.caption &&
                                formikUpdateImage.errors.caption
                              }
                            />

                            <RadioGroup
                              aria-label="is_primary"
                              name={`is_primary-${index}`}
                              value={formikUpdateImage.values.is_primary}
                              onChange={(e) =>
                                formikUpdateImage.setFieldValue(`is_primary`, e.target.value)
                              }
                            >
                              <FormControlLabel
                                value={true}
                                control={<Radio />}
                                label="Ảnh đại diện"
                              />
                            </RadioGroup>

                            <Button
                              variant="contained"
                              color="success"
                              onClick={formikUpdateImage.handleSubmit}
                              sx={{ mx: 1 }}
                            >
                              Lưu
                            </Button>
                            <Button
                              variant="contained"
                              color="inherit"
                              sx={{ mx: 1 }}
                              onClick={handleCancelEdit}
                            >
                              Hủy
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleEditRoomImage(image)}
                            >
                              Sửa
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              sx={{ mx: 2 }}
                              onClick={() => handleOpenModalDeleteRoomImage(image.id)}
                            >
                              Xóa
                            </Button>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={2} justifyContent="center">
                {formikAddImage.values.images.map((image, index) => (
                  <Grid item xs={12} key={index} sx={{ p: "0 !important", mt: 2 }}>
                    <Grid container spacing={2} alignItems="center" direction="column">
                      <Grid
                        item
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mx: 2, mt: 1 }}
                      >
                        <CardMedia
                          component="img"
                          src={URL.createObjectURL(image)}
                          alt={`${index + 1}`}
                          sx={{
                            width: 160,
                            height: 160,
                            objectFit: "cover",
                            mb: 2,
                            borderRadius: "20%",
                            mr: 2,
                          }}
                        />
                        <TextField
                          fullWidth
                          required
                          multiline
                          label="Mô tả ảnh"
                          name={`captions[${index}]`}
                          type="text"
                          minRows={3}
                          maxRows={5}
                          sx={{ backgroundColor: "white", mr: 2 }}
                          onBlur={formikAddImage.handleBlur}
                          value={formikAddImage.values.captions[index]}
                          onChange={(event) => handleCaptionChange(index, event.target.value)}
                          error={
                            !!(
                              formikAddImage.touched.captions &&
                              formikAddImage.errors.captions &&
                              formikAddImage.errors.captions[index]
                            )
                          }
                          helperText={
                            (formikAddImage.touched.captions &&
                              formikAddImage.errors.captions &&
                              formikAddImage.errors.captions[index]) ||
                            ""
                          }
                        />
                        <RadioGroup
                          aria-label="is_primarys"
                          name={`is_primarys[${index}]`}
                          value={formikAddImage.values.is_primarys[index]}
                          onChange={() => handleIsPrimaryChange(index)}
                        >
                          <FormControlLabel value={true} control={<Radio />} label="Ảnh đại diện" />
                        </RadioGroup>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ mx: 2 }}
                          onClick={() => handleRemoveImage(index)}
                        >
                          Xóa
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
                <Grid
                  item
                  xs={12}
                  sx={{
                    m: 2,
                    p: "0 !important",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddImage}
                    sx={{ mt: 2 }}
                  >
                    Thêm ảnh
                  </Button>
                  {formikAddImage.values.images.length > 0 && (
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mx: 2, mt: 2 }}
                      onClick={formikAddImage.handleSubmit}
                    >
                      Lưu ảnh
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Box>
          </>
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

      {isModalDeleteRoomImage && roomImageId && (
        <Dialog
          open={isModalDeleteRoomImage}
          onClose={handleCloseModalDeleteRoomImage}
          aria-labelledby="scroll-dialog-title-delete-room-image"
          aria-describedby="scroll-dialog-description-delete-room-image"
          maxWidth="md"
          PaperProps={{
            sx: {
              maxHeight: "40vh",
              height: "auto",
              minWidth: "40%",
            },
          }}
        >
          <DialogTitle
            id="scroll-dialog-title-delete-room-image"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1100,
              backgroundColor: "white",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            Xóa ảnh
          </DialogTitle>

          <DialogContent dividers>
            <Typography>Bạn có chắc muỗn xóa ảnh này không?</Typography>
          </DialogContent>

          <DialogActions sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              color="error"
              sx={{ mr: 2 }}
              onClick={handleDeleteRoomImage}
            >
              Xóa
            </Button>
            <Button variant="contained" color="inherit" onClick={handleCloseModalDeleteRoomImage}>
              Hủy
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  );
};

export default EditRoom;

EditRoom.propTypes = {
  isModalEditRoom: PropTypes.bool.isRequired,
  setIsModalEditRoom: PropTypes.func.isRequired,
  hotelId: PropTypes.number.isRequired,
  currentId: PropTypes.number.isRequired,
};
