import PropTypes from "prop-types";
import { Box, Card, Typography } from "@mui/material";
import { useState } from "react";
import DeleteCustomer from "./delete-customer";
import UpdateCustomer from "./update-customer";
import DetailCustomer from "./detail-customer";
import { Scrollbar } from "src/components/scroll-bar";
import { columns } from "./columns";
import CustomDataGrid from "src/components/data-grid/custom-data-grid";
import { ErrorOutline } from "@mui/icons-material";

export const CustomerTable = (props) => {
  const { items = [], onRefresh = () => {} } = props;

  const [currentId, setCurrentId] = useState("");
  const [isModalDeleteCustomer, setIsModalDeleteCustomer] = useState(false);
  const [isModalUpdateCustomer, setIsModalUpdateCustomer] = useState(false);
  const [isModalDetailCustomer, setIsModalDetailCustomer] = useState(false);

  const handleRowClick = (params) => {
    const clickedItem = items?.find((item) => item.id === params.id);
    if (clickedItem) {
      setCurrentId(clickedItem?.id);
    } else {
      console.log("Item not found!");
    }
  };

  const handleOpenModalDetail = () => {
    setIsModalDetailCustomer(true);
  };

  const handleOpenModalDelete = () => {
    setIsModalDeleteCustomer(true);
  };

  const handleOpenModalUpdate = () => {
    setIsModalUpdateCustomer(true);
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ width: "100%" }}>
            {items?.length > 0 ? (
              <CustomDataGrid
                rows={items}
                columns={columns({
                  handleOpenModalDetail,
                  handleOpenModalDelete,
                  handleOpenModalUpdate,
                })}
                onRowClick={handleRowClick}
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
                  Không có dữ liệu!
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
      <UpdateCustomer
        isModalUpdateCustomer={isModalUpdateCustomer}
        setIsModalUpdateCustomer={setIsModalUpdateCustomer}
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

CustomerTable.propTypes = {
  items: PropTypes.array,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
};
