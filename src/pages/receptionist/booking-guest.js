import { FC } from "react";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { useFormik } from "formik";
import * as Yup from "yup";
import Popover from "@mui/material/Popover";
import PersonIcon from "@mui/icons-material/Person";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { API, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import * as RoomService from "src/services/room-service";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import RoomTypeList from "src/sections/receptionist/room-type-list";
import calculateNumberOfNights from "src/utils/calculate-number-of-nights";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const Page = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [hotelData, setHotelData] = React.useState(null);
  const { hotel_id } = useSelector((state) => state.auth);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  const ageOptions = Array.from({ length: 17 }, (_, i) => i + 1);

  const formik = useFormik({
    initialValues: {
      checkIn: dayjs().add(1, "day"),
      checkOut: dayjs().add(2, "day"),
      numRooms: 1,
      numAdults: 1,
      numChildren: 0,
      childrenAges: [],
      submit: null,
    },
    validationSchema: Yup.object({
      // checkIn: Yup.date().min(dayjs().add(1, "day").required("Vui lòng chọn ngày đến!"),
      // checkOut: Yup.date()
      //   .required("Vui lòng chọn ngày về!")
      //   .min(dayjs().add(2, "day"), "Ngày về phải sau ngày đến ít nhất 1 ngày"),
      numAdults: Yup.number()
        .min(1, "Số lượng người lớn tối thiểu phải là 1!")
        .test({
          name: "roomCheck",
          message: "Số người lớn ở ít nhất phải bằng số phòng!",
          test: function (value) {
            const numRooms = this.parent.numRooms;
            return typeof value === "number" && value >= numRooms;
          },
        })
        .required("Vui lòng chọn số lượng người!"),
      numChildren: Yup.number()
        .min(0, "Số lượng người tối thiểu phải là 0!")
        .required("Vui lòng chọn số lượng trẻ em!"),
      numRooms: Yup.number()
        .min(1, "Số lượng phòng tối thiểu phải là 1!")
        .required("Vui lòng chọn số lượng phòng!"),
      childrenAges: Yup.array().of(
        Yup.number()
          .min(1, "Tuổi trẻ em phải từ 1 đến 17!")
          .max(17, "Tuổi trẻ em phải từ 1 đến 17!")
      ),
    }),

    onSubmit: async (values, helpers) => {
      try {
        dispatch(openLoadingApi());
        const { checkIn, checkOut, numAdults, numChildren, childrenAges, numRooms } = values;

        const formattedCheckIn = dayjs(checkIn).format("YYYY-MM-DD");
        const formattedCheckOut = dayjs(checkOut).format("YYYY-MM-DD");

        const response = await RoomService[API.ROOM_TYPE.GET_ALL_AVAILABLE_ROOM_TYPES_BY_HOTEL_ID]({
          check_in: formattedCheckIn,
          check_out: formattedCheckOut,
          num_adults: Number(numAdults),
          num_children: Number(numChildren),
          num_rooms: Number(numRooms),
          children_ages: childrenAges,
          hotel_id,
        });

        if (response?.status === STATUS_CODE.OK) {
          setHotelData(response.data);
        } else {
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        }
      } catch (err) {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        dispatch(closeLoadingApi());
      }
    },
  });

  const updateFieldValue = (field, newValue) => {
    formik.setFieldValue(field, newValue);
  };

  const handleSubAdult = () => {
    if (Number(formik.values.numAdults) > Number(formik.values.numRooms)) {
      updateFieldValue("numAdults", Number(formik.values.numAdults) - 1);
    } else if (Number(formik.values.numAdults) === Number(formik.values.numRooms)) {
      updateFieldValue("numAdults", Number(formik.values.numAdults) - 1);
      updateFieldValue("numRooms", Number(formik.values.numRooms) - 1);
    } else {
      return;
    }
  };

  const handleAddAdult = () => {
    if (Number(formik.values.numAdults) < 1) return;
    updateFieldValue("numAdults", Number(formik.values.numAdults) + 1);
  };

  const handleSubChildren = () => {
    if (formik.values.numChildren <= 0) return;
    updateFieldValue("numChildren", formik.values.numChildren - 1);
    updateFieldValue(
      "childrenAges",
      formik.values.childrenAges.slice(0, formik.values.numChildren - 1)
    );
  };

  const handleAddChildren = () => {
    updateFieldValue("numChildren", formik.values.numChildren + 1);
    updateFieldValue("childrenAges", [...formik.values.childrenAges, 1]);
  };

  const handleSubRoom = () => {
    if (Number(formik.values.numRooms) <= 1) {
      return;
    } else {
      updateFieldValue("numRooms", Number(formik.values.numRooms) - 1);
      if (formik.values.numAdults < Number(formik.values.numRooms)) {
        updateFieldValue("numAdults", Number(formik.values.numRooms));
      }
    }
  };

  const handleAddRoom = () => {
    if (Number(formik.values.numRooms) < 1) {
      return;
    } else {
      updateFieldValue("numRooms", Number(formik.values.numRooms) + 1);
      if (formik.values.numAdults <= Number(formik.values.numRooms)) {
        updateFieldValue("numAdults", Number(formik.values.numAdults) + 1);
      }
    }
  };

  const handleCheckInChange = (newValue) => {
    if (newValue) {
      updateFieldValue("checkIn", newValue);
      const minCheckOut = newValue.add(1, "day");
      if (formik.values.checkOut.isBefore(minCheckOut)) {
        updateFieldValue("checkOut", minCheckOut);
      }
    }
  };

  const handleCheckOutChange = (newValue) => {
    if (newValue) {
      updateFieldValue("checkOut", newValue);
    }
  };

  const handleChildrenAgeChange = (index, age) => {
    const updatedChildrenAges = [...formik.values.childrenAges];
    updatedChildrenAges[index] = age;
    updateFieldValue("childrenAges", updatedChildrenAges);
  };

  const numNights = calculateNumberOfNights(formik.values.checkIn, formik.values.checkOut);

  const customerRequest = {
    checkIn: formik.values.checkIn,
    checkOut: formik.values.checkOut,
    numAdults: formik.values.numAdults,
    numRooms: formik.values.numRooms,
    numChildren: formik.values.numChildren,
    childrenAges: formik.values.childrenAges,
    hotelId: hotel_id,
  };

  return (
    <>
      <Head>
        <title>Kiểm tra trạng thái phòng</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          px: 2,
        }}
      >
        <Typography variant="h4" mb={2}>
          Nhập thông tin đặt phòng
        </Typography>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              width: "100%",
              border: "4px solid #ffb700",
              bgcolor: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 2px 8px 0 rgba(26, 26, 26, 0.16)",
              borderRadius: "8px",
              padding: "4px",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Ngày đến"
                    name="checkIn"
                    format="DD/MM/YYYY"
                    sx={{
                      bgcolor: "background.paper",
                      width: "100%",
                      "&.MuiFormControl-root": {
                        borderRadius: 1,
                      },
                    }}
                    minDate={dayjs()}
                    value={formik.values.checkIn}
                    onChange={(newValue) => handleCheckInChange(newValue)}
                    slotProps={{
                      textField: {
                        error: formik.touched.checkIn && Boolean(formik.errors.checkIn),
                        helperText:
                          formik.touched.checkIn && typeof formik.errors.checkIn === "string"
                            ? formik.errors.checkIn
                            : "",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Ngày về"
                    name="checkOut"
                    format="DD/MM/YYYY"
                    sx={{
                      bgcolor: "background.paper",
                      width: "100%",
                      "&.MuiFormControl-root": {
                        borderRadius: 1,
                      },
                    }}
                    minDate={formik.values.checkIn.add(1, "day")}
                    value={formik.values.checkOut}
                    onChange={(newValue) => handleCheckOutChange(newValue)}
                    slotProps={{
                      textField: {
                        error: formik.touched.checkOut && Boolean(formik.errors.checkOut),
                        helperText:
                          formik.touched.checkOut && typeof formik.errors.checkOut === "string"
                            ? formik.errors.checkOut
                            : "",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={4}>
                <div>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={handleClick}
                    sx={{
                      bgcolor: "background.paper",
                      width: "100%",
                      boxShadow: 1,
                      p: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 28, color: "primary.main" }} />
                    <Stack direction="column" pl={1} alignItems="flex-start">
                      <Box display="flex" justifyContent="center" alignItems={"center"}>
                        <Typography
                          variant="h6"
                          color="textPrimary"
                          fontSize="16px"
                          fontWeight="600"
                        >
                          {formik.values.numAdults} người lớn
                        </Typography>
                        {formik.values.numChildren > 0 && (
                          <Typography
                            variant="h6"
                            color="textPrimary"
                            fontSize="16px"
                            fontWeight="600"
                          >
                            , {formik.values.numChildren} trẻ em
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {formik.values.numRooms} phòng
                      </Typography>
                    </Stack>
                  </Button>
                  {open && (
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{ width: "auto" }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="subtitle1" minWidth="100px">
                            Số người lớn
                          </Typography>
                          <IconButton
                            size="small"
                            sx={{
                              width: "28px",
                              height: "28px",
                              border: "1px solid",
                              color: formik.values.numAdults > 1 ? "primary.main" : "inherit",
                              borderColor: "rgb(168, 179, 203)",
                              borderRadius: "50%",
                              cursor: "pointer",
                              "&:hover": {
                                background: "rgb(237, 240, 249)",
                              },
                            }}
                            disabled={formik.values.numAdults <= 1}
                            onClick={handleSubAdult}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="h6">{formik.values.numAdults}</Typography>
                          <IconButton
                            size="small"
                            sx={{
                              width: "28px",
                              height: "28px",
                              color: "primary.main",
                              border: "1px solid",
                              borderColor: "rgb(168, 179, 203)",
                              borderRadius: "50%",
                              cursor: "pointer",
                              "&:hover": {
                                background: "rgb(237, 240, 249)",
                              },
                            }}
                            onClick={handleAddAdult}
                          >
                            <AddIcon />
                          </IconButton>
                        </Stack>

                        <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                          <Typography variant="subtitle1" minWidth="100px">
                            Số trẻ em
                          </Typography>
                          <IconButton
                            size="small"
                            sx={{
                              width: "28px",
                              height: "28px",
                              border: "1px solid",
                              color: formik.values.numChildren > 0 ? "primary.main" : "inherit",
                              borderColor: "rgb(168, 179, 203)",
                              borderRadius: "50%",
                              cursor: "pointer",
                              "&:hover": {
                                background: "rgb(237, 240, 249)",
                              },
                            }}
                            disabled={formik.values.numChildren <= 0}
                            onClick={handleSubChildren}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="h6">{formik.values.numChildren}</Typography>
                          <IconButton
                            size="small"
                            sx={{
                              width: "28px",
                              height: "28px",
                              color: "primary.main",
                              border: "1px solid",
                              borderColor: "rgb(168, 179, 203)",
                              borderRadius: "50%",
                              cursor: "pointer",
                              "&:hover": {
                                background: "rgb(237, 240, 249)",
                              },
                            }}
                            onClick={handleAddChildren}
                          >
                            <AddIcon />
                          </IconButton>
                        </Stack>

                        {formik.values.numChildren > 0 && (
                          <Box mt={2}>
                            {formik.values.childrenAges?.map((age, index) => (
                              <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                key={index}
                                mt={1}
                              >
                                <Typography variant="subtitle1" minWidth="100px">
                                  Tuổi trẻ {index + 1}
                                </Typography>
                                <FormControl fullWidth>
                                  <Select
                                    labelId={`age-select-label-${index}`}
                                    id={`age-select-${index}`}
                                    value={age}
                                    label="Age"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onChange={(e) =>
                                      handleChildrenAgeChange(index, Number(e.target.value))
                                    }
                                  >
                                    {ageOptions.map((option) => (
                                      <MenuItem key={option} value={option}>
                                        {option}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Stack>
                            ))}
                          </Box>
                        )}

                        <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                          <Typography variant="subtitle1" minWidth="100px">
                            Số phòng
                          </Typography>
                          <IconButton
                            size="small"
                            sx={{
                              width: "28px",
                              height: "28px",
                              color: formik.values.numRooms > 1 ? "primary.main" : "inherit",
                              border: "1px solid",
                              borderColor: "rgb(168, 179, 203)",
                              borderRadius: "50%",
                              cursor: "pointer",
                              "&:hover": {
                                background: "rgb(237, 240, 249)",
                              },
                            }}
                            disabled={formik.values.numRooms <= 1}
                            onClick={handleSubRoom}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="h6">{formik.values.numRooms}</Typography>
                          <IconButton
                            size="small"
                            sx={{
                              width: "28px",
                              height: "28px",
                              border: "1px solid",
                              color: "primary.main",
                              borderColor: "rgb(168, 179, 203)",
                              borderRadius: "50%",
                              cursor: "pointer",
                              "&:hover": {
                                background: "rgb(237, 240, 249)",
                              },
                            }}
                            onClick={handleAddRoom}
                          >
                            <AddIcon />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Popover>
                  )}
                </div>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    width: "100%",
                    minHeight: "32px",
                    textTransform: "uppercase",
                  }}
                  startIcon={<SearchIcon />}
                  aria-label="find hotel"
                >
                  Tìm
                </Button>
              </Grid>
            </Grid>
          </Box>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
        </form>

        {!hotelData ? (
          <Grid item xs={12}>
            <Box
              sx={{
                width: "100%",
                mt: 2,
                p: 2,
                borderRadius: 1,
                overflow: "hidden",
                boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.1)",
                bgcolor: "background.paper",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" color="primary">
                Hãy nhập thông tin tìm kiếm để kiểm tra những loại phòng nào có sẵn
              </Typography>
            </Box>
          </Grid>
        ) : hotelData.roomTypes?.length > 0 ? (
          <RoomTypeList
            hotelData={hotelData}
            roomTypes={hotelData.roomTypes}
            setRoomTypes={() => {}}
            numNights={numNights}
            customerRequest={customerRequest}
          />
        ) : (
          <Grid item xs={12}>
            <Box
              sx={{
                width: "100%",
                mt: 2,
                p: 2,
                borderRadius: 1,
                overflow: "hidden",
                boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.1)",
                bgcolor: "background.paper",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" color="primary">
                Rất tiếc, không còn loại phòng nào phù hợp
              </Typography>
            </Box>
          </Grid>
        )}
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
