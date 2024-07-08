import React, { useEffect, useState, useRef } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Box,
  Container,
  SvgIcon,
  Card,
  Alert,
  InputAdornment,
} from "@mui/material";
import * as HotelService from "src/services/hotel-service";
import { API, POLICY, STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import { useDispatch, useSelector } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import Head from "next/head";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import MandatoryPolicyDialog from "src/sections/manager/hotel/policy/mandatory-policy-dialog";
import { LocalizationProvider, TimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const mandatoryPolicies = [
  POLICY.CHECK_IN_TIME,
  POLICY.CHECK_OUT_TIME,
  POLICY.TAX,
  POLICY.SERVICE_FEE,
  POLICY.SURCHARGE_RATES,
];

// Đối tượng ánh xạ giữa các giá trị type và tên hiển thị
const policyTypeLabels = {
  CHECK_IN_TIME: "Thời gian nhận phòng",
  CHECK_OUT_TIME: "Thời gian trả phòng",
  TAX: "Thuế",
  SERVICE_FEE: "Phí dịch vụ",
  SURCHARGE_RATES: "Phụ thu",
};

// Hàm để chuyển đổi chuỗi thời gian "HH:mm" thành đối tượng dayjs
const timeStringToDayjs = (timeString) => {
  return dayjs(timeString, "HH:mm");
};

// Hàm để chuyển đổi đối tượng dayjs thành chuỗi thời gian "HH:mm"
const dayjsToTimeString = (date) => {
  return date.format("HH:mm");
};

const Page = () => {
  const [policiesData, setPoliciesData] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updatablePolicies, setUpdatablePolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({
    hotel_id: null,
    type: "",
    value: "",
    description: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [showMandatoryPolicyDialog, setShowMandatoryPolicyDialog] = useState(false);

  const dispatch = useDispatch();
  const fetchDataRef = useRef(false);
  const hotel_id = useSelector((state) => state.auth.hotel_id);

  const fetchData = async () => {
    if (fetchDataRef.current) return;

    fetchDataRef.current = true;
    try {
      dispatch(openLoadingApi());

      const response = await HotelService[API.HOTEL.POLICY.GET_ALL_POLICIES_BY_HOTEL_ID]({
        hotel_id,
      });

      if (response?.status === STATUS_CODE.OK) {
        setPoliciesData(response.data);
        setUpdatablePolicies(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
      fetchDataRef.current = false;
      setIsUpdateMode(false);
    }
  };

  useEffect(() => {
    if (hotel_id) {
      fetchData();
    }
    return () => {
      fetchDataRef.current = false;
    };
  }, []);

  const handleDeletePolicy = async (policy_id) => {
    dispatch(openLoadingApi());
    try {
      const policyToDelete = updatablePolicies.find((policy) => policy.id === policy_id);
      if (mandatoryPolicies.includes(policyToDelete.type)) {
        dispatch(
          showCommonAlert(TOAST_KIND.ERROR, "Không thể xóa chính sách bắt buộc đã được tạo.")
        );
      } else {
        const response = await HotelService[API.HOTEL.POLICY.DELETE_POLICY]({
          hotel_id,
          policy_id,
        });

        if (response?.status === STATUS_CODE.OK) {
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
          setUpdatablePolicies(updatablePolicies.filter((policy) => policy.id !== policy_id));
        } else {
          const errorMessage =
            typeof response.data.error === "string"
              ? response.data.error
              : JSON.stringify(response.data.error);
          dispatch(showCommonAlert(TOAST_KIND.ERROR, errorMessage));
        }
      }
    } catch (error) {
      dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  const handleSaveChanges = async (policy_id) => {
    dispatch(openLoadingApi());
    const policyToUpdate = updatablePolicies.find((policy) => policy.id === policy_id);

    try {
      const response = await HotelService[API.HOTEL.POLICY.UPDATE_POLICY]({
        ...policyToUpdate,
        policy_id,
      });

      if (response?.status === STATUS_CODE.OK) {
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        fetchData(); // Refresh data after saving changes
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
    setUpdatablePolicies(
      updatablePolicies.map((policy) => (policy.id === id ? { ...policy, [field]: value } : policy))
    );
  };

  const handleAddNewPolicy = async () => {
    dispatch(openLoadingApi());
    try {
      const response = await HotelService[API.HOTEL.POLICY.CREATE_POLICY](newPolicy);
      if (response?.status === STATUS_CODE.CREATED) {
        dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        setUpdatablePolicies([...updatablePolicies, response.data]);
        setNewPolicy({ hotel_id, type: "", value: "", description: "" });
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

  const handleNewPolicyChange = (field, value) => {
    setNewPolicy({ ...newPolicy, [field]: value });
  };

  const validateNewPolicy = () => {
    if (mandatoryPolicies.includes(newPolicy.type)) {
      return (
        newPolicy.type &&
        newPolicy.value &&
        newPolicy.description &&
        newPolicy.type.length > 0 &&
        newPolicy.value.length > 0 &&
        newPolicy.description.length > 0
      );
    }
    return (
      newPolicy.type &&
      newPolicy.description &&
      newPolicy.type.length > 0 &&
      newPolicy.description.length > 0
    );
  };

  const renderPolicyField = (policy) => {
    if (mandatoryPolicies.includes(policy.type)) {
      if (policy.type === POLICY.CHECK_IN_TIME || policy.type === POLICY.CHECK_OUT_TIME) {
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              ampm={false}
              readOnly={!isUpdateMode}
              label="Thời gian"
              value={timeStringToDayjs(policy.value)}
              onChange={(newValue) => handleChange(policy.id, "value", dayjsToTimeString(newValue))}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputProps={{
                    readOnly: !isUpdateMode,
                  }}
                  sx={{
                    flex: 1,
                  }}
                />
              )}
            />
          </LocalizationProvider>
        );
      } else if (policy.type === POLICY.SURCHARGE_RATES) {
        const ageRanges = ["0-6", "7-12", "13-17", "18"];

        return (
          <Stack spacing={2}>
            {/* {ageRanges.map((ageRange, index) => (
              <TextField
                key={index}
                fullWidth
                label={`Độ tuổi ${ageRange}`}
                name={`SURCHARGE_RATES.${ageRange}`}
                type="number"
                InputProps={{
                  readOnly: !isUpdateMode,
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                value={
                  policy.value && policy.value[ageRange] !== undefined
                    ? (policy.value[ageRange] * 100).toString()
                    : ""
                }
                onChange={(e) =>
                  handleChange(policy.id, "value", {
                    ...policy.value,
                    [ageRange]: parseFloat(e.target.value) / 100 || 0,
                  })
                }
              />
            ))} */}
          </Stack>
        );
      } else {
        return (
          <TextField
            fullWidth
            label="Giá trị"
            name="value"
            type="text"
            InputProps={{
              readOnly: !isUpdateMode,
              endAdornment: (POLICY.TAX === policy.type || POLICY.SERVICE_FEE === policy.type) && (
                <InputAdornment position="end">%</InputAdornment>
              ),
            }}
            value={policy.value}
            onChange={(e) => handleChange(policy.id, "value", e.target.value)}
            sx={{
              flex: 1,
            }}
          />
        );
      }
    }
    return null;
  };

  return (
    <>
      <Head>
        <title>Chính sách</title>
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
                <Typography variant="h4">Chính sách khách sạn</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={4} alignItems="center" justifyContent="flex-end">
              <Button
                sx={{ pr: 2 }}
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

            <Card sx={{ p: 2 }}>
              {policiesData?.length <= 0 ? (
                <Alert
                  variant="filled"
                  severity="warning"
                  sx={{
                    "& strong": {
                      fontWeight: "bold",
                    },
                  }}
                >
                  Vui lòng cung cấp các thông tin bắt buộc như <strong>Thời gian nhận phòng</strong>
                  , <strong>Thời gian trả phòng</strong>, <strong>Thuế VAT</strong> và{" "}
                  <strong>Phí dịch vụ</strong>, cũng như <strong>Phụ thu tùy theo độ tuổi</strong>.
                </Alert>
              ) : (
                <Alert
                  variant="filled"
                  severity="info"
                  sx={{
                    "& strong": {
                      fontWeight: "bold",
                    },
                  }}
                >
                  Các chính sách như <strong>Thời gian nhận phòng</strong>,{" "}
                  <strong>Thời gian trả phòng</strong>, <strong>Thuế VAT</strong> và{" "}
                  <strong>Phí dịch vụ</strong>, cũng như <strong>Phụ thu tùy theo độ tuổi</strong>{" "}
                  là bắt buộc nên không thể bị xóa.
                </Alert>
              )}

              <Alert
                variant="filled"
                severity="info"
                sx={{
                  my: 1,
                  "& strong": {
                    fontWeight: "bold",
                  },
                  "& p": {
                    margin: 0,
                  },
                }}
              >
                <p>
                  <strong>Chính sách hoàn tiền:</strong> Khách hàng sẽ nhận được hoàn tiền
                  <strong> 100% </strong> nếu hủy phòng trước 5 ngày check-in và
                  <strong> 50% </strong> nếu hủy phòng trước 3 ngày. Sau khoảng thời gian này, khách
                  hàng sẽ không được hoàn tiền.
                </p>
              </Alert>

              {updatablePolicies.length > 0 ? (
                <>
                  {updatablePolicies.map((policy) =>
                    policy ? (
                      <Stack
                        key={policy.id}
                        direction={{ xs: "column", sm: "row" }}
                        spacing={3}
                        my={2}
                      >
                        <TextField
                          fullWidth
                          required={!isUpdateMode || mandatoryPolicies.includes(policy.type)}
                          label="Loại chính sách"
                          name="type"
                          type="text"
                          InputProps={{
                            readOnly: !isUpdateMode,
                          }}
                          value={policyTypeLabels[policy.type] || policy.type}
                          onChange={(e) => handleChange(policy.id, "type", e.target.value)}
                          sx={{
                            flex: 1,
                          }}
                        />

                        {renderPolicyField(policy)}

                        <TextField
                          fullWidth
                          multiline
                          required={!isUpdateMode || mandatoryPolicies.includes(policy.type)}
                          minRows={1}
                          maxRows={6}
                          label="Mô tả"
                          name="description"
                          type="text"
                          InputProps={{
                            readOnly: !isUpdateMode,
                          }}
                          value={policy.description}
                          onChange={(e) => handleChange(policy.id, "description", e.target.value)}
                          sx={{
                            flex: 2,
                          }}
                        />

                        {isUpdateMode && (
                          <Stack direction="row" spacing={2} display={"flex"} alignItems={"center"}>
                            <Button
                              size="small"
                              sx={{ height: 40 }}
                              variant="contained"
                              color="success"
                              onClick={() => handleSaveChanges(policy.id)}
                            >
                              Lưu
                            </Button>
                            {!mandatoryPolicies.includes(policy.type) && (
                              <Button
                                size="small"
                                sx={{ height: 40 }}
                                variant="contained"
                                color="error"
                                onClick={() => handleDeletePolicy(policy.id)}
                              >
                                Xóa
                              </Button>
                            )}
                          </Stack>
                        )}
                      </Stack>
                    ) : null
                  )}

                  {isAdding && (
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} my={2}>
                      <TextField
                        fullWidth
                        required={isAdding || validateNewPolicy()}
                        label="Loại chính sách"
                        name="type"
                        type="text"
                        value={newPolicy.type}
                        onChange={(e) => handleNewPolicyChange("type", e.target.value)}
                        sx={{
                          flex: 1,
                        }}
                      />
                      <TextField
                        fullWidth
                        multiline
                        required={isAdding || validateNewPolicy()}
                        minRows={1}
                        maxRows={6}
                        label="Mô tả"
                        name="description"
                        type="text"
                        value={newPolicy.description}
                        onChange={(e) => handleNewPolicyChange("description", e.target.value)}
                        sx={{
                          flex: 2,
                        }}
                      />
                      <Stack direction="row" spacing={2} display={"flex"} alignItems={"center"}>
                        <Button
                          size="small"
                          sx={{ height: 40 }}
                          variant="contained"
                          color="success"
                          onClick={handleAddNewPolicy}
                          disabled={!validateNewPolicy()}
                        >
                          Tạo
                        </Button>{" "}
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
                      onClick={() => setIsUpdateMode(!isUpdateMode)}
                    >
                      {isUpdateMode ? "Hủy" : "Chỉnh sửa"}
                    </Button>
                    {!isAdding && (
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ mr: 2 }}
                        onClick={() => {
                          setIsAdding(true);
                          setIsUpdateMode(false);
                        }}
                      >
                        Thêm
                      </Button>
                    )}
                  </Stack>
                </>
              ) : (
                <>
                  <Typography variant="h6" align="center" sx={{ my: 2 }}>
                    Hiện tại không có chính sách nào.
                  </Typography>
                  {isAdding ? (
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} my={2}>
                      <TextField
                        fullWidth
                        required={isAdding || validateNewPolicy()}
                        label="Loại chính sách"
                        name="type"
                        type="text"
                        value={newPolicy.type}
                        onChange={(e) => handleNewPolicyChange("type", e.target.value)}
                        sx={{
                          flex: 1,
                        }}
                      />
                      <TextField
                        fullWidth
                        multiline
                        required={isAdding || validateNewPolicy()}
                        minRows={1}
                        maxRows={6}
                        label="Mô tả"
                        name="description"
                        type="text"
                        value={newPolicy.description}
                        onChange={(e) => handleNewPolicyChange("description", e.target.value)}
                        sx={{
                          flex: 2,
                        }}
                      />
                      <Stack direction="row" spacing={2} display={"flex"} alignItems={"center"}>
                        <Button
                          size="small"
                          sx={{ height: 40 }}
                          variant="contained"
                          color="success"
                          onClick={handleAddNewPolicy}
                          disabled={!validateNewPolicy()}
                        >
                          Tạo
                        </Button>{" "}
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
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ display: "block", mx: "auto" }}
                      onClick={() => setShowMandatoryPolicyDialog(true)}
                    >
                      Thêm chính sách mới
                    </Button>
                  )}
                </>
              )}
            </Card>
          </Stack>
        </Container>
      </Box>

      {/* Dialog to add mandatory policies */}
      <MandatoryPolicyDialog
        hotelId={hotel_id}
        showMandatoryPolicyDialog={showMandatoryPolicyDialog}
        setShowMandatoryPolicyDialog={setShowMandatoryPolicyDialog}
        onRefresh={fetchData}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
