import PropTypes from "prop-types";
import { Box, Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import DeleteCustomer from "./modal-delete";
import EditCustomer from "./modal-edit";
import DetailCustomer from "./modal-detail";
import LoadingData from "src/layouts/loading/loading-data";
import { PAGE_OPTIONS } from "src/constant/constants";
import { Scrollbar } from "src/components/scrollbar";
import { columns } from "./columns";

export const CustomersTable = (props) => {
  const { items = [], loading = false } = props;

  const [currentId, setCurrentId] = useState("");
  const [isModalDeleteCustomer, setIsModalDeleteCustomer] = useState(false);
  const [isModalEditCustomer, setIsModalEditCustomer] = useState(false);
  const [isModalDetailCustomer, setIsModalDetailCustomer] = useState(false);

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
                columns={columns.map((column) => ({
                  ...column,
                  headerName: column.headerName.toUpperCase(),
                  headerClassName: "super-app-theme--header",
                }))}
                // pagination
                // rowCount={count}
                // onPageChange={onPageChange}
                // rowsPerPageOptions={PAGE_OPTIONS.ROW_PER_PAGE_OPTIONS}
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

                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: PAGE_OPTIONS.ROW_PER_PAGE,
                    },
                  },
                }}
                pageSizeOptions={PAGE_OPTIONS.ROW_PER_PAGE_OPTIONS}
                sx={{
                  height: 360,
                  width: "100%",
                  "& .super-app-theme--header": {
                    backgroundColor: "rgb(248, 249, 250)",
                  },
                }}
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
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
};
