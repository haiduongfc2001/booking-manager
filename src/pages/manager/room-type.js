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
import CreateRoomType from "src/sections/manager/room/create-room-type";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useDispatch } from "react-redux";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { neutral } from "src/theme/colors";
import { getInitials } from "src/utils/get-initials";
import { showCommonAlert } from "src/utils/toast-message";
import FormatCurrency from "src/utils/format-currency";
import DeleteRoomType from "src/sections/manager/room/delete-room-type";

const Page = () => {
  const [hotelId, setHotelId] = useState(HOTEL_ID_FAKE);
  const [roomTypeId, setRoomTypeId] = useState(null);
  const [roomTypesData, setRoomTypesData] = useState([]);
  const [numRoomTypes, setNumRoomTypes] = useState(0);

  const [isModalCreateRoomType, setIsModalCreateRoomType] = useState(false);
  const [expandedRoomTypeId, setExpandedRoomTypeId] = useState(null);
  const [confirmDeleteRoomType, setConfirmDeleteRoomType] = useState(false);

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
    setIsModalCreateRoomType(true);
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
        <title>Các loại phòng</title>
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
                <Typography variant="h4">Các loại phòng</Typography>
                {/* <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    }
                  >
                    Export
                  </Button>
                </Stack> */}
              </Stack>
            </Stack>
            <Card sx={{ p: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <SearchRoom />
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  color="success"
                  onClick={handleOpenModalCreate}
                >
                  Thêm
                </Button>
              </Stack>
            </Card>

            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pr: 2,
              }}
            >
              <Button variant="contained" color="info">
                Số loại phòng: {numRoomTypes}
              </Button>
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
              roomTypesData?.map((roomType) => {
                return (
                  <Card key={roomType?.id} sx={{ p: 2 }}>
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
                        <Typography variant="h6">{roomType?.name}</Typography>
                      </Stack>
                      <IconButton
                        onClick={() => handleToggleExpand(roomType?.id)}
                        sx={{ color: "primary.main" }}
                      >
                        {expandedRoomTypeId === roomType?.id ? (
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
                      <Stack spacing={2} direction="row">
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ width: "auto", mt: 1 }}
                          onClick={() => {
                            setConfirmDeleteRoomType(true);
                            setRoomTypeId(roomType?.id);
                          }}
                        >
                          Xóa
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          endIcon={
                            <SvgIcon fontSize="small">
                              <ArrowForwardIcon />
                            </SvgIcon>
                          }
                          onClick={() => handleRoomTypeClick(roomType?.id)}
                        >
                          Xem chi tiết
                        </Button>
                      </Stack>
                    </Stack>

                    {expandedRoomTypeId === roomType?.id && (
                      <Box>
                        <Stack spacing={3} sx={{ mt: 3 }}>
                          <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
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
                                value={roomType?.name}
                              />
                            </Stack>
                            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                              <TextField
                                fullWidth
                                label="Giá phòng"
                                name="base_price"
                                type="text"
                                InputProps={{
                                  readOnly: true,
                                  endAdornment: (
                                    <InputAdornment position="end">/đêm</InputAdornment>
                                  ),
                                }}
                                value={FormatCurrency(roomType?.base_price)}
                              />
                              <TextField
                                fullWidth
                                label="Bữa sáng"
                                name="free_breakfast"
                                type="text"
                                InputProps={{
                                  readOnly: true,
                                }}
                                value={
                                  roomType?.free_breakfast
                                    ? "Giá đã bao gồm bữa sáng"
                                    : "Giá chưa bao gồm bữa sáng"
                                }
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
                                value={roomType?.description}
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
                                value={roomType?.standard_occupant}
                              />
                              <TextField
                                fullWidth
                                label="Số trẻ em thêm tối đa"
                                name="max_children"
                                type="text"
                                InputProps={{
                                  readOnly: true,
                                }}
                                value={roomType?.max_children}
                              />
                              <TextField
                                fullWidth
                                label="Sức chứa tối đa"
                                name="max_occupant"
                                type="text"
                                InputProps={{
                                  readOnly: true,
                                }}
                                value={roomType?.max_occupant}
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
                                value={roomType?.views}
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
                                value={roomType?.area}
                              />
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  readOnly
                                  format="HH:mm:ss DD/MM/YYYY"
                                  sx={{ width: { xs: "100%", md: "50%" } }}
                                  label="Thời gian tạo"
                                  name="created_at"
                                  value={dayjs(roomType?.created_at)}
                                />
                              </LocalizationProvider>

                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  readOnly
                                  format="HH:mm:ss DD/MM/YYYY"
                                  sx={{ width: { xs: "100%", md: "50%" } }}
                                  label="Cập nhật gần nhất"
                                  name="updated_at"
                                  value={dayjs(roomType?.updated_at)}
                                />
                              </LocalizationProvider>
                            </Stack>
                          </Stack>

                          {roomType?.images && roomType?.images.length > 0 && (
                            <Box sx={{ width: "100%", height: "100%", overflowY: "scroll" }}>
                              <ImageList variant="masonry" cols={3} gap={8}>
                                {roomType?.images.map((item) => (
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

      <CreateRoomType
        isModalCreateRoomType={isModalCreateRoomType}
        setIsModalCreateRoomType={setIsModalCreateRoomType}
        hotelId={hotelId}
        onRefresh={fetchData}
      />

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
