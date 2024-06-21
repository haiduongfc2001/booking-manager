import { useEffect, useRef, useState } from "react";
import Head from "next/head";
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
  InputAdornment,
  ImageList,
  ImageListItem,
  Avatar,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SearchRoom } from "src/sections/manager/room/search-room";
import { HOTEL_ID_FAKE, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import * as RoomService from "src/services/room-service";
import { API } from "src/constant/constants";
import CreateRoom from "src/sections/manager/room/create-room";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import FormatNumber from "src/utils/format-number";
import { useRouter } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useDispatch } from "react-redux";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { neutral } from "src/theme/colors";
import { getInitials } from "src/utils/get-initials";
import { showCommonAlert } from "src/utils/toast-message";

const Page = () => {
  const [hotelId, setHotelId] = useState(HOTEL_ID_FAKE);
  const [roomTypesData, setRoomTypesData] = useState([]);
  const [numRoomTypes, setNumRoomTypes] = useState(0);

  const [isModalCreateRoom, setIsModalCreateRoom] = useState(false);
  const [expandedRoomTypeId, setExpandedRoomTypeId] = useState(null);

  const inputRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      dispatch(openLoadingApi());

      const response = await RoomService[API.ROOM_TYPE.GET_ALL_ROOM_TYPES_BY_HOTEL_ID]({
        hotel_id: hotelId,
      });

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setRoomTypesData(response.data.roomTypes);
        setNumRoomTypes(response.data.totalRoomTypes);
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

  const handleOpenModalCreate = () => {
    setIsModalCreateRoom(true);
  };

  const handleRoomTypeClick = (roomTypeId) => {
    router.push(`/manager/room-type/detail/${roomTypeId}`);
  };

  const handleToggleExpand = (roomTypeId) => {
    setExpandedRoomTypeId(expandedRoomTypeId === roomTypeId ? null : roomTypeId);
  };

  return (
    <>
      <Head>
        <title>Khuyến mãi</title>
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
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Danh sách khuyến mãi</Typography>
              </Stack>
            </Stack>

            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                pr: 2,
              }}
            >
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

            {roomTypesData?.length > 0 &&
              roomTypesData.map((roomType) => {
                return (
                  <Card key={roomType.id} sx={{ p: 2 }}>
                    <Stack
                      direction={"row"}
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          src={
                            roomType?.roomImages?.find((image) => image.is_primary)?.url ||
                            (roomType?.roomImages?.length > 0
                              ? roomType?.roomImages[0]?.url
                              : "/assets/no_image_available.png")
                          }
                          sx={{
                            bgcolor: neutral[300],
                            width: 64,
                            height: 64,
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                          }}
                          variant="rounded"
                        >
                          {getInitials(roomType?.name)}
                        </Avatar>
                        <Typography variant="h6">{roomType.name}</Typography>
                      </Stack>
                      <IconButton
                        onClick={() => handleToggleExpand(roomType.id)}
                        sx={{ color: "primary.main" }}
                      >
                        {expandedRoomTypeId === roomType.id ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </Stack>

                    <Stack
                      direction={"row"}
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                      mt={2}
                    >
                      <Button variant="contained" color="info" sx={{ width: "auto", mt: 1 }}>
                        Số phòng: {roomType?.totalRooms}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={
                          <SvgIcon fontSize="small">
                            <ArrowForwardIcon />
                          </SvgIcon>
                        }
                        onClick={() => handleRoomTypeClick(roomType.id)}
                      >
                        Xem chi tiết
                      </Button>
                    </Stack>

                    {expandedRoomTypeId === roomType.id && (
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
                                value={roomType.name}
                              />
                              <TextField
                                fullWidth
                                label="Giá phòng"
                                name="base_price"
                                type="text"
                                InputProps={{
                                  readOnly: true,
                                }}
                                value={FormatNumber(roomType.base_price)}
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
                                value={roomType.description}
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
                                value={roomType.standard_occupant}
                              />
                              <TextField
                                fullWidth
                                label="Số trẻ em thêm tối đa"
                                name="max_children"
                                type="text"
                                InputProps={{
                                  readOnly: true,
                                }}
                                value={roomType.max_children}
                              />
                              <TextField
                                fullWidth
                                label="Sức chứa tối đa"
                                name="max_occupant"
                                type="text"
                                InputProps={{
                                  readOnly: true,
                                }}
                                value={roomType.max_occupant}
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
                                value={roomType.views}
                              />
                              <TextField
                                fullWidth
                                label="Diện tích"
                                name="area"
                                type="text"
                                InputProps={{
                                  readOnly: true,
                                  endAdornment: (
                                    <InputAdornment position="end">m&sup2;</InputAdornment>
                                  ),
                                }}
                                value={roomType.area}
                              />
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  readOnly
                                  label="Ngày tạo"
                                  name="created_at"
                                  value={dayjs(roomType?.created_at)}
                                />
                              </LocalizationProvider>

                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  readOnly
                                  label="Ngày cập nhật gần nhất"
                                  name="updated_at"
                                  value={dayjs(roomType?.updated_at)}
                                />
                              </LocalizationProvider>
                            </Stack>
                          </Stack>

                          {roomType.images && roomType.images.length > 0 && (
                            <Box sx={{ width: "100%", height: "100%", overflowY: "scroll" }}>
                              <ImageList variant="masonry" cols={3} gap={8}>
                                {roomType.images.map((item) => (
                                  <ImageListItem key={item.id}>
                                    <img
                                      srcSet={item.url}
                                      src={item.url}
                                      alt={item.id}
                                      loading="lazy"
                                    />
                                  </ImageListItem>
                                ))}
                              </ImageList>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    )}
                  </Card>
                );
              })}
          </Stack>
        </Container>
      </Box>

      <CreateRoom
        isModalCreateRoom={isModalCreateRoom}
        setIsModalCreateRoom={setIsModalCreateRoom}
        hotelId={hotelId}
        onRefresh={fetchData}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
