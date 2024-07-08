import { useEffect, useState } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Card, Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { StaffTable } from "src/sections/manager/staff/staff-table";
import { SearchStaff } from "src/sections/manager/staff/search-staff";
import { STATUS_CODE } from "src/constant/constants";
import CreateStaff from "src/sections/manager/staff/create-staff";
import * as StaffService from "src/services/staff-service";
import { API } from "src/constant/constants";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const [staffsData, setStaffsData] = useState([]);
  const [isModalCreateStaff, setIsModalCreateStaff] = useState(false);

  const dispatch = useDispatch();
  const hotel_id = useSelector((state) => state.auth.hotel_id);

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      dispatch(openLoadingApi());

      const response = await StaffService[API.HOTEL.STAFF.GET_ALL_STAFFS_BY_HOTEL_ID]({
        hotel_id,
      });

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setStaffsData(response.data);
      } else {
        // dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.error));
      }
    } catch (error) {
      // dispatch(showCommonAlert(TOAST_KIND.ERROR, TOAST_MESSAGE.SERVER_ERROR));
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  useEffect(() => {
    if (hotel_id) {
      fetchData();
    }
  }, []);

  const handleOpenModalCreate = () => {
    setIsModalCreateStaff(true);
  };

  return (
    <>
      <Head>
        <title>Staffs | DHD</title>
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
                <Typography variant="h4">Nhân viên khách sạn</Typography>
              </Stack>
            </Stack>
            <Card sx={{ p: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                {/* <SearchStaff /> */}
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
                Số nhân viên: {staffsData?.length}
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

            <StaffTable items={staffsData} onRefresh={fetchData} />
          </Stack>
        </Container>
      </Box>
      <CreateStaff
        isModalCreateStaff={isModalCreateStaff}
        setIsModalCreateStaff={setIsModalCreateStaff}
        onRefresh={fetchData}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
