import PropTypes from "prop-types";
import { format } from "date-fns";
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  SvgIcon,
  Tooltip,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { PAGE_OPTIONS } from "src/constant/constants";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import DeleteHotel from "./modal-delete";
import { useState } from "react";
import EditHotel from "./modal-edit";
import DetailHotel from "./modal-detail";

// The table displays the list of hotels
export const HotelsTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
  } = props;

  const [currentId, setCurrentId] = useState("");
  const [isModalDeleteHotel, setIsModalDeleteHotel] = useState(false);
  const [isModalEditHotel, setIsModalEditHotel] = useState(false);
  const [isModalDetailHotel, setIsModalDetailHotel] = useState(false);

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const handleConfirmDelete = (id) => {
    setCurrentId(id);
    setIsModalDeleteHotel(true);
  };

  const handleOpenModalEdit = (id) => {
    setCurrentId(id);
    setIsModalEditHotel(true);
  };

  const handleOpenModalDetail = (id) => {
    setCurrentId(id);
    setIsModalDetailHotel(true);
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAll}
                      indeterminate={selectedSome}
                      onChange={(event) => {
                        if (event.target.checked) {
                          onSelectAll?.();
                        } else {
                          onDeselectAll?.();
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>Tên khách sạn</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Ngày đăng ký</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((hotel) => {
                  const isSelected = selected.includes(hotel.hotel_id);
                  const created_at = format(new Date(hotel.created_at), "hh:mm:ss dd/MM/yyyy");

                  return (
                    <TableRow hover key={hotel.hotel_id} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(hotel.hotel_id);
                            } else {
                              onDeselectOne?.(hotel.hotel_id);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Avatar src={hotel.image}>{getInitials(hotel.hotel_name)}</Avatar>
                          <Box>
                            <Tooltip title="Xem chi tiết">
                              <Typography
                                variant="subtitle1"
                                onClick={() => handleOpenModalDetail(hotel.hotel_id)}
                                sx={{ cursor: "pointer" }}
                              >
                                {hotel.hotel_name}
                              </Typography>
                            </Tooltip>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{hotel.address}</TableCell>
                      <TableCell>{hotel.description}</TableCell>
                      <TableCell>{created_at}</TableCell>
                      <TableCell>
                        <Button
                          startIcon={
                            <SvgIcon fontSize="small">
                              <TrashIcon />
                            </SvgIcon>
                          }
                          size="small"
                          variant="contained"
                          color="error"
                          sx={{
                            m: 0.5,
                            "& .MuiButton-startIcon": {
                              m: 0,
                            },
                          }}
                          onClick={() => handleConfirmDelete(hotel.hotel_id)}
                        />
                        <Button
                          startIcon={
                            <SvgIcon fontSize="small">
                              <PencilIcon />
                            </SvgIcon>
                          }
                          size="small"
                          variant="contained"
                          sx={{
                            m: 0.5,
                            "& .MuiButton-startIcon": {
                              m: 0,
                            },
                          }}
                          onClick={() => handleOpenModalEdit(hotel.hotel_id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={PAGE_OPTIONS.ROW_PER_PAGE_OPTIONS}
        />
      </Card>

      <DeleteHotel
        isModalDeleteHotel={isModalDeleteHotel}
        setIsModalDeleteHotel={setIsModalDeleteHotel}
        currentId={parseInt(currentId)}
      />

      <EditHotel
        isModalEditHotel={isModalEditHotel}
        setIsModalEditHotel={setIsModalEditHotel}
        currentId={parseInt(currentId)}
      />

      <DetailHotel
        isModalDetailHotel={isModalDetailHotel}
        setIsModalDetailHotel={setIsModalDetailHotel}
        currentId={parseInt(currentId)}
      />
    </>
  );
};

HotelsTable.propTypes = {
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
