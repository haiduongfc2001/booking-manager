import Head from "next/head";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Tooltip,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth";
import { Layout as AuthLayout } from "src/layouts/auth/layout";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { useDispatch } from "react-redux";
import * as LoginService from "src/services/auth-service";
import { API, ROLE, STATUS_CODE, TOAST_KIND } from "src/constant/constants";
import { showCommonAlert } from "src/utils/toast-message";
import { login } from "src/redux/create-actions/auth-action";
import Cookies from "js-cookie";
import Storage from "src/utils/Storage";

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const dispatch = useDispatch();
  dispatch(closeLoadingApi());

  const [showPassword, setShowPassword] = useState(false);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: "admin@gmail.com",
      password: "123456Aa",
      role: ROLE.ADMIN,
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Vui lòng nhập địa chỉ email hợp lệ!")
        .max(255)
        .required("Vui lòng nhập địa chỉ email!"),
      password: Yup.string().max(255).required("Vui lòng nhập mật khẩu!"),
      role: Yup.string().required("Vui lòng chọn vai trò của bạn!"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        dispatch(openLoadingApi());

        const role = values.role;

        const body = {
          email: values.email,
          password: values.password,
          role,
        };

        let response;

        switch (values.role) {
          case ROLE.ADMIN:
            response = await LoginService[API.LOGIN.ADMIN](body);
            break;
          case ROLE.MANAGER:
          case ROLE.RECEPTIONIST:
            response = await LoginService[API.LOGIN.STAFF](body);
            break;
          default:
            throw new Error("Vai trò không hợp lệ");
        }

        if (response?.status === STATUS_CODE.OK) {
          Storage.updateLocalAccessToken(response.token);
          Cookies.set("role", values.role, { expires: 1 });
          const { email, id, avatar } = response.admin ? response.admin : response.staff;

          const full_name = response.admin ? "Đỗ Hải Dương" : response.staff.full_name;
          const hotel_id = response.admin ? null : response.staff.hotel_id;

          dispatch(
            login({
              role,
              user_id: id,
              hotel_id,
              email,
              full_name,
              avatar,
            })
          );

          await auth.signIn(values.email, values.password);
          router.push("/");
          dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
          formik.resetForm();
        } else {
          throw new Error("Email hoặc mật khẩu của bạn không chính xác!");
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        dispatch(closeLoadingApi());
      }
    },
  });

  // Sử dụng useEffect để cập nhật giá trị email sau khi formik được khởi tạo
  useEffect(() => {
    if (formik.values.role === ROLE.ADMIN) {
      formik.setFieldValue("email", "admin@gmail.com");
    } else if (formik.values.role === ROLE.MANAGER) {
      formik.setFieldValue("email", "manager@gmail.com");
    } else if (formik.values.role === ROLE.RECEPTIONIST) {
      formik.setFieldValue("email", "receptionist@gmail.com");
    }
  }, [formik.values.role]);

  return (
    <>
      <Head>
        <title>Đăng nhập | DHD</title>
      </Head>
      <Box
        sx={{
          backgroundColor: "background.paper",
          flex: "1 1 auto",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: "100px",
            width: "100%",
          }}
        >
          <div>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Đăng nhập</Typography>
              {/* <Typography color="text.secondary" variant="body2">
                Bạn không có tài khoản?&nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Đăng ký
                </Link>
              </Typography> */}
            </Stack>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  autoFocus
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  InputProps={{
                    endAdornment: formik.values.password && (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{
                            color: "icon.main",
                            mr: 1,
                          }}
                        >
                          {showPassword ? (
                            <Tooltip title="Ẩn mật khẩu">
                              <VisibilityOff />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Hiển thị mật khẩu">
                              <Visibility />
                            </Tooltip>
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!(formik.touched.password && formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
                <FormControl error={!!(formik.touched.role && formik.errors.role)}>
                  <FormLabel id="demo-controlled-radio-buttons-group">Vai trò</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="role"
                    value={formik.values.role}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value={ROLE.ADMIN}
                      control={<Radio />}
                      label="Quản trị viên"
                    />
                    <FormControlLabel
                      value={ROLE.MANAGER}
                      control={<Radio />}
                      label="Quản lý khách sạn"
                    />
                    <FormControlLabel
                      value={ROLE.RECEPTIONIST}
                      control={<Radio />}
                      label="Nhân viên lễ tân"
                    />
                  </RadioGroup>
                  {formik.touched.role && formik.errors.role && (
                    <Typography color="error" variant="body2">
                      {formik.errors.role}
                    </Typography>
                  )}
                </FormControl>
              </Stack>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              <Button fullWidth size="large" sx={{ mt: 3 }} type="submit" variant="contained">
                Tiếp tục
              </Button>
              <Alert color="primary" severity="info" sx={{ mt: 3 }}>
                <div>
                  Bạn có thể sử dụng <b>admin@gmail.com</b> và mật khẩu <b>123456Aa</b>
                </div>
              </Alert>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
