import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { DATAGRID_OPTIONS } from "src/constant/constants";

const CustomDataGrid = ({ rows = [], columns = [], onRowClick }) => {
  const handleRowClick = (params) => {
    if (onRowClick) {
      onRowClick(params.row);
    }
  };

  return (
    <DataGrid
      rows={rows}
      columns={columns.map((column) => ({
        ...column,
        headerName: column.headerName.toUpperCase(),
        headerClassName: "super-app-theme--header",
      }))}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: DATAGRID_OPTIONS.PAGE_SIZE,
          },
        },
      }}
      onRowClick={handleRowClick}
      pageSizeOptions={DATAGRID_OPTIONS.PAGE_SIZE_OPTIONS}
      rowHeight={DATAGRID_OPTIONS.ROW_HEIGHT}
      sx={{
        height: DATAGRID_OPTIONS.TABLE_HEIGHT,
        width: "100%",
        "& .super-app-theme--header": {
          backgroundColor: "rgb(248, 249, 250)",
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            justifyContent: "center",
          },
        },
        boxShadow: 2,
        // border: 2,
        // borderColor: "text.tertiary",
        // borderRadius: "8px",
        "& .MuiDataGrid-cell:hover": {
          color: "text.tertiary",
        },
      }}
      hideFooterSelectedRowCount
      // pagination
      // rowCount={count}
      // onPageChange={onPageChange}
      // rowsPerPageOptions={DATAGRID_OPTIONS.PAGE_SIZE_OPTIONS}
      // onPageSizeChange={onRowsPerPageChange}
      // checkboxSelection
      // selectionModel={selected}
      // onSelectionModelChange={(newSelection) => {
      //   if (newSelection.selectionModel) {
      //     onSelectAll?.();
      //   } else {
      //     onDeselectAll?.();
      //   }
      // }}
    />
  );
};

export default CustomDataGrid;
