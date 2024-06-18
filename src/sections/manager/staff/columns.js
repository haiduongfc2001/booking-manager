import { format } from "date-fns";
import { Avatar, Button, Stack, Typography, Tooltip, SvgIcon } from "@mui/material";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import { getInitials } from "src/utils/get-initials";
import { SeverityPill } from "src/components/severity-pill";
import { StatusMapRole } from "src/components/status-map";
import { ROLE } from "src/constant/constants";

export const columns = ({ handleOpenModalDetail, handleOpenModalDelete, handleOpenModalEdit }) => {
  return [
    {
      field: "id",
      headerName: "ID",
      flex: 0.05,
      align: "center",
    },
    {
      field: "fullName",
      headerName: "Tên người dùng",
      flex: 0.2,
      align: "left",
      renderCell: (params) => (
        <Stack display="flex" alignItems="center" direction="row" spacing={2}>
          <Avatar src={params.row.avatar}>{getInitials(params.row.full_name)}</Avatar>
          <Tooltip title="Xem chi tiết">
            <Typography
              variant="subtitle1"
              onClick={handleOpenModalDetail}
              sx={{ cursor: "pointer" }}
            >
              {params.row.full_name}
            </Typography>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.2,
      align: "left",
    },
    {
      field: "phone",
      headerName: "Số điện thoại",
      flex: 0.125,
      align: "right",
    },
    {
      field: "role",
      headerName: "Chức vụ",
      flex: 0.125,
      align: "center",
      renderCell: (params) => (
        <SeverityPill color={StatusMapRole[params.row?.role]}>
          {params.row?.role === ROLE.MANAGER ? "Quản lý" : "Lễ tân"}
        </SeverityPill>
      ),
    },
    {
      field: "created_at",
      headerName: "Ngày đăng ký",
      flex: 0.15,
      align: "right",
      renderCell: (params) => format(new Date(params.row.created_at), "hh:mm:ss dd/MM/yyyy"),
    },
    {
      field: "actions",
      headerName: "Hành động",
      flex: 0.15,
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
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
              "& .MuiButton-startIcon": { m: 0 },
            }}
            onClick={handleOpenModalDelete}
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
              "& .MuiButton-startIcon": { m: 0 },
            }}
            onClick={handleOpenModalEdit}
          />
        </Stack>
      ),
    },
  ];
};
