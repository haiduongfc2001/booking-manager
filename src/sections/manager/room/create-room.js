import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
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
  Box,
  Grid,
  CardMedia,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as RoomService from "../../../services/room-service";
import { API, IMAGE, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";

const initialData = {
  number: "",
  type: "",
  price: "",
  discount: "",
  capacity: "",
  description: "",
  images: [],
  captions: [],
  is_primarys: [],
};

const imageSchema = Yup.object().shape({
  file: Yup.mixed()
    .required("Hình ảnh là bắt buộc")
    .test("fileSize", "Kích thước ảnh không được vượt quá 100KB", (value) => {
      return value && value.size <= IMAGE.MAX_FILE_SIZE;
    })
    .test("fileType", "Chỉ cho phép JPG và PNG", (value) => {
      return value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
});

const CreateRoom = (props) => {
  const { isModalCreateRoom, setIsModalCreateRoom, hotelId, onRefresh } = props;

  const dispatch = useDispatch();

  const handleCloseModalCreate = () => {
    setIsModalCreateRoom(false);
    formik.resetForm();
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
      if (selectedImages.length + formik.values.images.length > 5) {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, "Chỉ được thêm tối đa 5 ảnh!"));
        return;
      }

      // Directly update formik with concise spread syntax
      formik.setValues((prevValues) => ({
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
    formik.setValues((prevData) => {
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
    formik.setValues((prevData) => {
      const updatedCaptions = [...prevData.captions];
      updatedCaptions[index] = caption;

      return { ...prevData, captions: updatedCaptions };
    });
  };

  const handleIsPrimaryChange = (index) => {
    formik.setValues((prevData) => {
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

  const formik = useFormik({
    initialValues: {
      ...initialData,
      submit: null,
    },
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
      images: Yup.array()
        // .of(imageSchema)
        .max(IMAGE.MAX_NUMBER_OF_IMAGES, "Cho phép tối đa 5 hình ảnh!"),
      captions: Yup.array().of(Yup.string().required("Cần có chú thích cho ảnh!")),
      is_primarys: Yup.array().of(Yup.boolean()),
    }),

    onSubmit: async (values, helpers) => {
      const formData = new FormData();
      formData.append("number", values.number.trim());
      formData.append("type", values.type.trim());
      formData.append("price", Number(values.price.trim()));
      formData.append("discount", Number(values.discount.trim()));
      formData.append("capacity", Number(values.capacity.trim()));
      formData.append("description", values.description.trim());
      formData.append("status", "available");

      values.images.forEach((image, index) => {
        formData.append("images", image);
        formData.append("captions", values.captions[index]);
        formData.append("is_primarys", values.is_primarys[index]);
      });

      try {
        const response = await RoomService[API.ROOM.CREATE_ROOM]({ hotel_id: hotelId, formData });

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
      }
    },
    enableReinitialize: true,
    validateOnBlur: false,
  });

  const numberElementRef = useRef(null);
  useEffect(() => {
    if (isModalCreateRoom) {
      const { current: numberElement } = numberElementRef;
      if (numberElement !== null) {
        numberElement.focus();
      }
    }
  }, [isModalCreateRoom]);

  return (
    <Dialog
      open={isModalCreateRoom}
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
        Tạo phòng mới
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
                  label="Số phòng"
                  name="number"
                  type="text"
                  ref={numberElementRef}
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
            </Stack>
          </Stack>

          {/* Add images for room */}
          <Box
            sx={{
              my: 4,
              bgcolor: "background.default",
              width: "100%",
              borderRadius: 4,
            }}
          >
            <Grid container spacing={2} justifyContent="center">
              {formik.values.images.map((image, index) => (
                <Grid item xs={12} key={index} sx={{ pt: "0 !important", pl: "0 !important" }}>
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
                          marginBottom: 2,
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
                        onBlur={formik.handleBlur}
                        value={formik.values.captions[index]}
                        onChange={(event) => handleCaptionChange(index, event.target.value)}
                        error={
                          !!(
                            formik.touched.captions &&
                            formik.errors.captions &&
                            formik.errors.captions[index]
                          )
                        }
                        helperText={
                          (formik.touched.captions &&
                            formik.errors.captions &&
                            formik.errors.captions[index]) ||
                          ""
                        }
                      />
                      <RadioGroup
                        aria-label="is_primarys"
                        name={`is_primarys[${index}]`}
                        value={formik.values.is_primarys[index]}
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
                <Button variant="contained" color="primary" onClick={handleAddImage}>
                  Thêm ảnh
                </Button>
              </Grid>
            </Grid>
          </Box>

          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
        </form>
      </DialogContent>

      <DialogActions
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 1100,
          my: 3,
          mr: 3,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ mr: 2 }}
          onClick={formik.handleSubmit}
        >
          OK
        </Button>
        <Button variant="contained" color="inherit" onClick={handleCloseModalCreate}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoom;

CreateRoom.propTypes = {
  isModalCreateRoom: PropTypes.bool.isRequired,
  setIsModalCreateRoom: PropTypes.func.isRequired,
  hotelId: PropTypes.number.isRequired,
  onRefresh: PropTypes.func,
};
