import PropTypes from "prop-types";
import { Box, Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import DeleteCustomer from "./DeleteCustomer";
import EditCustomer from "./EditCustomer";
import DetailCustomer from "./DetailCustomer";
import LoadingData from "src/layouts/loading/LoadingData";
import { DATAGRID_OPTIONS } from "src/constant/Constants";
import { Scrollbar } from "src/components/ScrollBar";
import { columns } from "./Columns";

export const CustomersTable = (props) => {
  const { items = [], loading = false } = props;

  const [currentId, setCurrentId] = useState("");
  const [isModalDeleteCustomer, setIsModalDeleteCustomer] = useState(false);
  const [isModalEditCustomer, setIsModalEditCustomer] = useState(false);
  const [isModalDetailCustomer, setIsModalDetailCustomer] = useState(false);

  const handleOpenModalDetail = (id) => {
    setCurrentId(id);
    setIsModalDetailCustomer(true);
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            {loading ? (
              <LoadingData />
            ) : (
              <DataGrid
                rows={items}
                columns={columns({ handleOpenModalDetail }).map((column) => ({
                  ...column,
                  headerName: column.headerName.toUpperCase(),
                  headerClassName: "super-app-theme--header",
                }))}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: DATAGRID_OPTIONS.PAGE_SIZE,
                    },
                  },
                }}
                pageSizeOptions={DATAGRID_OPTIONS.PAGE_SIZE_OPTIONS}
                rowHeight={DATAGRID_OPTIONS.ROW_HEIGHT}
                sx={{
                  height: DATAGRID_OPTIONS.TABLE_HEIGHT,
                  width: "100%",
                  "& .super-app-theme--header": {
                    backgroundColor: "rgb(248, 249, 250)",
                  },
                  boxShadow: 2,
                  // border: 2,
                  // borderColor: "text.tertiary",
                  // borderRadius: "8px",
                  "& .MuiDataGrid-cell:hover": {
                    color: "text.tertiary",
                  },
                }}
                hideFooterSelectedRowCount
                // pagination
                // rowCount={count}
                // onPageChange={onPageChange}
                // rowsPerPageOptions={DATAGRID_OPTIONS.PAGE_SIZE_OPTIONS}
                // onPageSizeChange={onRowsPerPageChange}
                // checkboxSelection
                // selectionModel={selected}
                // onSelectionModelChange={(newSelection) => {
                //   if (newSelection.selectionModel) {
                //     onSelectAll?.();
                //   } else {
                //     onDeselectAll?.();
                //   }
                // }}
              />
            )}
          </Box>
        </Scrollbar>
      </Card>

      <DeleteCustomer
        isModalDeleteCustomer={isModalDeleteCustomer}
        setIsModalDeleteCustomer={setIsModalDeleteCustomer}
        currentId={parseInt(currentId)}
      />
      <EditCustomer
        isModalEditCustomer={isModalEditCustomer}
        setIsModalEditCustomer={setIsModalEditCustomer}
        currentId={parseInt(currentId)}
      />
      <DetailCustomer
        isModalDetailCustomer={isModalDetailCustomer}
        setIsModalDetailCustomer={setIsModalDetailCustomer}
        currentId={parseInt(currentId)}
      />
    </>
  );
};

CustomersTable.propTypes = {
  items: PropTypes.array,
  loading: PropTypes.bool,
};
