import Head from "next/head";
import NextLink from "next/link";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import { Box, Button, Container, SvgIcon, Typography } from "@mui/material";

const Page = () => (
  <>
    <Head>
      <title>404 | DHD</title>
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
            404: Trang bạn đang tìm kiếm không có ở đây
          </Typography>
          <Typography align="center" color="text.secondary" variant="body1">
            Bạn đã thử một số tuyến đường mờ ám hoặc bạn đã đến đây một cách tình cờ. Dù là gì, hãy
            thử sử dụng điều hướng
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
