import React, { useState } from "react";
import { Stack, Typography, TextField, Button } from "@mui/material";
import * as BedService from "src/services/room-service";
import { API, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const RoomTypeBeds = ({ roomTypeId, beds = [] }) => {
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updatableBeds, setUpdatableBeds] = useState(beds);
  const [newBed, setNewBed] = useState({
    room_type_id: roomTypeId,
    type: "",
    description: "",
    quantity: "",
  });
  const [isAdding, setIsAdding] = useState(beds.length === 0);

  const dispatch = useDispatch();

  const handleDeleteBed = async (bed_id) => {
    dispatch(openLoadingApi());
    try {
      const response = await BedService[API.ROOM_TYPE.BED.DELETE_BED]({ bed_id });

      if (response?.status === STATUS_CODE.OK) {
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        const updatedBeds = updatableBeds.filter((bed) => bed.id !== bed_id);
        setUpdatableBeds(updatedBeds);
        if (updatedBeds.length === 0) {
          setIsAdding(true);
        }
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

  const handleSaveChanges = async (bed_id) => {
    dispatch(openLoadingApi());
    const bedToUpdate = updatableBeds.find((bed) => bed.id === bed_id);

    try {
      const response = await BedService[API.ROOM_TYPE.BED.UPDATE_BED]({
        ...bedToUpdate,
        bed_id,
      });

      if (response?.status === STATUS_CODE.OK) {
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
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

  const handleChange = (id, field, value) => {
    setUpdatableBeds(
      updatableBeds.map((bed) => (bed.id === id ? { ...bed, [field]: value } : bed))
    );
  };

  const handleAddNewBed = async () => {
    dispatch(openLoadingApi());
    try {
      const response = await BedService[API.ROOM_TYPE.BED.CREATE_BED](newBed);
      if (response?.status === STATUS_CODE.CREATED) {
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        setUpdatableBeds([...updatableBeds, response.newBed]);
        setNewBed({ room_type_id: roomTypeId, type: "", description: "", quantity: "" });
        setIsAdding(false);
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

  const handleNewBedChange = (field, value) => {
    setNewBed({ ...newBed, [field]: value });
  };

  return (
    <Stack p={2} mt={2} bgcolor={"#f2f3f5"} borderRadius={"20px"}>
      <Typography variant="h6" py={2}>
        Các loại giường
      </Typography>

      {updatableBeds.length > 0 ? (
        <>
          {updatableBeds.map((bed) =>
            bed ? (
              <Stack key={bed.id} direction={{ xs: "column", sm: "row" }} spacing={3} my={2}>
                <TextField
                  fullWidth
                  label="Loại giường"
                  name="type"
                  type="text"
                  InputProps={{
                    readOnly: !isUpdateMode,
                  }}
                  value={bed.type}
                  onChange={(e) => handleChange(bed.id, "type", e.target.value)}
                  sx={{ flex: 1, bgcolor: "background.paper", borderRadius: 1 }}
                />
                <TextField
                  fullWidth
                  label="Mô tả"
                  name="description"
                  type="text"
                  InputProps={{
                    readOnly: !isUpdateMode,
                  }}
                  value={bed.description}
                  onChange={(e) => handleChange(bed.id, "description", e.target.value)}
                  sx={{ flex: 2, bgcolor: "background.paper", borderRadius: 1 }}
                />
                <TextField
                  fullWidth
                  label="Số lượng"
                  name="quantity"
                  type="text"
                  InputProps={{
                    readOnly: !isUpdateMode,
                  }}
                  value={bed.quantity}
                  onChange={(e) => handleChange(bed.id, "quantity", e.target.value)}
                  sx={{ flex: 1, bgcolor: "background.paper", borderRadius: 1 }}
                />

                {isUpdateMode && (
                  <Stack direction="row" spacing={2} display={"flex"} alignItems={"center"}>
                    <Button
                      size="small"
                      sx={{ height: 40 }}
                      variant="contained"
                      color="success"
                      onClick={() => handleSaveChanges(bed.id)}
                    >
                      Lưu thay đổi
                    </Button>
                    <Button
                      size="small"
                      sx={{ height: 40 }}
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteBed(bed.id)}
                    >
                      Xóa
                    </Button>
                  </Stack>
                )}
              </Stack>
            ) : null
          )}

          {isAdding && (
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} my={2}>
              <TextField
                fullWidth
                label="Loại giường"
                name="type"
                type="text"
                value={newBed.type}
                onChange={(e) => handleNewBedChange("type", e.target.value)}
                sx={{ flex: 1, bgcolor: "background.paper", borderRadius: 1 }}
              />
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                type="text"
                value={newBed.description}
                onChange={(e) => handleNewBedChange("description", e.target.value)}
                sx={{ flex: 2, bgcolor: "background.paper", borderRadius: 1 }}
              />
              <TextField
                fullWidth
                label="Số lượng"
                name="quantity"
                type="text"
                value={newBed.quantity}
                onChange={(e) => handleNewBedChange("quantity", e.target.value)}
                sx={{ flex: 1, bgcolor: "background.paper", borderRadius: 1 }}
              />
              <Stack direction="row" spacing={2} display={"flex"} alignItems={"center"}>
                <Button
                  size="small"
                  sx={{ height: 40 }}
                  variant="contained"
                  color="success"
                  onClick={handleAddNewBed}
                >
                  Tạo giường mới
                </Button>
                <Button
                  size="small"
                  sx={{ height: 40 }}
                  variant="contained"
                  color="inherit"
                  onClick={() => setIsAdding(false)}
                >
                  Hủy
                </Button>
              </Stack>
            </Stack>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{ display: "flex", justifyContent: "flex-end" }}
            spacing={3}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={() => {
                setIsAdding(false);
                setIsUpdateMode(!isUpdateMode);
              }}
            >
              {isUpdateMode ? "Hủy" : "Chỉnh sửa"}
            </Button>
            {!isAdding && (
              <Button
                variant="contained"
                color="success"
                sx={{ mr: 2 }}
                onClick={() => {
                  setIsUpdateMode(false);
                  setIsAdding(true);
                }}
              >
                Thêm giường
              </Button>
            )}
          </Stack>
        </>
      ) : (
        isAdding && (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} my={2}>
            <TextField
              fullWidth
              label="Loại giường"
              name="type"
              type="text"
              value={newBed.type}
              onChange={(e) => handleNewBedChange("type", e.target.value)}
              sx={{ flex: 1, bgcolor: "background.paper", borderRadius: 1 }}
            />
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              type="text"
              value={newBed.description}
              onChange={(e) => handleNewBedChange("description", e.target.value)}
              sx={{ flex: 2, bgcolor: "background.paper", borderRadius: 1 }}
            />
            <TextField
              fullWidth
              label="Số lượng"
              name="quantity"
              type="text"
              value={newBed.quantity}
              onChange={(e) => handleNewBedChange("quantity", e.target.value)}
              sx={{ flex: 1, bgcolor: "background.paper", borderRadius: 1 }}
            />
            <Stack direction="row" spacing={2} display={"flex"} alignItems={"center"}>
              <Button
                size="small"
                sx={{ height: 40 }}
                variant="contained"
                color="success"
                onClick={handleAddNewBed}
              >
                Tạo giường mới
              </Button>
              <Button
                size="small"
                sx={{ height: 40 }}
                variant="contained"
                color="inherit"
                onClick={() => setIsAdding(false)}
              >
                Hủy
              </Button>
            </Stack>
          </Stack>
        )
      )}
    </Stack>
  );
};

export default RoomTypeBeds;
