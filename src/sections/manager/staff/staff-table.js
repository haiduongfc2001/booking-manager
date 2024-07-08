import PropTypes from "prop-types";
import { Box, Card, Typography } from "@mui/material";
import { useState } from "react";
import DeleteStaff from "./delete-staff";
import UpdateStaff from "./update-staff";
import DetailStaff from "./detail-staff";
import { Scrollbar } from "src/components/scroll-bar";
import { columns } from "./columns";
import CustomDataGrid from "src/components/data-grid/custom-data-grid";
import { ErrorOutline } from "@mui/icons-material";
import { useSelector } from "react-redux";

export const StaffTable = (props) => {
  const { items = [], onRefresh = () => {} } = props;

  const [currentId, setCurrentId] = useState("");
  const [isModalDeleteStaff, setIsModalDeleteStaff] = useState(false);
  const [isModalUpdateStaff, setIsModalUpdateStaff] = useState(false);
  const [isModalDetailStaff, setIsModalDetailStaff] = useState(false);

  const hotel_id = useSelector((state) => state.auth.hotel_id);
  const staff_id = useSelector((state) => state.auth.user_id);

  const handleRowClick = (params) => {
    const clickedItem = items?.find((item) => item.id === params.id);
    if (clickedItem) {
      setCurrentId(clickedItem?.id);
    } else {
      console.log("Item not found!");
    }
  };

  const handleOpenModalDetail = () => {
    setIsModalDetailStaff(true);
  };

  const handleOpenModalDelete = () => {
    setIsModalDeleteStaff(true);
  };

  const handleOpenModalUpdate = () => {
    setIsModalUpdateStaff(true);
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
                  staff_id,
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

      <DeleteStaff
        isModalDeleteStaff={isModalDeleteStaff}
        setIsModalDeleteStaff={setIsModalDeleteStaff}
        hotelId={parseInt(hotel_id)}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />
      <UpdateStaff
        isModalUpdateStaff={isModalUpdateStaff}
        setIsModalUpdateStaff={setIsModalUpdateStaff}
        hotelId={parseInt(hotel_id)}
        currentId={parseInt(currentId)}
        onRefresh={onRefresh}
      />
      <DetailStaff
        isModalDetailStaff={isModalDetailStaff}
        setIsModalDetailStaff={setIsModalDetailStaff}
        hotelId={parseInt(hotel_id)}
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
