import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
  Card,
  Grid,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { RoomTable } from "src/sections/manager/room/room-table";
import { SearchRoom } from "src/sections/manager/room/search-room";
import { HOTEL_ID_FAKE, STATUS_CODE } from "src/constant/constants";
import * as RoomService from "src/services/room-service";
import { API } from "src/constant/constants";
import CreateRoom from "src/sections/manager/room/create-room";
import { roomData } from "src/components/data";
import { KeyboardArrowDown } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import LoadingData from "src/layouts/loading/loading-data";
import FormatNumber from "src/utils/format-number";
import DeleteRoomType from "src/sections/manager/room/delete-room-type";
import DeleteBed from "src/sections/manager/room/bed/delete-bed";
import RoomTypeBeds from "src/sections/manager/room/bed/bed";
import { useDispatch } from "react-redux";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const roomTypeId = params.roomTypeId;

  const [hotelId, setHotelId] = useState(HOTEL_ID_FAKE);
  const [roomTypeData, setRoomTypeData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteRoomType, setConfirmDeleteRoomType] = useState(false);

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      dispatch(openLoadingApi());

      const response = await RoomService[API.ROOM_TYPE.GET_ROOM_TYPE_BY_ID]({
        hotel_id: hotelId,
        room_type_id: roomTypeId,
      });

      if (response?.status === STATUS_CODE.OK) {
        setRoomTypeData(response.data);
      } else {
        // dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      // dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Chi tiết</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Grid container justifyContent="flex-end">
              <Grid item xs={3} sx={{ display: "flex", justifyContent: "inherit", pr: 2 }}>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <ArrowPathIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  color="secondary"
                  onClick={fetchData}
                >
                  Làm mới
                </Button>
              </Grid>
            </Grid>

            {roomTypeId && (
              <Card key={roomTypeData?.id} sx={{ p: 2 }}>
                <Stack
                  direction={"row"}
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h6">{roomTypeData?.name}</Typography>

                  <Button variant="contained" color="primary" sx={{ width: "auto", mt: 1 }}>
                    <Typography variant="body1">Số phòng: {roomTypeData?.totalRooms}</Typography>
                  </Button>
                </Stack>

                <Box>
                  <Stack spacing={3} sx={{ mt: 3 }}>
                    <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                        <TextField
                          // inputRef={inputRef}
                          // autoFocus
                          fullWidth
                          label="Tên loại phòng"
                          name="name"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={roomTypeData?.name}
                        />
                        <TextField
                          fullWidth
                          label="Giá phòng"
                          name="base_price"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={FormatNumber(roomTypeData?.base_price)}
                        />
                      </Stack>

                      <Stack direction="row" spacing={3}>
                        <TextField
                          fullWidth
                          multiline
                          label="Mô tả"
                          name="description"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          minRows={3}
                          maxRows={5}
                          value={roomTypeData?.description}
                        />
                      </Stack>

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                        <TextField
                          fullWidth
                          label="Số người tiêu chuẩn"
                          name="standard_occupant"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={roomTypeData?.standard_occupant}
                        />
                        <TextField
                          fullWidth
                          label="Số trẻ em thêm tối đa"
                          name="max_children"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={roomTypeData?.max_children}
                        />
                        <TextField
                          fullWidth
                          label="Sức chứa tối đa"
                          name="max_occupant"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={roomTypeData?.max_occupant}
                        />
                      </Stack>

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                        <TextField
                          fullWidth
                          label="Hướng nhìn"
                          name="views"
                          type="text"
                          InputProps={{
                            readOnly: true,
                          }}
                          value={roomTypeData?.views}
                        />
                        <TextField
                          fullWidth
                          label="Diện tích"
                          name="area"
                          type="text"
                          InputProps={{
                            readOnly: true,
                            endAdornment: <InputAdornment position="end">m&sup2;</InputAdornment>,
                          }}
                          value={roomTypeData?.area}
                        />
                      </Stack>

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            readOnly
                            label="Ngày tạo"
                            name="created_at"
                            value={dayjs(roomTypeData?.created_at)}
                          />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            readOnly
                            label="Ngày cập nhật gần nhất"
                            name="updated_at"
                            value={dayjs(roomTypeData?.updated_at)}
                          />
                        </LocalizationProvider>
                      </Stack>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                        spacing={3}
                      >
                        <Button
                          variant="contained"
                          sx={{ mr: 2 }}
                          onClick={() => setIsEditing(true)}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ mr: 2 }}
                          onClick={() => {
                            setConfirmDeleteRoomType(true);
                            setCurrentRoomTypeId(roomTypeData?.id);
                          }}
                        >
                          Xóa
                        </Button>
                      </Stack>
                    </Stack>

                    {roomTypeData?.images && roomTypeData?.images.length > 0 && (
                      <Box sx={{ width: "100%", height: "100%", overflowY: "scroll" }}>
                        <ImageList variant="masonry" cols={3} gap={8}>
                          {roomTypeData?.images.map((item) => (
                            <ImageListItem key={item.id}>
                              <img srcSet={item.url} src={item.url} alt={item.id} loading="lazy" />
                            </ImageListItem>
                          ))}
                        </ImageList>
                      </Box>
                    )}
                  </Stack>
                </Box>

                <RoomTypeBeds roomTypeId={parseInt(roomTypeData?.id)} beds={roomTypeData?.beds} />

                <Stack p={2}>
                  <Typography variant="h6" py={2}>
                    Các phòng thuộc loại phòng {roomTypeData?.name}
                  </Typography>
                  <RoomTable
                    hotelId={hotelId}
                    roomTypeId={roomTypeData?.id}
                    items={roomTypeData?.rooms}
                    // loading={loading}
                    onRefresh={fetchData}
                  />
                </Stack>
              </Card>
            )}
          </Stack>
        </Container>
      </Box>

      <DeleteRoomType
        confirmDeleteRoomType={confirmDeleteRoomType}
        setConfirmDeleteRoomType={setConfirmDeleteRoomType}
        hotelId={parseInt(hotelId)}
        currentId={parseInt(roomTypeId)}
        onRefresh={fetchData}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
