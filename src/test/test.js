import { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { HOTEL_ID_FAKE, STATUS_CODE } from "src/constant/constants";
import * as RoomService from "src/services/room-service";
import { API } from "src/constant/constants";
import RoomTypeBeds from "src/sections/manager/room/bed/bed";

const Page = () => {
  const [hotelId, setHotelId] = useState(HOTEL_ID_FAKE);
  const [roomTypesData, setRoomTypesData] = useState([]);
  const [isEditBedMode, setIsEditBedMode] = useState(true);

  const fetchData = async () => {
    try {
      const response = await RoomService[API.ROOM.GET_ALL_ROOMS_BY_HOTEL_ID]({
        hotel_id: hotelId,
      });

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setRoomTypesData(response.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBed = (roomTypeId, newBed) => {
    setRoomTypesData((prevData) => {
      return prevData.map((roomType) => {
        if (roomType.id === roomTypeId) {
          return {
            ...roomType,
            beds: [...roomType.beds, newBed],
          };
        }
        return roomType;
      });
    });
  };

  return (
    <>
      {roomTypesData?.length > 0 &&
        roomTypesData.map((roomType) =>
          roomType?.beds?.length > 0 || isEditBedMode ? (
            <RoomTypeBeds
              isEditBedMode={isEditBedMode}
              setIsEditBedMode={setIsEditBedMode}
              roomTypeId={parseInt(roomType.id)}
              beds={roomType?.beds}
              onAddBed={handleAddBed}
            />
          ) : null
        )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
