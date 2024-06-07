import { Button, Stack, Tooltip, SvgIcon } from "@mui/material";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import { SeverityPill } from "src/components/severity-pill";
import { StatusMapRoom } from "src/components/status-map";
import dayjs from "dayjs";
import { ROOM_STATUS } from "src/constant/constants";

export const columns = ({ handleOpenModalDetail, handleOpenModalDelete, handleOpenModalEdit }) => {
  return [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      align: "center",
      renderCell: (params) => params.row.id,
    },
    {
      field: "number",
      headerName: "Mã phòng",
      width: 150,
      align: "center",
      renderCell: (params) => params.row.number,
    },
    {
      field: "description",
      headerName: "Mô tả",
      width: 250,
      align: "left",
      renderCell: (params) => params.row.description,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <SeverityPill color={StatusMapRoom[params.row.status]}>
          {params.row.status === ROOM_STATUS.AVAILABLE ? "Đang có sẵn" : "Hết phòng"}
        </SeverityPill>
      ),
    },
    {
      field: "created_at",
      headerName: "Ngày tạo",
      width: 150,
      align: "center",
      renderCell: (params) => {
        const createdAt = dayjs(params.row.created_at);
        return createdAt.isValid() ? createdAt.format("HH:mm:ss DD/MM/YYYY") : "";
      },
    },
    {
      field: "updated_at",
      headerName: "Cập nhật lần cuối",
      width: 180,
      align: "center",
      renderCell: (params) => {
        const updatedAt = dayjs(params.row.updated_at);
        return updatedAt.isValid() ? updatedAt.format("HH:mm:ss DD/MM/YYYY") : "";
      },
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
              onClick={handleOpenModalEdit}
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
