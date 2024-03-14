import { useEffect, useState } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import ArrowPathIcon from "@heroicons/react/24/solid/ArrowPathIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Card, Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomerTable } from "src/sections/customer/customer-table";
import { SearchCustomer } from "src/sections/customer/search-customer";
import { STATUS_CODE } from "src/constant/constants";
import CreateCustomer from "src/sections/customer/create-customer";
import * as CustomerService from "../services/customer-service";
import { API } from "src/constant/constants";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [customersData, setCustomersData] = useState([]);
  const [isModalCreateCustomer, setIsModalCreateCustomer] = useState(false);

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

    fetchData.current = true;

    try {
      setLoading(true);

      const response = await CustomerService[API.CUSTOMER.GET_ALL_CUSTOMERS]();

      if (response?.status !== STATUS_CODE.UNAUTHORIZED) {
        setCustomersData(response.data);
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
    setIsModalCreateCustomer(true);
  };

  return (
    <>
      <Head>
        <title>Customers | DHD</title>
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
                <Typography variant="h4">Khách hàng</Typography>
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
                <SearchCustomer />
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

            <CustomerTable items={customersData} loading={loading} onRefresh={fetchData} />
          </Stack>
        </Container>
      </Box>
      <CreateCustomer
        isModalCreateCustomer={isModalCreateCustomer}
        setIsModalCreateCustomer={setIsModalCreateCustomer}
        onRefresh={fetchData}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
