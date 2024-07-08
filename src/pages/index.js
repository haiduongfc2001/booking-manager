import Head from "next/head";
import { subDays, subHours } from "date-fns";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewRevenue } from "src/sections/overview/overview-revenue";
import { OverviewLatestOrders } from "src/sections/overview/overview-latest-orders";
import { OverviewLatestProducts } from "src/sections/overview/overview-latest-products";
import { OverviewSales } from "src/sections/overview/overview-sales";
import { OverviewTasksProgress } from "src/sections/overview/overview-tasks-progress";
import { OverviewTotalCustomers } from "src/sections/overview/overview-total-customers";
import { OverviewTotalProfit } from "src/sections/overview/overview-total-profit";
import { OverviewTraffic } from "src/sections/overview/overview-traffic";
import { OverviewTotalHotels } from "src/sections/overview/overview-total-hotels";
import { OverviewTotalBookings } from "src/sections/overview/overview-total-bookings";
import { ROLE } from "src/constant/constants";
import { useSelector } from "react-redux";

const now = new Date();

const cardStyle = {
  height: "100%",
  boxShadow: 3,
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    bgcolor: "primary.light",
    cursor: "pointer",
    transform: "scale(1.05)",
    boxShadow: 6,
    border: "1px solid",
    borderColor: "primary.main",
  },
  "&:focus": {
    outline: "none",
    boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.5)",
  },
};

const tabIndex = 0;

const Page = () => {
  const role = useSelector((state) => state.auth.role);

  return (
    <>
      <Head>
        <title>Tổng quan | DHD</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewRevenue sx={cardStyle} tabIndex={tabIndex} />
            </Grid>
            {role === ROLE.ADMIN && (
              <Grid xs={12} sm={6} lg={3}>
                <OverviewTotalCustomers sx={cardStyle} tabIndex={tabIndex} />
              </Grid>
            )}
            {/* {role === ROLE.MANAGER && (
              <Grid xs={12} sm={6} lg={3}>
                <OverviewTotalCustomers sx={cardStyle} tabIndex={tabIndex} />
              </Grid>
            )} */}
            {/* <Grid xs={12} sm={6} lg={3}>
            <OverviewTasksProgress sx={cardStyle} tabIndex={tabIndex} value={75.5} />
          </Grid> */}
            <Grid xs={12} sm={6} lg={3}>
              <OverviewTotalBookings sx={cardStyle} tabIndex={tabIndex} />
            </Grid>
            {role === ROLE.ADMIN && (
              <Grid xs={12} sm={6} lg={3}>
                {/* <OverviewTotalProfit sx={cardStyle} tabIndex={tabIndex} value="$15k" /> */}
                <OverviewTotalHotels sx={cardStyle} tabIndex={tabIndex} />
              </Grid>
            )}
            <Grid xs={12} lg={8}>
              <OverviewSales sx={{ height: "100%" }} />
            </Grid>
            {role === ROLE.ADMIN && (
              <Grid xs={12} md={6} lg={4}>
                <OverviewTraffic sx={{ height: "100%" }} />
              </Grid>
            )}
            <Grid xs={12} md={6} lg={4}>
              <OverviewLatestProducts />
            </Grid>
            <Grid xs={12} md={12} lg={8}>
              <OverviewLatestOrders sx={{ height: "100%" }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
