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

const Page = () => (
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
          <Grid xs={12} sm={6} lg={3}>
            <OverviewTotalCustomers sx={cardStyle} tabIndex={tabIndex} />
          </Grid>
          {/* <Grid xs={12} sm={6} lg={3}>
            <OverviewTasksProgress sx={cardStyle} tabIndex={tabIndex} value={75.5} />
          </Grid> */}
          <Grid xs={12} sm={6} lg={3}>
            <OverviewTotalBookings sx={cardStyle} tabIndex={tabIndex} />
          </Grid>
          <Grid xs={12} sm={6} lg={3}>
            {/* <OverviewTotalProfit sx={cardStyle} tabIndex={tabIndex} value="$15k" /> */}
            <OverviewTotalHotels sx={cardStyle} tabIndex={tabIndex} />
          </Grid>
          <Grid xs={12} lg={8}>
            <OverviewSales sx={{ height: "100%" }} />
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <OverviewTraffic
              chartSeries={[63, 15, 22]}
              labels={["Desktop", "Tablet", "Phone"]}
              sx={{ height: "100%" }}
            />
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <OverviewLatestProducts
              products={[
                {
                  id: "5ece2c077e39da27658aa8a9",
                  image: "/assets/no_image_available.png",
                  name: "Healthcare Erbology",
                  updated_at: subHours(now, 6).getTime(),
                },
                {
                  id: "5ece2c0d16f70bff2cf86cd8",
                  image: "/assets/no_image_available.png",
                  name: "Makeup Lancome Rouge",
                  updated_at: subDays(subHours(now, 8), 2).getTime(),
                },
                {
                  id: "b393ce1b09c1254c3a92c827",
                  image: "/assets/no_image_available.png",
                  name: "Skincare Soja CO",
                  updated_at: subDays(subHours(now, 1), 1).getTime(),
                },
                {
                  id: "a6ede15670da63f49f752c89",
                  image: "/assets/no_image_available.png",
                  name: "Makeup Lipstick",
                  updated_at: subDays(subHours(now, 3), 3).getTime(),
                },
                {
                  id: "bcad5524fe3a2f8f8620ceda",
                  image: "/assets/no_image_available.png",
                  name: "Healthcare Ritual",
                  updated_at: subDays(subHours(now, 5), 6).getTime(),
                },
              ]}
              sx={{ height: "100%" }}
            />
          </Grid>
          <Grid xs={12} md={12} lg={8}>
            <OverviewLatestOrders
              orders={[
                {
                  id: "f69f88012978187a6c12897f",
                  ref: "DEV1049",
                  amount: 30.5,
                  customer: {
                    name: "Ekaterina Tankova",
                  },
                  created_at: 1555016400000,
                  status: "pending",
                },
                {
                  id: "9eaa1c7dd4433f413c308ce2",
                  ref: "DEV1048",
                  amount: 25.1,
                  customer: {
                    name: "Cao Yu",
                  },
                  created_at: 1555016400000,
                  status: "delivered",
                },
                {
                  id: "01a5230c811bd04996ce7c13",
                  ref: "DEV1047",
                  amount: 10.99,
                  customer: {
                    name: "Alexa Richardson",
                  },
                  created_at: 1554930000000,
                  status: "refunded",
                },
                {
                  id: "1f4e1bd0a87cea23cdb83d18",
                  ref: "DEV1046",
                  amount: 96.43,
                  customer: {
                    name: "Anje Keizer",
                  },
                  created_at: 1554757200000,
                  status: "pending",
                },
                {
                  id: "9f974f239d29ede969367103",
                  ref: "DEV1045",
                  amount: 32.54,
                  customer: {
                    name: "Clarke Gillebert",
                  },
                  created_at: 1554670800000,
                  status: "delivered",
                },
                {
                  id: "ffc83c1560ec2f66a1c05596",
                  ref: "DEV1044",
                  amount: 16.76,
                  customer: {
                    name: "Adam Denisov",
                  },
                  created_at: 1554670800000,
                  status: "delivered",
                },
              ]}
              sx={{ height: "100%" }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
