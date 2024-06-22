import { useEffect, useState } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Card, Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { StaffTable } from "src/sections/admin/staff/staff-table";
import { SearchStaff } from "src/sections/admin/staff/search-staff";
import { STATUS_CODE, TOAST_KIND, TOAST_MESSAGE } from "src/constant/constants";
import CreateStaff from "src/sections/admin/staff/create-staff";
import * as StaffService from "../../services/staff-service";
import { API } from "src/constant/constants";
import { closeLoadingApi, openLoadingApi } from "src/redux/create-actions/loading-action";
import { showCommonAlert } from "src/utils/toast-message";
import { useDispatch } from "react-redux";

const Page = () => {
  const [staffsData, setStaffsData] = useState([]);
  const [isModalCreateStaff, setIsModalCreateStaff] = useState(false);

  const dispatch = useDispatch();

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      dispatch(openLoadingApi());

      const response = await StaffService[API.HOTEL.STAFF.GET_ALL_STAFFS]();

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setStaffsData(response.data);
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
                <SearchStaff />
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
