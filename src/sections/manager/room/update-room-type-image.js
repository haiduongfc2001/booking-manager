import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Grid,
  CardMedia,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API, IMAGE, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import * as RoomService from "src/services/room-service";
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";

const UpdateRoomTypeImage = (props) => {
  const { roomTypeData, roomTypeId, onRefresh, openPopupAddImages, setOpenPopupAddImages } = props;
  const [roomTypeImageId, setRoomTypeImageId] = useState("");
  const [selectedRoomTypeImage, setSelectedRoomTypeImage] = useState(null);
  const [isModalDeleteRoomTypeImage, setIsModalDeleteRoomTypeImage] = useState(false);

  const dispatch = useDispatch();

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
        selectedImages.length +
          formikAddImage.values.images.length +
          roomTypeData?.roomImages?.length >
        5
      ) {
        const images = 5 - roomTypeData?.roomImages.length;
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

  const handleOpenModalDeleteRoomTypeImage = (image_id) => {
    setRoomTypeImageId(image_id);
    setIsModalDeleteRoomTypeImage(true);
  };

  const handleCloseModalDeleteRoomTypeImage = () => {
    setRoomTypeImageId("");
    setIsModalDeleteRoomTypeImage(false);
  };

  const handleDeleteRoomTypeImage = async () => {
    try {
      const response = await RoomService[API.ROOM_TYPE.DELETE_ROOM_TYPE_IMAGE_BY_ID]({
        room_type_id: String(roomTypeId).trim(),
        room_type_image_id: String(roomTypeImageId).trim(),
      });

      if (response?.status === STATUS_CODE.OK) {
        onRefresh();
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      handleCloseModalDeleteRoomTypeImage();
    }
  };

  const handleUpdateRoomTypeImageImage = (image) => {
    setSelectedRoomTypeImage(image);
  };

  const formikUpdateImage = useFormik({
    initialValues: {
      caption: selectedRoomTypeImage ? selectedRoomTypeImage.caption : "",
      is_primary: selectedRoomTypeImage ? selectedRoomTypeImage.is_primary : false,
    },
    validationSchema: Yup.object({
      caption: Yup.string().required("Cần có chú thích cho ảnh!"),
      is_primary: Yup.boolean(),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const response = await RoomService[API.ROOM_TYPE.UPDATE_ROOM_TYPE_IMAGE_BY_ID]({
          room_type_id: String(roomTypeId).trim(),
          room_type_image_id: String(selectedRoomTypeImage.id).trim(),
          caption: values.caption,
          is_primary: values.is_primary,
        });

        if (response?.status === STATUS_CODE.OK) {
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

  const handleCancelUpdate = () => {
    setSelectedRoomTypeImage(null);
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
        IMAGE.MAX_NUMBER_OF_IMAGES - roomTypeData?.roomImages?.length,
        `Cho phép tối đa ${IMAGE.MAX_NUMBER_OF_IMAGES - roomTypeData?.roomImages?.length} hình ảnh!`
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
        const response = await RoomService[API.ROOM_TYPE.CREATE_ROOM_TYPE_IMAGES]({
          hotel_id: String(roomTypeData?.hotel_id).trim(),
          room_type_id: String(roomTypeId).trim(),
          formData,
        });

        if (response?.status === STATUS_CODE.CREATED) {
          formikAddImage.resetForm();
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

  const handleClosePopupAddImages = () => {
    setOpenPopupAddImages(false);
  };

  return (
    <Dialog
      open={openPopupAddImages}
      onClose={handleClosePopupAddImages}
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
      <DialogTitle id="scroll-dialog-title">Chỉnh sửa thông tin ảnh</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            my: 4,
            bgcolor: "background.default",
            width: "100%",
            borderRadius: 4,
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            {roomTypeData?.roomImages?.map((image, index) => (
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

                    {selectedRoomTypeImage === image ? (
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
                              formikUpdateImage.touched.caption && formikUpdateImage.errors.caption
                            )
                          }
                          helperText={
                            formikUpdateImage.touched.caption && formikUpdateImage.errors.caption
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
                          <FormControlLabel value={true} control={<Radio />} label="Ảnh đại diện" />
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
                          onClick={handleCancelUpdate}
                        >
                          Hủy
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleUpdateRoomTypeImageImage(image)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ mx: 2 }}
                          onClick={() => handleOpenModalDeleteRoomTypeImage(image.id)}
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
              <Button variant="contained" color="primary" onClick={handleAddImage} sx={{ mt: 2 }}>
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

          {isModalDeleteRoomTypeImage && roomTypeImageId && (
            <Dialog
              open={isModalDeleteRoomTypeImage}
              onClose={handleCloseModalDeleteRoomTypeImage}
              aria-labelledby="scroll-dialog-title-delete-room-type-image"
              aria-describedby="scroll-dialog-description-delete-room-type-image"
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
                id="scroll-dialog-title-delete-room-type-image"
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
                  onClick={handleDeleteRoomTypeImage}
                >
                  Xóa
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={handleCloseModalDeleteRoomTypeImage}
                >
                  Hủy
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, m: 2 }}>
        <Button autoFocus variant="contained" color="inherit" onClick={handleClosePopupAddImages}>
          Đóng
        </Button>
        {/* <Button variant="contained" color="success" onClick={handleClosePopupAddImages}>
          Lưu thay đổi
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default UpdateRoomTypeImage;

UpdateRoomTypeImage.propTypes = {
  roomTypeData: PropTypes.object.isRequired,
  roomTypeId: PropTypes.number.isRequired,
};
