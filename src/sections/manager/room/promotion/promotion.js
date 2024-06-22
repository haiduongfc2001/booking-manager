import React, { useEffect, useState } from "react";
import { Stack, Typography, Button, SvgIcon, Tooltip } from "@mui/material";
import * as RoomService from "src/services/room-service";
import { API, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { PromotionTable } from "./promotion-table";
import CreatePromotion from "./create-promotion";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";

const RoomTypePromotions = ({ roomTypeId, roomTypeData }) => {
  const [promotionsData, setPromotionsData] = useState([]);
  const [isModalCreatePromotion, setIsModalCreatePromotion] = useState(false);

  const dispatch = useDispatch();

  const handleOpenModalCreate = () => {
    setIsModalCreatePromotion(true);
  };

  const fetchData = async () => {
    if (!roomTypeId) return;

    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      dispatch(openLoadingApi());

      const response = await RoomService[
        API.ROOM_TYPE.PROMOTION.GET_ALL_PROMOTIONS_BY_ROOM_TYPE_ID
      ]({
        room_type_id: roomTypeId,
      });

      if (response?.status === STATUS_CODE.OK) {
        setPromotionsData(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Stack p={2}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6" py={2}>
          Danh sách các khuyến mãi
        </Typography>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Làm mới">
            <Button variant="contained" color="secondary" onClick={fetchData}>
              <SvgIcon fontSize="small">
                <ArrowPathIcon />
              </SvgIcon>
            </Button>
          </Tooltip>
          <Tooltip title="Thêm khuyến mãi mới">
            <Button variant="contained" color="success" onClick={handleOpenModalCreate}>
              <SvgIcon fontSize="small">
                <PlusIcon />
              </SvgIcon>
            </Button>
          </Tooltip>
        </Stack>
      </Stack>

      <PromotionTable
        roomTypeData={roomTypeData}
        roomTypeId={roomTypeId}
        items={promotionsData}
        onRefresh={fetchData}
      />

      <CreatePromotion
        isModalCreatePromotion={isModalCreatePromotion}
        setIsModalCreatePromotion={setIsModalCreatePromotion}
        roomTypeId={roomTypeId}
        roomTypeData={roomTypeData}
        onRefresh={fetchData}
      />
    </Stack>
  );
};

export default RoomTypePromotions;
