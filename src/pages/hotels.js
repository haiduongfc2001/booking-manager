import { useEffect, useState } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Card, Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/Layout";
import { HotelsTable } from "src/sections/hotel/HotelsTable";
import { HotelsSearch } from "src/sections/hotel/HotelsSearch";
import { STATUS_CODE } from "src/constant/Constants";
import CreateHotel from "src/sections/hotel/CreateHotel";
import * as HotelService from "../services/HotelService";
import { API } from "src/constant/Constants";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [hotelsData, setHotelsData] = useState([]);
  const [isModalCreateHotel, setIsModalCreateHotel] = useState(false);

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      setLoading(true);

      const response = await HotelService[API.HOTEL.GET_ALL_HOTELS]();

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setHotelsData(response.data);
      } else {
        // dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      // dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.FILTER_ERROR));
    } finally {
      setLoading(false);
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
                <Stack alignItems="center" direction="row" spacing={1}>
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
                </Stack>
              </Stack>
            </Stack>
            <Card sx={{ p: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <HotelsSearch />
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

            <HotelsTable items={hotelsData} loading={loading} onRefresh={fetchData} />
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
