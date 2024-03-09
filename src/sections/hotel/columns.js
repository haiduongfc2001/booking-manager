import { format } from "date-fns";
import { Avatar, Button, Stack, Typography, Tooltip, SvgIcon } from "@mui/material";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import { getInitials } from "src/utils/GetInitials";

export const columns = ({ handleOpenModalDetail, handleOpenModalDelete, handleOpenModalEdit }) => {
  return [
    {
      field: "id",
      headerName: "ID",
      flex: 0.05,
      align: "center",
    },
    {
      field: "name",
      headerName: "Tên khách sạn",
      flex: 0.2,
      align: "left",
      renderCell: (params) => (
        <Stack display="flex" alignItems="center" direction="row" spacing={2}>
          <Avatar src={params.row.images.length > 0 ? params.row.images[0].url : ""}>
            {getInitials(params.row.name)}
          </Avatar>
          <Tooltip title="Xem chi tiết">
            <Typography
              variant="subtitle1"
              onClick={() => handleOpenModalDetail(params.row.id)}
              sx={{ cursor: "pointer" }}
            >
              {params.row.name}
            </Typography>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      flex: 0.125,
      align: "left",
    },
    {
      field: "description",
      headerName: "Mô tả",
      flex: 0.2,
      align: "left",
    },
    {
      field: "contact",
      headerName: "Liên hệ",
      flex: 0.125,
      align: "right",
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
            onClick={() => handleOpenModalDelete(params.row.id)}
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
};
