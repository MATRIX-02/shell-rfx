import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ActionMenuItem,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
  MRT_EditActionButtons,
} from "material-react-table";
import { Box, IconButton, Tooltip, TextField, MenuItem } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import useFormApi from "hooks/MasterData/useForms";
import { mkConfig, generateCsv, download } from "export-to-csv";
import {
  Add as AddIcon,
  Delete,
  Edit,
  FileDownload,
  FilePresent as FileUpload,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { showSnackbar } from "store/modules/SnackBar/snackbarSlice";
import FileUploadDialog from "./FileUploadDialog";
import { IconTableImport, IconTableExport } from "@tabler/icons-react";

const Forms = () => {
  const {
    loading,
    error,
    getAllForms,
    deleteForm,
    createForm,
    updateCategory,
  } = useFormApi();
  const [forms, setForms] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await getAllForms();
      setForms(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      dispatch(
        showSnackbar({
          message: `Failed to fetch forms!`,
          severity: "error",
        })
      );
    }
  };

  const handleCreateNewForm = async ({ values, table }) => {
    const newValidationErrors = validateForm(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      console.log("Validation errors:", newValidationErrors);
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});

    try {
      await createForm(values);
      setForms([values, ...forms]);
      dispatch(
        showSnackbar({
          message: `Form created successfully!`,
          severity: "success",
        })
      );
      table.setCreatingRow(null);
    } catch (err) {
      console.error("Create error:", err);
      dispatch(
        showSnackbar({
          message: `Error creating form!`,
          severity: "error",
        })
      );
    }
  };

  const handleDeleteForm = async (formId) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await deleteForm(formId);
        dispatch(
          showSnackbar({
            message: `Form deleted successfully!`,
            severity: "success",
          })
        );
        fetchForms();
      } catch (err) {
        console.error("Delete error:", err);
        dispatch(
          showSnackbar({
            message: `Failed to delete form!`,
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
        accessorKey: "form_id",
        header: "Form ID",
        size: 190,
        enableEditing: (row) => isAdding,
      },
      {
        accessorKey: "form_description",
        header: "Form Description",
        size: 450,
        enableEditing: true,
      },
      {
        accessorKey: "category",
        header: "Category",
        size: 160,
        enableEditing: true,
      },
      {
        accessorKey: "country",
        header: "Country",
        size: 150,
        enableEditing: true,
      },
      {
        accessorKey: "supplier_name",
        header: "Supplier Name",
        size: 190,
        enableEditing: true,
      },
      {
        accessorKey: "supplier_id",
        header: "Supplier ID",
        size: 170,
        enableEditing: (row) => isAdding,
      },
      {
        accessorKey: "parent_category",
        header: "Parent Category",
        size: 210,
        enableEditing: true,
      },
    ],
    [isAdding]
  );

  const validateForm = (values) => {
    const errors = {};
    if (!values.form_id) errors.form_id = "Form ID is required";
    if (!values.form_description)
      errors.form_description = "Form Description is required";
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
    data: forms,
    enableColumnOrdering: true,
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
      placeholder: `Search forms`,
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
        {/* <MRT_ToggleGlobalFilterButton table={table} /> */}
        <Tooltip title="Create New Form">
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
    onCreatingRowSave: handleCreateNewForm,
    onEditingRowCancel: () => {
      setIsAdding(false);
    },
    onEditingRow: () => {
      setIsAdding(false);
    },
    onEditingRowSave: async ({ table, values, row }) => {
      try {
        await updateCategory(row.original.form_id, values);
        dispatch(
          showSnackbar({
            message: `Form updated successfully!`,
            severity: "success",
          })
        );
        // Update the forms state with the new values
        setForms((prevForms) =>
          prevForms.map((form) =>
            form.form_id === values.form_id ? values : form
          )
        );
        table.setEditingRow(null); // exit editing mode
        setIsAdding(false);
      } catch (err) {
        console.error("Update error:", err);
        dispatch(
          showSnackbar({
            message: `Failed to update form!`,
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
          handleDeleteForm(row.original.form_id);
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
      title="Forms"
      caption="Create and manage essential business forms to streamline workflows and documentatio"
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

export default Forms;
