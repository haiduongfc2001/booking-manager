import PropTypes from "prop-types";
import { Box, Card, Typography } from "@mui/material";
import { useState } from "react";
import DeleteStaff from "./delete-staff";
import EditStaff from "./edit-staff";
import DetailStaff from "./detail-staff";
import LoadingData from "src/layouts/loading/loading-data";
import { Scrollbar } from "src/components/scroll-bar";
import { columns } from "./columns";
import CustomDataGrid from "src/components/data-grid/custom-data-grid";
import { ErrorOutline } from "@mui/icons-material";

export const StaffTable = (props) => {
  const { items = [], loading = false, onRefresh = () => {} } = props;

  const [currentId, setCurrentId] = useState("");
  const [isModalDeleteStaff, setIsModalDeleteStaff] = useState(false);
  const [isModalEditStaff, setIsModalEditStaff] = useState(false);
  const [isModalDetailStaff, setIsModalDetailStaff] = useState(false);

  const handleOpenModalDetail = (id) => {
    setCurrentId(id);
    setIsModalDetailStaff(true);
  };

  const handleOpenModalDelete = (id) => {
    setCurrentId(id);
    setIsModalDeleteStaff(true);
  };

  const handleOpenModalEdit = (id) => {
    setCurrentId(id);
    setIsModalEditStaff(true);
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
                rows={items}
                columns={columns({
                  handleOpenModalDetail,
                  handleOpenModalDelete,
                  handleOpenModalEdit,
                })}
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

      <DeleteStaff
        isModalDeleteStaff={isModalDeleteStaff}
        setIsModalDeleteStaff={setIsModalDeleteStaff}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />
      <EditStaff
        isModalEditStaff={isModalEditStaff}
        setIsModalEditStaff={setIsModalEditStaff}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />
      <DetailStaff
        isModalDetailStaff={isModalDetailStaff}
        setIsModalDetailStaff={setIsModalDetailStaff}
        currentId={parseInt(currentId)}
      />
    </>
  );
};

StaffTable.propTypes = {
  items: PropTypes.array,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
};
