import { format } from "date-fns";
import { Avatar, Button, Stack, Typography, Tooltip, SvgIcon } from "@mui/material";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import { getInitials } from "src/utils/get-initials";
import { capitalizeFirstLetter } from "src/utils/capitalize-letter";
import FormatNumber from "src/utils/format-number";

export const columns = ({ handleOpenModalDetail }) => {
  return [
    {
      field: "id",
      headerName: "ID",
      flex: 0.05,
      align: "center",
    },
    {
      field: "number",
      headerName: "Số phòng",
      flex: 0.2,
      align: "left",
      renderCell: (params) => (
        <Stack display="flex" alignItems="center" direction="row" spacing={2}>
          <Avatar
            src={
              params.row?.images?.find((image) => image.is_primary)?.url ||
              (params.row?.images?.length > 0 ? params.row?.images[0]?.url : "")
            }
          >
            {getInitials(params.row.number)}
          </Avatar>
          <Tooltip title="Xem chi tiết">
            <Typography
              variant="subtitle1"
              onClick={handleOpenModalDetail}
              sx={{ cursor: "pointer" }}
            >
              {params.row.number}
            </Typography>
          </Tooltip>
        </Stack>
      ),
    },
    {
      field: "type",
      headerName: "Loại phòng",
      flex: 0.125,
      align: "left",
      renderCell: (params) => (
        <Typography variant="subtitle1">{capitalizeFirstLetter(params.row?.type)}</Typography>
      ),
    },
    {
      field: "price",
      headerName: "Giá gốc",
      flex: 0.2,
      align: "right",
      renderCell: (params) => (
        <Typography variant="subtitle1">{FormatNumber(params.row?.price)}</Typography>
      ),
    },
    {
      field: "discount",
      headerName: "Giảm giá",
      flex: 0.125,
      align: "right",
      renderCell: (params) => (
        <Typography variant="subtitle1">{FormatNumber(params.row?.discount)}</Typography>
      ),
    },
    {
      field: "created_at",
      headerName: "Ngày tạo",
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
            // onClick={handleOpenModalDelete}
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
            // onClick={handleOpenModalEdit}
          />
        </Stack>
      ),
    },
  ];
};
