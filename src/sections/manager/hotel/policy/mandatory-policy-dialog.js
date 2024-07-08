import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import * as HotelService from "src/services/hotel-service";
import { API, POLICY, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import { useDispatch } from "react-redux";
import { showCommonAlert } from "src/utils/toast-message";
import { LocalizationProvider, TimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import SurchargeRatesInput from "./surcharge-rates-input";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";

const mandatoryPolicies = [
  {
    type: POLICY.SURCHARGE_RATES,
    label: "Phụ thu tùy theo độ tuổi",
    description:
      "Phụ thu tùy theo độ tuổi: Áp dụng mức phụ thu khác nhau cho từng độ tuổi." +
      "Ví dụ: trẻ em từ 0-6 tuổi được miễn phí, từ 7-12 tuổi phụ thu 20%, từ 13-17 tuổi phụ thu 50%, và trên 18 tuổi phụ thu 50%.",
  },
  {
    type: POLICY.TAX,
    label: "Thuế VAT",
    description: "Thuế VAT: Áp dụng thuế VAT của khách sạn, thường là 10% tổng chi phí.",
  },
  {
    type: POLICY.SERVICE_FEE,
    label: "Phí dịch vụ",
    description: "Phí dịch vụ: Phí này bao gồm các dịch vụ bổ sung do khách sạn cung cấp.",
  },
  {
    type: POLICY.CHECK_IN_TIME,
    label: "Thời gian nhận phòng",
    description: "Thời gian nhận phòng: Thời gian quy định khách có thể nhận phòng.",
  },
  {
    type: POLICY.CHECK_OUT_TIME,
    label: "Thời gian trả phòng",
    description: "Thời gian trả phòng: Thời gian quy định khách phải trả phòng.",
  },
];

// Hàm để chuyển đổi chuỗi thời gian "HH:mm" thành đối tượng dayjs
const timeStringToDayjs = (timeString) => {
  return dayjs(timeString, "HH:mm");
};

// Hàm để chuyển đổi đối tượng dayjs thành chuỗi thời gian "HH:mm"
const dayjsToTimeString = (date) => {
  return date.format("HH:mm");
};

const initialData = mandatoryPolicies.reduce((acc, policy) => {
  acc[policy.type] = {
    value: "",
    description: policy.description,
  };
  return acc;
}, {});

const MandatoryPolicyDialog = (props) => {
  const { hotelId, showMandatoryPolicyDialog, setShowMandatoryPolicyDialog, onRefresh } = props;

  const dispatch = useDispatch();

  const handleMandatoryPolicyDialogClose = () => {
    setShowMandatoryPolicyDialog(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      ...initialData,
      SURCHARGE_RATES: {
        "0-6": 0,
        "7-12": 20,
        "13-17": 50,
        18: 50,
      },
      submit: null,
    },
    validationSchema: Yup.object(
      mandatoryPolicies.reduce((acc, policy) => {
        if (policy.type === POLICY.SURCHARGE_RATES) {
          acc[policy.type] = Yup.object().shape({
            "0-6": Yup.number().required("Vui lòng nhập giá trị!"),
            "7-12": Yup.number().required("Vui lòng nhập giá trị!"),
            "13-17": Yup.number().required("Vui lòng nhập giá trị!"),
            18: Yup.number().required("Vui lòng nhập giá trị!"),
          });
        } else {
          acc[policy.type] = Yup.object({
            value: Yup.string().required("Vui lòng nhập giá trị!"),
            description: Yup.string().required("Vui lòng nhập mô tả!"),
          });
        }
        return acc;
      }, {})
    ),
    onSubmit: async (values, helpers) => {
      try {
        dispatch(openLoadingApi());

        // Convert surchargeRates object to an array of objects with age and rate
        const surchargeRatesArray = Object.entries(values.SURCHARGE_RATES).map(([age, rate]) => ({
          age,
          rate: rate / 100, // Assuming rate is in percentage
        }));

        // Sort surchargeRatesArray by age
        surchargeRatesArray.sort((a, b) => {
          const ageA = a.age;
          const ageB = b.age;
          if (ageA < ageB) return -1;
          if (ageA > ageB) return 1;
          return 0;
        });

        // Convert sorted array back to an object with sorted keys
        const formattedSurchargeRates = surchargeRatesArray.reduce((acc, current) => {
          acc[current.age] = current.rate;
          return acc;
        }, {});

        // Define the desired order of keys
        const desiredOrder = ["0-6", "7-12", "13-17", "18"];

        // Create a new object with keys sorted in desired order
        const sortedSurchargeRates = {};
        desiredOrder.forEach((key) => {
          if (formattedSurchargeRates[key] !== undefined) {
            sortedSurchargeRates[key] = formattedSurchargeRates[key];
          }
        });

        const policies = mandatoryPolicies.map((policy) => {
          if (policy.type === POLICY.SURCHARGE_RATES) {
            return {
              type: policy.type,
              value: JSON.stringify(sortedSurchargeRates),
              description: policy.description,
            };
          }
          return {
            type: policy.type,
            value: values[policy.type].value,
            description: values[policy.type].description,
          };
        });
        const response = await HotelService[API.HOTEL.POLICY.CREATE_MULTIPLE_POLICIES]({
          hotel_id: hotelId,
          policies,
        });

        if (response?.status === STATUS_CODE.CREATED) {
          handleMandatoryPolicyDialogClose();
          onRefresh();
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        } else {
          dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        dispatch(closeLoadingApi());
      }
    },

    enableReinitialize: true,
    validateOnBlur: false,
  });

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (showMandatoryPolicyDialog) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [showMandatoryPolicyDialog]);

  const handleAddAgeRange = () => {
    const newAgeRange = prompt("Nhập độ tuổi mới (ví dụ: 0-6, 7-12, 13-17, 18):");
    if (newAgeRange && !formik.values.SURCHARGE_RATES[newAgeRange]) {
      formik.setFieldValue(`SURCHARGE_RATES.${newAgeRange}`, 0);
    }
  };

  const handleRemoveAgeRange = (ageRange) => {
    const updatedSurchargeRates = { ...formik.values.SURCHARGE_RATES };
    delete updatedSurchargeRates[ageRange];
    formik.setFieldValue("SURCHARGE_RATES", updatedSurchargeRates);
  };

  const renderPolicyField = (policy) => {
    if (policy.type === POLICY.SURCHARGE_RATES) {
      return (
        <SurchargeRatesInput
          values={formik.values}
          handleChange={formik.handleChange}
          handleAddAgeRange={handleAddAgeRange}
          handleRemoveAgeRange={handleRemoveAgeRange}
        />
      );
    }

    if ([POLICY.CHECK_IN_TIME, POLICY.CHECK_OUT_TIME].includes(policy.type)) {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            ampm={false}
            label="Thời gian"
            name={`${policy.type}.value`}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
            }}
            value={timeStringToDayjs(formik.values[policy.type].value)}
            onChange={(newValue) =>
              formik.setFieldValue(policy.type, {
                ...formik.values[policy.type],
                value: dayjsToTimeString(newValue),
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                required
                fullWidth
                error={
                  formik.touched[policy.type]?.value && Boolean(formik.errors[policy.type]?.value)
                }
                helperText={formik.touched[policy.type]?.value && formik.errors[policy.type]?.value}
                sx={{
                  flex: 1,
                }}
              />
            )}
          />
        </LocalizationProvider>
      );
    }

    return (
      <TextField
        fullWidth
        required
        multiline
        minRows={1}
        maxRows={6}
        label="Giá trị"
        name={`${policy.type}.value`}
        type="text"
        value={formik.values[policy.type].value}
        onChange={formik.handleChange}
        error={formik.touched[policy.type]?.value && Boolean(formik.errors[policy.type]?.value)}
        helperText={formik.touched[policy.type]?.value && formik.errors[policy.type]?.value}
        sx={{
          flex: 1,
        }}
        InputProps={{
          endAdornment: (POLICY.TAX === policy.type || POLICY.SERVICE_FEE === policy.type) && (
            <InputAdornment position="end">%</InputAdornment>
          ),
        }}
      />
    );
  };

  return (
    <Dialog
      open={showMandatoryPolicyDialog}
      onClose={handleMandatoryPolicyDialogClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      maxWidth="md"
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          height: "auto",
          minWidth: "80%",
        },
      }}
    >
      <DialogTitle id="scroll-dialog-title">Thêm chính sách bắt buộc</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleMandatoryPolicyDialogClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <form noValidate onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 3 }}>
            {mandatoryPolicies.map((policy) => (
              <Stack key={policy.type} direction={{ xs: "column", sm: "row" }} spacing={3} my={2}>
                <TextField
                  fullWidth
                  required
                  label="Loại chính sách"
                  name={`${policy.type}.label`}
                  type="text"
                  value={policy.label}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    flex: 1,
                  }}
                />

                {renderPolicyField(policy)}

                <TextField
                  fullWidth
                  required
                  multiline
                  minRows={1}
                  maxRows={6}
                  label="Mô tả"
                  name={`${policy.type}.description`}
                  type="text"
                  value={formik.values[policy.type].description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched[policy.type]?.description &&
                    Boolean(formik.errors[policy.type]?.description)
                  }
                  helperText={
                    formik.touched[policy.type]?.description &&
                    formik.errors[policy.type]?.description
                  }
                  sx={{
                    flex: 2,
                    bgcolor: "background.paper",
                  }}
                />
              </Stack>
            ))}
          </Stack>
          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 3 }} variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ my: 3, mr: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            color="success"
            sx={{ mr: 2 }}
            disabled={formik.isSubmitting}
          >
            Tạo
          </Button>
          <Button variant="contained" color="inherit" onClick={handleMandatoryPolicyDialogClose}>
            Hủy
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

MandatoryPolicyDialog.propTypes = {
  hotelId: PropTypes.number.isRequired,
  showMandatoryPolicyDialog: PropTypes.bool.isRequired,
  setShowMandatoryPolicyDialog: PropTypes.func.isRequired,
  onRefresh: PropTypes.func,
};

export default MandatoryPolicyDialog;
