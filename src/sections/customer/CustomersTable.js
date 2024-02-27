import PropTypes from "prop-types";
import { Box, Card, Typography } from "@mui/material";
import { useState } from "react";
import DeleteCustomer from "./DeleteCustomer";
import EditCustomer from "./EditCustomer";
import DetailCustomer from "./DetailCustomer";
import LoadingData from "src/layouts/loading/LoadingData";
import { Scrollbar } from "src/components/ScrollBar";
import { columns } from "./Columns";
import { ErrorOutline } from "@mui/icons-material";
import CustomDataGrid from "src/components/data-grid/CustomDataGrid";
import useSaveGridState from "src/utils/TableState";
import { setAllCustomers } from "src/redux/create-actions/TableAction";

export const CustomersTable = (props) => {
  const { items = [], loading = false, onRefresh = () => {} } = props;

  const [currentId, setCurrentId] = useState("");
  const [isModalDeleteCustomer, setIsModalDeleteCustomer] = useState(false);
  const [isModalEditCustomer, setIsModalEditCustomer] = useState(false);
  const [isModalDetailCustomer, setIsModalDetailCustomer] = useState(false);

  const handleOpenModalDetail = (id) => {
    setCurrentId(id);
    setIsModalDetailCustomer(true);
  };

  const handleOpenModalDelete = (id) => {
    setCurrentId(id);
    setIsModalDeleteCustomer(true);
  };

  const handleOpenModalEdit = (id) => {
    setCurrentId(id);
    setIsModalEditCustomer(true);
  };

  const allCustomersState = useSaveGridState(
    (state) => state.table?.customer?.allCustomers,
    setAllCustomers
  );

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            {loading ? (
              <LoadingData />
            ) : items && items.length > 0 ? (
              <CustomDataGrid
                rows={items}
                columns={columns({
                  handleOpenModalDetail,
                  handleOpenModalDelete,
                  handleOpenModalEdit,
                })}
                tableState={allCustomersState}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  p: 2,
                }}
              >
                <ErrorOutline sx={{ mr: 1 }} />
                <Typography variant="body1" color="neutral.900">
                  No data available
                </Typography>
              </Box>
            )}
          </Box>
        </Scrollbar>
      </Card>

      <DeleteCustomer
        isModalDeleteCustomer={isModalDeleteCustomer}
        setIsModalDeleteCustomer={setIsModalDeleteCustomer}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />
      <EditCustomer
        isModalEditCustomer={isModalEditCustomer}
        setIsModalEditCustomer={setIsModalEditCustomer}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
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
  onRefresh: PropTypes.func,
};
