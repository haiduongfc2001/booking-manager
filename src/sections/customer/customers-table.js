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
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { getInitials } from "src/utils/get-initials";
import { PAGE_OPTIONS } from "src/utils/constants";
import { SeverityPill } from "src/components/severity-pill";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import DeleteCustomer from "./modal-delete";
import { useState } from "react";

export const CustomersTable = (props) => {
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

  const [isModalDeleteCustomer, setIsModalDeleteCustomer] = useState(false);
  const [currentId, setCurrentId] = useState("");

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;

  const statusMap = {
    true: "success",
    false: "error",
  };

  const handleConfirmDelete = (id) => {
    setIsModalDeleteCustomer(true);
    setCurrentId(id);
  };

  return (
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
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày đăng ký</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer) => {
                const isSelected = selected.includes(customer.id);
                const created_at = format(new Date(customer.created_at), "hh:mm:ss dd/MM/yyyy");

                return (
                  <TableRow hover key={customer.id} selected={isSelected}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(customer.id);
                          } else {
                            onDeselectOne?.(customer.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack alignItems="center" direction="row" spacing={2}>
                        <Avatar src={customer.avatar_url}>{getInitials(customer.full_name)}</Avatar>
                        <Box>
                          <Typography variant="subtitle1">{customer.full_name}</Typography>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ fontStyle: "italic" }}
                          >
                            {customer.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>
                      <SeverityPill color={statusMap[customer.is_verified]}>
                        {customer.is_verified ? "Đã xác thực" : "Chưa xác thực"}
                      </SeverityPill>
                    </TableCell>
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
                        onClick={() => handleConfirmDelete(customer.id)}
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

      <DeleteCustomer
        isModalDeleteCustomer={isModalDeleteCustomer}
        setIsModalDeleteCustomer={setIsModalDeleteCustomer}
        currentId={currentId}
      />
    </Card>
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
