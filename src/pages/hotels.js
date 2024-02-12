import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Card } from "@mui/material";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { HotelsTable } from "src/sections/hotel/hotels-table";
import { HotelsSearch } from "src/sections/hotel/hotels-search";
import { applyPagination } from "src/utils/apply-pagination";
import { hotelData } from "src/components/data";
import { PAGE_OPTIONS } from "src/utils/constants";
import CreateHotel from "src/sections/hotel/modal-create";

const useHotels = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(hotelData, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useHotelIds = (hotels) => {
  return useMemo(() => {
    return hotels.map((hotel) => hotel.hotel_id);
  }, [hotels]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(PAGE_OPTIONS.ROW_PER_PAGE);
  const hotels = useHotels(page, rowsPerPage);
  const hotelsIds = useHotelIds(hotels);
  const hotelsSelection = useSelection(hotelsIds);
  const [isModalCreateHotel, setIsModalCreateHotel] = useState(false);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
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
          py: 8,
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
            <HotelsTable
              count={hotelData.length}
              items={hotels}
              onDeselectAll={hotelsSelection.handleDeselectAll}
              onDeselectOne={hotelsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={hotelsSelection.handleSelectAll}
              onSelectOne={hotelsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={hotelsSelection.selected}
            />
          </Stack>
        </Container>
      </Box>

      <CreateHotel
        isModalCreateHotel={isModalCreateHotel}
        setIsModalCreateHotel={setIsModalCreateHotel}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
