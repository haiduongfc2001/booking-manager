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
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SearchRoom } from "src/sections/manager/room/search-room";
import { HOTEL_ID_FAKE, STATUS_CODE } from "src/constant/constants";
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

const Page = () => {
  const [hotelId, setHotelId] = useState(HOTEL_ID_FAKE);
  const [roomTypesData, setRoomTypesData] = useState([]);

  const [isModalCreateRoom, setIsModalCreateRoom] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

      const response = await RoomService[API.ROOM.GET_ALL_ROOMS_BY_HOTEL_ID]({
        hotel_id: hotelId,
      });

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setRoomTypesData(response.data);
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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleOpenModalCreate = () => {
    setIsModalCreateRoom(true);
  };

  const handleRoomTypeClick = (roomTypeId) => {
    router.push(`/manager/room-type/detail/${roomTypeId}`);
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Head>
        <title>Room</title>
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
                      <Typography variant="h6">{roomType.name}</Typography>
                      <IconButton onClick={handleToggleExpand} sx={{ color: "primary.main" }}>
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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
                        <Typography variant="body1">Số phòng: {roomType?.totalRooms}</Typography>
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

                    {expanded && (
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
