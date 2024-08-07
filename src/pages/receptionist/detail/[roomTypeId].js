import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
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
  ImageListItemBar,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { RoomTable } from "src/sections/manager/room/room-table";
import { STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import * as RoomService from "src/services/room-service";
import { API } from "src/constant/constants";
import CreateRoom from "src/sections/manager/room/create-room";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import DeleteRoomType from "src/sections/manager/room/delete-room-type";
import RoomTypeBeds from "src/sections/manager/room/bed/bed";
import { useDispatch, useSelector } from "react-redux";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { neutral } from "src/theme/colors";
import { getInitials } from "src/utils/get-initials";
import ImageIcon from "@mui/icons-material/Image";
import UpdateRoomTypeImage from "src/sections/manager/room/update-room-type-image";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Image from "next/image";
import { showCommonAlert } from "src/utils/toast-message";
import UpdateRoomType from "src/sections/manager/room/update-room-type";
import RoomTypeAmenities from "src/sections/manager/room/room-type-amenity/room-type-amenity";
import RoomTypePromotions from "src/sections/manager/room/promotion/promotion";
import FormatCurrency from "src/utils/format-currency";

const Page = () => {
  const [roomTypeData, setRoomTypeData] = useState({});
  const [isModalUpdateRoomType, setIsModalUpdateRoomType] = useState(false);
  const [confirmDeleteRoomType, setConfirmDeleteRoomType] = useState(false);
  const [openPopupAddImages, setOpenPopupAddImages] = useState(false);
  const [isModalCreateRoom, setIsModalCreateRoom] = useState(false);

  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const listRoomsRef = useRef(null);
  const roomTypeId = params.roomTypeId;
  const hotel_id = useSelector((state) => state.auth.hotel_id);

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      dispatch(openLoadingApi());

      const response = await RoomService[API.ROOM_TYPE.GET_ROOM_TYPE_BY_ID]({
        hotel_id,
        room_type_id: roomTypeId,
      });

      if (response?.status === STATUS_CODE.OK) {
        setRoomTypeData(response.data);
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

  const scrollToListRooms = () => {
    const offset = 64;
    const elementPosition = listRoomsRef.current?.offsetTop;
    const offsetPosition = elementPosition - offset;

    if (typeof window !== "undefined") {
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleOpenModalCreate = () => {
    setIsModalCreateRoom(true);
  };

  return (
    <>
      <Head>
        <title>Chi tiết loại phòng</title>
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
            <Stack
              direction="row"
              spacing={3}
              sx={{ display: "flex", justifyContent: "space-between", pr: 2 }}
            >
              <Button
                startIcon={
                  <SvgIcon fontSize="small">
                    <ArrowLeftIcon />
                  </SvgIcon>
                }
                variant="contained"
                color="inherit"
                onClick={() => router.push("/manager/room-type")}
              >
                Quay lại
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
            </Stack>

            {roomTypeId && (
              <Card key={roomTypeData?.id} sx={{ p: 2 }}>
                <Stack
                  direction={"row"}
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6">{roomTypeData?.name}</Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: "auto", mt: 1 }}
                    onClick={() => scrollToListRooms()}
                  >
                    <Typography variant="body1">Số phòng: {roomTypeData?.totalRooms}</Typography>
                  </Button>
                </Stack>

                <Box
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "center", sm: "flex-start" }}
                  p={2}
                  mt={2}
                  bgcolor={"#f2f3f5"}
                  borderRadius={"20px"}
                  sx={{
                    "& .MuiFormControl-root": {
                      bgcolor: "background.paper",
                      borderRadius: 1,
                    },
                  }}
                >
                  <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ width: "100%" }}>
                    <Stack
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                      spacing={3}
                      sx={{ width: "calc(100% / 3)", height: "100%" }}
                    >
                      <Avatar
                        src={
                          roomTypeData?.roomImages?.find((image) => image.is_primary)?.url ||
                          (roomTypeData?.roomImages?.length > 0
                            ? roomTypeData?.roomImages[0]?.url
                            : "/assets/no_image_available.png")
                        }
                        sx={{
                          bgcolor: neutral[300],
                          width: "100%",
                          height: "100%",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                        variant="rounded"
                      >
                        {getInitials(roomTypeData?.name)}
                      </Avatar>
                      {roomTypeData?.roomImages?.length <= 0 && (
                        <Button
                          variant="contained"
                          color="success"
                          endIcon={<ImageIcon />}
                          onClick={() => setOpenPopupAddImages(true)}
                        >
                          Thêm ảnh
                        </Button>
                      )}
                    </Stack>

                    <Stack spacing={3} direction="column">
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
                          value={roomTypeData?.name}
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
                            endAdornment: <InputAdornment position="end">/đêm</InputAdornment>,
                          }}
                          value={FormatCurrency(roomTypeData?.base_price)}
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
                            roomTypeData?.free_breakfast
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
                            format="HH:mm:ss DD/MM/YYYY"
                            sx={{ width: { xs: "100%", md: "50%" } }}
                            label="Thời gian tạo"
                            name="created_at"
                            value={dayjs(roomTypeData?.created_at)}
                          />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            readOnly
                            format="HH:mm:ss DD/MM/YYYY"
                            sx={{ width: { xs: "100%", md: "50%" } }}
                            label="Cập nhật gần nhất"
                            name="updated_at"
                            value={dayjs(roomTypeData?.updated_at)}
                          />
                        </LocalizationProvider>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack spacing={3} sx={{ mt: 3, width: "100%" }}>
                    <Stack direction="column" spacing={3} sx={{ width: "100%" }}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                        spacing={3}
                      >
                        <Button
                          variant="contained"
                          sx={{ mr: 2 }}
                          onClick={() => setIsModalUpdateRoomType(true)}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ mr: 2 }}
                          onClick={() => {
                            setConfirmDeleteRoomType(true);
                          }}
                        >
                          Xóa
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                </Box>

                {roomTypeData?.roomImages && roomTypeData?.roomImages.length > 0 && (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      overflowY: "auto",
                      maxHeight: 460,
                    }}
                  >
                    <ImageList variant="quilted" cols={4} gap={8} rowHeight={160}>
                      {roomTypeData?.roomImages.map((image, index) => (
                        <ImageListItem
                          key={image.id}
                          cols={index === 0 ? 2 : 1}
                          rows={index === 0 ? 2 : 1}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              position: "relative",
                            }}
                          >
                            <Image
                              fill
                              priority
                              // loading="lazy"
                              // loader={() => image.url}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              src={image.url}
                              alt={image.caption}
                              style={{
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <ImageListItemBar
                            sx={{
                              background:
                                "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                                "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                            }}
                            title={image.caption}
                            position="bottom"
                            actionIcon={
                              <IconButton
                                sx={{ color: "white" }}
                                aria-label={`star ${image.caption}`}
                              >
                                <StarBorderIcon />
                              </IconButton>
                            }
                            actionPosition="left"
                          />
                        </ImageListItem>
                      ))}
                    </ImageList>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<ImageIcon />}
                        onClick={() => setOpenPopupAddImages(true)}
                      >
                        Sửa đổi ảnh
                      </Button>
                    </Box>
                  </Box>
                )}

                <RoomTypeBeds roomTypeId={parseInt(roomTypeData?.id)} beds={roomTypeData?.beds} />

                <Stack p={2}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h6" py={2} ref={listRoomsRef}>
                      Các phòng thuộc loại phòng {roomTypeData?.name}
                    </Typography>
                    <Button
                      startIcon={
                        <SvgIcon fontSize="small">
                          <PlusIcon />
                        </SvgIcon>
                      }
                      variant="contained"
                      color="success"
                      sx={{ mb: { xs: 2 } }}
                      onClick={handleOpenModalCreate}
                    >
                      Thêm phòng mới
                    </Button>
                  </Stack>
                  <RoomTable
                    hotelId={hotel_id}
                    roomTypeId={roomTypeData?.id}
                    items={roomTypeData?.rooms}
                    // loading={loading}
                    onRefresh={fetchData}
                  />
                </Stack>

                <RoomTypeAmenities
                  roomTypeId={parseInt(roomTypeData?.id)}
                  amenities={roomTypeData?.roomTypeAmenities}
                />

                <RoomTypePromotions
                  roomTypeId={parseInt(roomTypeData?.id)}
                  roomTypeData={roomTypeData}
                />
              </Card>
            )}
          </Stack>
        </Container>
      </Box>

      {roomTypeData?.id && isModalUpdateRoomType && (
        <UpdateRoomType
          isModalUpdateRoomType={isModalUpdateRoomType}
          setIsModalUpdateRoomType={setIsModalUpdateRoomType}
          roomTypeData={roomTypeData}
          onRefresh={fetchData}
        />
      )}

      <DeleteRoomType
        confirmDeleteRoomType={confirmDeleteRoomType}
        setConfirmDeleteRoomType={setConfirmDeleteRoomType}
        hotelId={parseInt(hotel_id)}
        currentId={parseInt(roomTypeId)}
      />

      {openPopupAddImages && roomTypeData && (
        <UpdateRoomTypeImage
          onRefresh={fetchData}
          openPopupAddImages={openPopupAddImages}
          setOpenPopupAddImages={setOpenPopupAddImages}
          roomTypeData={roomTypeData}
          roomTypeId={roomTypeData?.id}
        />
      )}

      {roomTypeData?.id && (
        <CreateRoom
          isModalCreateRoom={isModalCreateRoom}
          setIsModalCreateRoom={setIsModalCreateRoom}
          roomTypeId={roomTypeData?.id}
          onRefresh={fetchData}
        />
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
