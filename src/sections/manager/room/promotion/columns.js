import { Button, Stack, Tooltip, SvgIcon } from "@mui/material";
import EyeIcon from "@heroicons/react/24/solid/EyeIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import { SeverityPill } from "src/components/severity-pill";
import { StatusMap } from "src/components/status-map";
import dayjs from "dayjs";
import { DISCOUNT_TYPE, DISCOUNT_TYPE_TRANSLATE, ROOM_STATUS } from "src/constant/constants";
import formatCurrency from "src/utils/format-currency";

export const columns = ({
  handleOpenModalDetail,
  handleOpenModalDelete,
  handleOpenModalUpdate,
}) => {
  return [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      align: "center",
      renderCell: (params) => params.row.id,
    },
    {
      field: "code",
      headerName: "Mã khuyến mãi",
      width: 150,
      align: "left",
      renderCell: (params) => params.row.code,
    },
    {
      field: "discount_type",
      headerName: "Giảm giá theo",
      width: 200,
      align: "left",
      renderCell: (params) => {
        if (params.row.discount_type === DISCOUNT_TYPE.PERCENTAGE) {
          return DISCOUNT_TYPE_TRANSLATE.PERCENTAGE;
        } else if (params.row.discount_type === DISCOUNT_TYPE.FIXED_AMOUNT) {
          return DISCOUNT_TYPE_TRANSLATE.FIXED_AMOUNT;
        } else {
          return "";
        }
      },
    },
    {
      field: "discount_value",
      headerName: "Giá trị",
      width: 100,
      align: "right",
      renderCell: (params) => {
        if (params.row.discount_type === DISCOUNT_TYPE.PERCENTAGE) {
          return `${params.row.discount_value}%`;
        } else if (params.row.discount_type === DISCOUNT_TYPE.FIXED_AMOUNT) {
          return `${formatCurrency(params.row.discount_value)}`;
        } else {
          return "";
        }
      },
    },
    {
      field: "start_date",
      headerName: "Thời gian bắt đầu",
      width: 150,
      align: "center",
      renderCell: (params) => {
        const createdAt = dayjs(params.row.start_date);
        return createdAt.isValid() ? createdAt.format("HH:mm:ss DD/MM/YYYY") : "";
      },
    },
    {
      field: "end_date",
      headerName: "Thời gian kết thúc",
      width: 180,
      align: "center",
      renderCell: (params) => {
        const updatedAt = dayjs(params.row.end_date);
        return updatedAt.isValid() ? updatedAt.format("HH:mm:ss DD/MM/YYYY") : "";
      },
    },
    {
      field: "is_active",
      headerName: "Trạng thái",
      width: 160,
      align: "center",
      renderCell: (params) => (
        <SeverityPill color={StatusMap[params.row.is_active]}>
          {params.row.is_active === true ? "Đang hoạt động" : "Không hoạt động"}
        </SeverityPill>
      ),
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
              onClick={handleOpenModalUpdate}
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
