import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ActionMenuItem,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import { Box, IconButton, Tooltip, MenuItem } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import useCatalogs from "hooks/MasterData/useCatalogue";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Add as AddIcon, Delete, Edit } from "@mui/icons-material";
import { IconTableImport, IconTableExport } from "@tabler/icons-react";

import { useDispatch } from "react-redux";
import { showSnackbar } from "store/modules/SnackBar/snackbarSlice";
import FileUploadDialog from "./FileUploadDialog";

const Catalogs = () => {
  const {
    loading,
    error,
    createCatalog,
    deleteCatalog,
    getAllCatalogs,
    updateCatalog,
  } = useCatalogs();

  const [catalogs, setCatalogs] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    try {
      const response = await getAllCatalogs();
      setCatalogs(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      dispatch(
        showSnackbar({
          message: `Failed to fetch catalogs!`,
          severity: "error",
        })
      );
    }
  };

  const handleCreateNewCatalog = async ({ values, table }) => {
    const newValidationErrors = validateCatalog(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});

    values.unit_price = Number(values.unit_price);
    values.quantity = Number(values.quantity);
    values.lead_time = Number(values.lead_time);
    values.distance_miles = Number(values.distance_miles);
    values.base_rate_per_mile = Number(values.base_rate_per_mile);
    values.fuel_surcharge = Number(values.fuel_surcharge);
    values.detention_rate_per_hour = Number(values.detention_rate_per_hour);
    values.liftgate_service_rate = Number(values.liftgate_service_rate);

    try {
      await createCatalog(values);
      setCatalogs([values, ...catalogs]);
      dispatch(
        showSnackbar({
          message: `Catalog created successfully!`,
          severity: "success",
        })
      );
      fetchCatalogs();
      table.setCreatingRow(null); // Close the dialog
      setIsAdding(false);
    } catch (error) {
      dispatch(
        showSnackbar({
          message: `Error creating catalog!`,
          severity: "error",
        })
      );
    }
  };

  const handleDeleteCatalog = async (catalogId) => {
    if (window.confirm("Are you sure you want to delete this catalog?")) {
      try {
        await deleteCatalog(catalogId);
        dispatch(
          showSnackbar({
            message: `Catalog deleted successfully!`,
            severity: "success",
          })
        );
        fetchCatalogs();
      } catch (error) {
        dispatch(
          showSnackbar({
            message: `Error deleting catalog: ${error}`,
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

  const validateCatalog = (values) => {
    const errors = {};
    if (!values.supplier_name)
      errors.supplier_name = "Supplier Name is required";
    if (!values.product_name) errors.product_name = "Product Name is required";
    if (!values.unit_price || isNaN(values.unit_price)) {
      errors.unit_price = "Unit Price should be a valid number";
    }
    // Add more validation as needed
    return errors;
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "category",
        header: "Category",
        size: 190,
        enableEditing: true,
      },
      {
        accessorKey: "parent_category",
        header: "Parent Category",
        size: 170,
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
        size: 450,
        enableEditing: (row) => isAdding,
      },
      {
        accessorKey: "product_name",
        header: "Product Name",
        size: 160,
        enableEditing: true,
      },
      {
        accessorKey: "product_id",
        header: "Product ID",
        size: 150,
        enableEditing: (row) => isAdding,
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "specification",
        header: "Specification",
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "catalog_id",
        header: "Catalog ID",
        size: 210,
        enableEditing: (row) => isAdding,
      },
      {
        accessorKey: "unit_price",
        header: "Unit Price",
        muiEditTextFieldProps: {
          type: "number",
          required: true,
          error: !!validationErrors?.unit_price,
          helperText: validationErrors?.unit_price,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              unit_price: undefined,
            }),
        },
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        muiEditTextFieldProps: {
          type: "number",
          required: true,
          error: !!validationErrors?.quantity,
          helperText: validationErrors?.quantity,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              quantity: undefined,
            }),
        },
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "unit_of_measure",
        header: "Unit of Measure",
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "currency",
        header: "Currency",
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "lead_time",
        header: "Lead Time",
        muiEditTextFieldProps: {
          type: "number",
          required: true,
          error: !!validationErrors?.lead_time,
          helperText: validationErrors?.lead_time,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lead_time: undefined,
            }),
        },
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "service_name",
        header: "Service Name",
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "route",
        header: "Route",
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "equipment",
        header: "Equipment",
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "dimensions",
        header: "Dimensions",
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "distance_miles",
        header: "Distance Miles",
        muiEditTextFieldProps: {
          type: "number",
          required: true,
          error: !!validationErrors?.distance_miles,

          helperText: validationErrors?.distance_miles,

          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              distance_miles: undefined,
            }),
        },
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "base_rate_per_mile",
        header: "Base Rate Per Mile",

        muiEditTextFieldProps: {
          type: "number",
          required: true,
          error: !!validationErrors?.base_rate_per_mile,
          helperText: validationErrors?.base_rate_per_mile,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              base_rate_per_mile: undefined,
            }),
        },
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "fuel_surcharge",
        header: "Fuel Surcharge",
        size: 210,
        muiEditTextFieldProps: {
          type: "number",
          required: true,
          error: !!validationErrors?.fuel_surcharge,
          helperText: validationErrors?.fuel_surcharge,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              fuel_surcharge: undefined,
            }),
        },
        enableEditing: true,
      },
      {
        accessorKey: "detention_rate_per_hour",
        header: "Detention Rate Per Hour",
        muiEditTextFieldProps: {
          type: "number",
          required: true,
          error: !!validationErrors?.detention_rate_per_hour,
          helperText: validationErrors?.detention_rate_per_hour,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              detention_rate_per_hour: undefined,
            }),
        },
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "liftgate_service_rate",
        header: "Liftgate Service Rate",
        muiEditTextFieldProps: {
          type: "number",
          required: true,
          error: !!validationErrors?.liftgate_service_rate,
          helperText: validationErrors?.liftgate_service_rate,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              liftgate_service_rate: undefined,
            }),
        },
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "special_instructions",
        header: "Special Instructions",
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "additional_terms_and_conditions",
        header: "Additional Terms and Conditions",
        size: 210,
        enableEditing: true,
      },
      {
        accessorKey: "additional_services",
        header: "Additional Services",
        size: 210,
        enableEditing: true,
      },
    ],
    [isAdding, validationErrors]
  );

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
    data: catalogs,
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
      placeholder: `Search catalogs`,
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
        <Tooltip title="Create New Catalog">
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
    onCreatingRowSave: handleCreateNewCatalog,
    onEditingRowCancel: () => {
      setIsAdding(false);
    },
    onEditingRow: () => {
      setIsAdding(false);
    },
    onEditingRowSave: async ({ values, row, table }) => {
      try {
        await updateCatalog(row.original.catalog_id, values);
        dispatch(
          showSnackbar({
            message: `Catalog updated successfully!`,
            severity: "success",
          })
        );
        setCatalogs((prev) => {
          const updatedCatalogs = prev.map((catalog) => {
            if (catalog.catalog_id === row.original.catalog_id) {
              return { ...catalog, ...values };
            }
            return catalog;
          });
          return updatedCatalogs;
        });
        table.setEditingRow(null); // Close the dialog
        setIsAdding(false);
      } catch (err) {
        console.error("Update error:", err);
        dispatch(
          showSnackbar({
            message: `Failed to update catalog!`,
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
          handleDeleteCatalog(row.original.catalog_id);
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
      title="Catalogs"
      caption="Browse and organize your product offerings for enhanced visibility and accessibility"
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

export default Catalogs;
