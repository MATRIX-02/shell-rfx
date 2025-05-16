import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import { Box, IconButton, Tooltip, MenuItem, Checkbox } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import useCostCenterApi from "hooks/MasterData/useCostCenter";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Add as AddIcon, Delete } from "@mui/icons-material";
import { IconTableImport, IconTableExport } from "@tabler/icons-react";

import { useDispatch } from "react-redux";
import { showSnackbar } from "store/modules/SnackBar/snackbarSlice";
import FileUploadDialog from "./FileUploadDialog";

const CostCenter = () => {
  const {
    loading,
    error,
    getAllCostCenters,
    deleteCostCenter,
    createCostCenter,
    updateCostCenter,
  } = useCostCenterApi();
  const [costCenters, setCostCenters] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCostCenters();
  }, []);

  const fetchCostCenters = async () => {
    try {
      const response = await getAllCostCenters();
      setCostCenters(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      dispatch(
        showSnackbar({
          message: `Failed to fetch cost centers!`,
          severity: "error",
        })
      );
    }
  };

  const handleCreateNewCostCenter = async ({ values }) => {
    const newValidationErrors = validateCostCenter(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      console.log("Validation errors:", newValidationErrors);
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});

    values.active = Boolean(values.active);

    try {
      await createCostCenter(values);
      setCostCenters([...costCenters, values]);
      dispatch(
        showSnackbar({
          message: `Cost center created successfully!`,
          severity: "success",
        })
      );
      table.setCreatingRow(null);
    } catch (err) {
      console.error("Create error:", err);
      dispatch(
        showSnackbar({
          message: `Error creating cost center!`,
          severity: "error",
        })
      );
    }
  };

  const handleDeleteCostCenter = async (costCenterNumber) => {
    if (window.confirm("Are you sure you want to delete this cost center?")) {
      try {
        await deleteCostCenter(costCenterNumber);
        dispatch(
          showSnackbar({
            message: `Cost center deleted successfully!`,
            severity: "success",
          })
        );
        fetchCostCenters();
      } catch (err) {
        console.error("Delete error:", err);
        dispatch(
          showSnackbar({
            message: `Failed to delete cost center!`,
            severity: "error",
          })
        );
      }
    }
  };

  const handleFileUploadClick = () => {
    setUploadDialogOpen(true);
  };

  const handleFileUpload = (files) => {
    console.log("Uploaded files:", files);
    setUploadDialogOpen(false);
    // Handle file upload logic here
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "cost_center_number",
        header: "Cost Center Number",
        size: 190,
        enableEditing: (row) => isAdding,
      },
      {
        accessorKey: "cost_center_name",
        header: "Cost Center Name",
        size: 250,
        enableEditing: true,
      },
      {
        accessorKey: "company",
        header: "Company",
        size: 180,
        enableEditing: true,
      },
      {
        accessorKey: "department",
        header: "Department",
        size: 180,
        enableEditing: true,
      },
      {
        accessorKey: "owner",
        header: "Owner",
        size: 150,
        enableEditing: true,
      },
      {
        accessorKey: "erp_system",
        header: "ERP System",
        size: 150,
        enableEditing: true,
      },
      {
        accessorKey: "budget_allocated",
        header: "Budget Allocated",
        size: 170,
        muiEditTextFieldProps: {
          type: "number",
        },
        enableEditing: true,
      },
      {
        accessorKey: "budget_available",
        header: "Budget Available",
        size: 170,
        muiEditTextFieldProps: {
          type: "number",
        },
        enableEditing: true,
      },
      {
        accessorKey: "active",
        header: "Active",
        size: 100,
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
        enableEditing: true,
        muiEditTextFieldProps: {
          type: "checkbox",
          InputProps: {
            disableUnderline: true,
          },
        },
      },
      {
        accessorKey: "created_by",
        header: "Created By",
        size: 150,
        enableEditing: true,
      },
      {
        accessorKey: "creation_date",
        header: "Created Date",
        muiEditTextFieldProps: {
          type: "date",
        },
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue());
          const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`;
          return formattedDate;
        },
        size: 150,
        enableEditing: true,
      },
      {
        accessorKey: "last_modified_date",
        header: "Last Modified Date",
        size: 150,
        muiEditTextFieldProps: {
          type: "date",
        },
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue());
          const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`;
          return formattedDate;
        },
        enableEditing: true,
      },
      {
        accessorKey: "last_modified_by",
        header: "Last Modified By",

        size: 150,
        enableEditing: true,
      },
    ],
    [isAdding]
  );

  const validateCostCenter = (values) => {
    const errors = {};
    return errors;
  };

  const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data: costCenters,
    enableBottomToolbar: true,
    positionActionsColumn: "last",
    enableColumnPinning: true,
    initialState: {
      showGlobalFilter: true,
      columnPinning: { right: ["mrt-row-actions"] },
    },
    enablePagination: true,
    enableGlobalFilterModes: true,
    globalFilterFn: ["contains"],
    positionGlobalFilter: "left",
    muiSearchTextFieldProps: {
      placeholder: `Search cost centers`,
      sx: { minWidth: "300px" },
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "primary",
      shape: "rounded",
      showRowsPerPage: false,
      variant: "outlined",
    },
    paginationDisplayMode: "pages",
    renderToolbarInternalActions: ({ table }) => (
      <Box>
        <Tooltip title="Create New Cost Center">
          <IconButton
            onClick={() => {
              setIsAdding(true);
              table.setCreatingRow(true);
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Export All Rows">
          <IconButton
            onClick={() =>
              handleExportRows(table.getPrePaginationRowModel().rows)
            }
          >
            <IconTableExport />
          </IconButton>
        </Tooltip>
        <Tooltip title="Import CSV">
          <IconButton onClick={handleFileUploadClick}>
            <IconTableImport />
          </IconButton>
        </Tooltip>
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
      </Box>
    ),
    onCreatingRowCancel: () => {
      setValidationErrors({});
      setIsAdding(false);
    },
    onCreatingRowChange: () => {
      setIsAdding(true);
    },
    onCreatingRowSave: handleCreateNewCostCenter,
    onEditingRowCancel: () => {
      setIsAdding(false);
    },
    onEditingRow: () => {
      setIsAdding(false);
    },
    onEditingRowSave: async ({ row, values, exitEditingMode }) => {
      const updatedValues = {
        ...values,
        active: Boolean(values.active),
      };

      try {
        await updateCostCenter(row.original.cost_center_number, updatedValues);
        dispatch(
          showSnackbar({
            message: `Cost center updated successfully!`,
            severity: "success",
          })
        );
        setCostCenters((prevCostCenters) =>
          prevCostCenters.map((costCenter) =>
            costCenter.cost_center_number === updatedValues.cost_center_number
              ? updatedValues
              : costCenter
          )
        );
        exitEditingMode(); // Call this instead of table.setEditingRow(null)
      } catch (err) {
        console.error("Update error:", err);
        dispatch(
          showSnackbar({
            message: `Failed to update cost center!`,
            severity: "error",
          })
        );
      }
    },
    state: {
      isLoading: loading,
      showAlertBanner: error,
      showProgressBars: loading,
      showLoadingOverlay: false,
    },
    enableStickyHeader: true,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableRowActions: true,
    enableEditing: true,
    renderRowActionMenuItems: ({ row }) => [
      <MenuItem
        key="delete"
        onClick={() => {
          handleDeleteCostCenter(row.original.cost_center_number);
        }}
      >
        <Delete />
        Delete
      </MenuItem>,
    ],
    mrtTheme: (theme) => ({
      matchHighlightColor: "#FF9632",
    }),
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.original?._creating
          ? "rgba(25, 118, 210, 0.05)"
          : undefined,
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#f9f9f9",
        fontWeight: "400",
        color: "#000",
        fontSize: "1rem",
      },
    },
    muiTablePaperProps: {
      sx: {
        boxShadow: "none",
        position: "relative",
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: 600,
        minHeight: 600,
        border: "1px solid #ddd",
      },
    },
  });

  return (
    <MainCard
      title="Cost Centers"
      caption="Track and manage financial allocations across different cost centers for better budgeting"
    >
      <MaterialReactTable table={table} />
      <FileUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleFileUpload}
      />
    </MainCard>
  );
};

export default CostCenter;
