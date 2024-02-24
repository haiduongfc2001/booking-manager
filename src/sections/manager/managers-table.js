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
import { DATAGRID_OPTIONS } from "src/constant/constants";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import DeleteManager from "./modal-delete";
import { useState } from "react";
import EditManager from "./modal-edit";
import DetailManager from "./modal-detail";

// The table displays the list of managers
export const ManagersTable = (props) => {
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
  const [isModalDeleteManager, setIsModalDeleteManager] = useState(false);
  const [isModalEditManager, setIsModalEditManager] = useState(false);
  const [isModalDetailManager, setIsModalDetailManager] = useState(false);

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const handleConfirmDelete = (id) => {
    setCurrentId(id);
    setIsModalDeleteManager(true);
  };

  const handleOpenModalEdit = (id) => {
    setCurrentId(id);
    setIsModalEditManager(true);
  };

  const handleOpenModalDetail = (id) => {
    setCurrentId(id);
    setIsModalDetailManager(true);
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
                  <TableCell>Tên người dùng</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Khách sạn quản lý</TableCell>
                  <TableCell>Ngày đăng ký</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((manager) => {
                  const isSelected = selected.includes(manager.id);
                  const created_at = format(new Date(manager.created_at), "hh:mm:ss dd/MM/yyyy");

                  return (
                    <TableRow hover key={manager.id} selected={isSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(manager.id);
                            } else {
                              onDeselectOne?.(manager.id);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack alignItems="center" direction="row" spacing={2}>
                          <Avatar src={manager.avatar_url}>{getInitials(manager.full_name)}</Avatar>
                          <Box>
                            <Tooltip title="Xem chi tiết">
                              <Typography
                                variant="subtitle1"
                                onClick={() => handleOpenModalDetail(manager.id)}
                                sx={{ cursor: "pointer" }}
                              >
                                {manager.full_name}
                              </Typography>
                            </Tooltip>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              sx={{ fontStyle: "italic" }}
                            >
                              {manager.username}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{manager.email}</TableCell>
                      <TableCell>{manager.phone}</TableCell>
                      <TableCell>{manager.hotel_id}</TableCell>
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
                          onClick={() => handleConfirmDelete(manager.id)}
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
                          onClick={() => handleOpenModalEdit(manager.id)}
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
          rowsPerPageOptions={DATAGRID_OPTIONS.PAGE_SIZE_OPTIONS}
        />
      </Card>

      <DeleteManager
        isModalDeleteManager={isModalDeleteManager}
        setIsModalDeleteManager={setIsModalDeleteManager}
        currentId={parseInt(currentId)}
      />

      <EditManager
        isModalEditManager={isModalEditManager}
        setIsModalEditManager={setIsModalEditManager}
        currentId={parseInt(currentId)}
      />

      <DetailManager
        isModalDetailManager={isModalDetailManager}
        setIsModalDetailManager={setIsModalDetailManager}
        currentId={parseInt(currentId)}
      />
    </>
  );
};

ManagersTable.propTypes = {
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
