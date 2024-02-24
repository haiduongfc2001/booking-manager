import { useEffect, useState } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Card } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { STATUS_CODE } from "src/constant/constants";
import CreateCustomer from "src/sections/customer/modal-create";
import * as CustomerService from "../services/CustomerService";
import { API } from "src/constant/constants";

const useCustomers = (setLoading) => {
  const [customersData, setCustomersData] = useState([]);

  const fetchData = async () => {
    if (fetchData.current) {
      return;
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return customersData;
};

const Page = () => {
  const [loading, setLoading] = useState(false);
  const customers = useCustomers(setLoading);
  const [isModalCreateCustomer, setIsModalCreateCustomer] = useState(false);

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
          py: 8,
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
                <CustomersSearch />
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
            <CustomersTable items={customers} loading={loading} />
          </Stack>
        </Container>
      </Box>

      <CreateCustomer
        isModalCreateCustomer={isModalCreateCustomer}
        setIsModalCreateCustomer={setIsModalCreateCustomer}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
