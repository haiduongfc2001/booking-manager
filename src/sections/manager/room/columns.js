import { Avatar, Button, Stack, Typography, Tooltip, SvgIcon } from "@mui/material";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import { getInitials } from "src/utils/get-initials";
import { capitalizeFirstLetter } from "src/utils/capitalize-letter";
import FormatNumber from "src/utils/format-number";
import { SeverityPill } from "src/components/severity-pill";
import { StatusMapRoom } from "src/components/status-map";
import RatingCircle from "./rating-circle";

export const columns = ({ handleOpenModalDetail, handleOpenModalDelete }) => {
  return [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      align: "center",
    },
    {
      field: "number",
      headerName: "Số phòng",
      width: 150,
      align: "left",
      renderCell: (params) => (
        <Stack display="flex" alignItems="center" direction="row" spacing={2}>
          <Avatar
            src={
              params.row?.images?.find((image) => image.is_primary)?.url ||
              (params.row?.images?.length > 0
                ? params.row?.images[0]?.url
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png")
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
      width: 100,
      align: "left",
      renderCell: (params) => (
        <Typography variant="subtitle1">{capitalizeFirstLetter(params.row?.type)}</Typography>
      ),
    },
    {
      field: "capacity",
      headerName: "Sức chứa",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <Avatar
          sx={{
            backgroundColor: (theme) => theme.palette.background.indigo["dark"],
            color: (theme) => theme.palette.background.indigo["lightest"],
          }}
        >
          {params.row?.capacity}
        </Avatar>
      ),
    },
    {
      field: "price",
      headerName: "Giá gốc",
      width: 150,
      align: "right",
      renderCell: (params) => (
        <Typography variant="subtitle1">{FormatNumber(params.row?.price)}</Typography>
      ),
    },
    {
      field: "discount",
      headerName: "Giảm giá",
      width: 150,
      align: "right",
      renderCell: (params) => (
        <Typography variant="subtitle1">{FormatNumber(params.row?.discount)}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <SeverityPill color={StatusMapRoom[params.row.status]}>
          {params.row.status === "available" ? "Đang có sẵn" : "Hết phòng"}
        </SeverityPill>
      ),
    },
    {
      field: "rating_average",
      headerName: "Đánh giá",
      width: 150,
      align: "center",
      renderCell: (params) => <RatingCircle rating={params.row.rating_average} />,
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 250,
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Xem chi tiết">
            <Button
              startIcon={
                <SvgIcon fontSize="small">
                  <EyeIcon />
                </SvgIcon>
              }
              size="small"
              variant="contained"
              color="success"
              sx={{
                "& .MuiButton-startIcon": { m: 0 },
              }}
              onClick={handleOpenModalDetail}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
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
          </Tooltip>
          <Tooltip title="Xóa">
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
          </Tooltip>
        </Stack>
      ),
    },
  ];
};
