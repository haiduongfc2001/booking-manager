import PropTypes from "prop-types";
import { Box, Card } from "@mui/material";
import { useState } from "react";
import DeleteCustomer from "./DeleteCustomer";
import EditCustomer from "./EditCustomer";
import DetailCustomer from "./DetailCustomer";
import LoadingData from "src/layouts/loading/LoadingData";
import { Scrollbar } from "src/components/ScrollBar";
import { columns } from "./Columns";
import CustomDataGrid from "src/components/data-grid/CustomDataGrid";

export const CustomersTable = (props) => {
  const { items = [], loading = false, fetchData = () => {} } = props;

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

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            {loading ? (
              <LoadingData />
            ) : items && items.length > 0 ? (
              <CustomDataGrid
                items={items}
                columns={columns({
                  handleOpenModalDetail,
                  handleOpenModalDelete,
                  handleOpenModalEdit,
                })}
              />
            ) : (
              <p>No data available</p>
            )}
          </Box>
        </Scrollbar>
      </Card>

      <DeleteCustomer
        isModalDeleteCustomer={isModalDeleteCustomer}
        setIsModalDeleteCustomer={setIsModalDeleteCustomer}
        currentId={parseInt(currentId)}
        fetchData={fetchData}
      />
      <EditCustomer
        isModalEditCustomer={isModalEditCustomer}
        setIsModalEditCustomer={setIsModalEditCustomer}
        currentId={parseInt(currentId)}
        fetchData={fetchData}
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
