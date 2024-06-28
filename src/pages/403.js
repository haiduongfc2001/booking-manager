import Head from "next/head";
import NextLink from "next/link";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import { Box, Button, Container, SvgIcon, Typography } from "@mui/material";

const Page = () => (
  <>
    <Head>
      <title>403 | DHD</title>
    </Head>
    <Box
      component="main"
      sx={{
        alignItems: "center",
        display: "flex",
        flexGrow: 1,
        minHeight: "100%",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              mb: 3,
              textAlign: "center",
            }}
          >
            <img
              alt="Under development"
              src="/assets/errors/error-404.png"
              style={{
                display: "inline-block",
                maxWidth: "100%",
                width: 300,
              }}
            />
          </Box>
          <Typography align="center" sx={{ mb: 3 }} variant="h3">
            404: Bạn không có quyền truy cập vào trang này
          </Typography>
          <Typography align="center" color="text.secondary" variant="body1">
            Bạn không có đủ quyền hạn để truy cập vào trang này. Nếu bạn nghĩ rằng đây là lỗi, hãy
            thử đăng nhập bằng tài khoản khác hoặc liên hệ với quản trị viên.
          </Typography>
          <Button
            component={NextLink}
            href="/"
            startIcon={
              <SvgIcon fontSize="small">
                <ArrowLeftIcon />
              </SvgIcon>
            }
            sx={{ mt: 3 }}
            variant="contained"
          >
            Quay lại bảng điều khiển
          </Button>
        </Box>
      </Container>
    </Box>
  </>
);

export default Page;
