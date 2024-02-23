import { format } from "date-fns";
import { Avatar, Box, Button, Stack, Typography, Tooltip, SvgIcon } from "@mui/material";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import { SeverityPill } from "src/components/severity-pill";
import { getInitials } from "src/utils/get-initials";
import { statusMap } from "src/components/status-map";

export const columns = [
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
      <Stack align="center" direction="row" spacing={2}>
        <Avatar src={params.row.avatar_url}>{getInitials(params.row.full_name)}</Avatar>
        <Box>
          <Tooltip title="Xem chi tiết">
            <Typography
              variant="subtitle1"
              onClick={() => handleOpenModalDetail(params.row.id)}
              sx={{ cursor: "pointer" }}
            >
              {params.row.full_name}
            </Typography>
          </Tooltip>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontStyle: "italic" }}>
            {params.row.username}
          </Typography>
        </Box>
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
    field: "is_verified",
    headerName: "Trạng thái",
    flex: 0.125,
    align: "center",
    renderCell: (params) => (
      <SeverityPill color={statusMap[params.row.is_verified]}>
        {params.row.is_verified ? "Đã xác thực" : "Chưa xác thực"}
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
          onClick={() => handleConfirmDelete(params.row.id)}
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
          onClick={() => handleOpenModalEdit(params.row.id)}
        />
      </Stack>
    ),
  },
];
