import React, { useState } from "react";
import { Stack, Typography, TextField, Button, Chip } from "@mui/material";
import * as AmenityService from "src/services/room-service";
import { API, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const RoomTypeAmenities = ({ roomTypeId, amenities = [] }) => {
  const [updatableAmenities, setUpdatableAmenities] = useState(amenities);
  const [newAmenity, setNewAmenity] = useState({
    room_type_id: roomTypeId,
    amenity: "",
  });

  const dispatch = useDispatch();

  const handleDeleteAmenity = async (amenity_id) => {
    dispatch(openLoadingApi());
    try {
      const response = await AmenityService[API.ROOM_TYPE.AMENITY.DELETE_AMENITY]({
        room_type_id: roomTypeId,
        amenity_id,
      });

      if (response?.status === STATUS_CODE.OK) {
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        setUpdatableAmenities(updatableAmenities.filter((amenity) => amenity.id !== amenity_id));
      } else {
        const errorMessage =
          typeof response.data.error === "string"
            ? response.data.error
            : JSON.stringify(response.data.error);
        dispatch(showCommonAlert(TOAST_KIND.ERROR, errorMessage));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  const handleAddNewAmenity = async () => {
    dispatch(openLoadingApi());
    try {
      const response = await AmenityService[API.ROOM_TYPE.AMENITY.CREATE_AMENITY](newAmenity);
      if (response?.status === STATUS_CODE.CREATED) {
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        setUpdatableAmenities([...updatableAmenities, response.data]);
        setNewAmenity({ room_type_id: roomTypeId, amenity: "" });
      } else {
        const errorMessage =
          typeof response.data.error === "string"
            ? response.data.error
            : JSON.stringify(response.data.error);
        dispatch(showCommonAlert(TOAST_KIND.ERROR, errorMessage));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  const handleNewAmenityChange = (field, value) => {
    setNewAmenity({ ...newAmenity, [field]: value });
  };

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter" && newAmenity?.amenity?.trim() !== "") {
      handleAddNewAmenity();
    }
  };

  return (
    <Stack p={2} mt={2} bgcolor={"#f2f3f5"} borderRadius={"20px"}>
      <Typography variant="h6" py={2}>
        Các loại tiện nghi
      </Typography>

      <Stack direction="row" flexWrap="wrap" spacing={1} my={2}>
        {updatableAmenities.map((amenity) => (
          <Chip
            key={amenity.id}
            label={amenity.amenity}
            onDelete={() => handleDeleteAmenity(amenity.id)}
            variant="filled"
            color="info"
            sx={{ mb: 1 }}
          />
        ))}
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={3} my={2}>
        <TextField
          fullWidth
          label="Thêm tiện nghi mới"
          name="amenity"
          type="text"
          value={newAmenity.amenity}
          onChange={(e) => handleNewAmenityChange("amenity", e.target.value)}
          onKeyDown={handleInputKeyPress}
          sx={{
            flex: 0.5,
            bgcolor: "background.paper",
            borderRadius: 1,
          }}
        />
        <Button
          size="small"
          sx={{ height: 40 }}
          variant="contained"
          color="success"
          onClick={handleAddNewAmenity}
        >
          Thêm
        </Button>
      </Stack>
    </Stack>
  );
};

export default RoomTypeAmenities;
