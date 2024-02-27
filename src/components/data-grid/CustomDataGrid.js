import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { DATAGRID_OPTIONS } from "src/constant/Constants";

const CustomDataGrid = ({ rows = [], columns = [], tableState }) => {
  return (
    <DataGrid
      rows={rows}
      columns={columns.map((column) => ({
        ...column,
        headerName: column.headerName.toUpperCase(),
        headerClassName: "super-app-theme--header",
      }))}
      pageSizeOptions={DATAGRID_OPTIONS.PAGE_SIZE_OPTIONS}
      rowHeight={DATAGRID_OPTIONS.ROW_HEIGHT}
      sx={{
        height: DATAGRID_OPTIONS.TABLE_HEIGHT,
        width: "100%",
        "& .super-app-theme--header": {
          backgroundColor: "rgb(248, 249, 250)",
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
      apiRef={tableState.apiRef}
      initialState={{
        ...tableState.selectedState,
        pagination: {
          paginationModel: {
            pageSize: DATAGRID_OPTIONS.PAGE_SIZE,
          },
        },
      }}
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
