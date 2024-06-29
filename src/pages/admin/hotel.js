import { useEffect, useState } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Card, Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { HotelTable } from "src/sections/admin/hotel/hotel-table";
import { SearchHotel } from "src/sections/admin/hotel/search-hotel";
import { STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import CreateHotel from "src/sections/admin/hotel/create-hotel";
import * as HotelService from "src/services/hotel-service";
import { API } from "src/constant/constants";
import { useDispatch } from "react-redux";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { showCommonAlert } from "src/utils/toast-message";

const Page = () => {
  const [hotelsData, setHotelsData] = useState([]);
  const [isModalCreateHotel, setIsModalCreateHotel] = useState(false);

  const dispatch = useDispatch();

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      dispatch(openLoadingApi());

      const response = await HotelService[API.HOTEL.GET_ALL_HOTELS]();

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setHotelsData(response.data);
      } else {
        dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
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
    setIsModalCreateHotel(true);
  };

  return (
    <>
      <Head>
        <title>Hotels | DHD</title>
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
                <Typography variant="h4">Khách sạn</Typography>
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
                <SearchHotel />
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
                Số khách sạn: {hotelsData?.length}
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

            <HotelTable items={hotelsData} onRefresh={fetchData} />
          </Stack>
        </Container>
      </Box>
      <CreateHotel
        isModalCreateHotel={isModalCreateHotel}
        setIsModalCreateHotel={setIsModalCreateHotel}
        onRefresh={fetchData}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
