import { useCallback, useMemo, useState } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, Card } from "@mui/material";
import { useSelection } from "src/hooks/UseSelection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/Layout";
import { ManagersTable } from "src/sections/manager/ManagersTable";
import { ManagersSearch } from "src/sections/manager/ManagersSearch";
import { applyPagination } from "src/utils/ApplyPagination";
import { managerData } from "src/components/Data";
import { DATAGRID_OPTIONS } from "src/constant/constants";
import CreateManager from "src/sections/manager/CreateManager";

const useManagers = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(managerData, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useManagerIds = (managers) => {
  return useMemo(() => {
    return managers.map((manager) => manager.id);
  }, [managers]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DATAGRID_OPTIONS.PAGE_SIZE);
  const managers = useManagers(page, rowsPerPage);
  const managersIds = useManagerIds(managers);
  const managersSelection = useSelection(managersIds);
  const [isModalCreateManager, setIsModalCreateManager] = useState(false);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const handleOpenModalCreate = () => {
    setIsModalCreateManager(true);
  };

  return (
    <>
      <Head>
        <title>Managers | DHD</title>
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
                <Typography variant="h4">Quản lý khách sạn</Typography>
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
                <ManagersSearch />
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
            <ManagersTable
              count={managerData.length}
              items={managers}
              onDeselectAll={managersSelection.handleDeselectAll}
              onDeselectOne={managersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={managersSelection.handleSelectAll}
              onSelectOne={managersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={managersSelection.selected}
            />
          </Stack>
        </Container>
      </Box>

      <CreateManager
        isModalCreateManager={isModalCreateManager}
        setIsModalCreateManager={setIsModalCreateManager}
      />
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
