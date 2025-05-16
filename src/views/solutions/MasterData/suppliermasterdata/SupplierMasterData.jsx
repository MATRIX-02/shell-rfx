import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import {
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import { Add as AddIcon, Delete, Edit } from "@mui/icons-material";
import { IconTableImport, IconTableExport } from "@tabler/icons-react";

import useSupplierMasterData from "hooks/useSupplierMasterData";
import axios from "axios";
import { MASTER_DATA } from "store/constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { mkConfig, generateCsv, download } from "export-to-csv";
import FileUploadDialog from "./FileUploadDialog";

const SupplierMasterData = () => {
  const { supplierMasterData } = useSupplierMasterData();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newRow, setNewRow] = useState({
    supplier_id: "",
    supplier_name: "",
    country: "",
    city: "",
    zip_code: 0,
    contact_number: "",
    email: "",
    financial_score: 0,
    sustainability_score: 0,
    minority_supplier: false,
    language: "",
    state: "",
    company_url: "",
  });

  useEffect(() => {
    if (supplierMasterData) {
      const transformedData = supplierMasterData.map((item, index) => ({
        id: index + 1,
        ...item,
      }));
      setData(transformedData);
      setLoading(false);
    }
  }, [supplierMasterData]);

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

  const handleFileUploadClick = () => {
    setUploadDialogOpen(true);
  };

  const handleFileUpload = (files) => {
    console.log("Uploaded files:", files);
    setUploadDialogOpen(false);
  };

  // Dialog handling functions from the first file
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewRow({
      supplier_id: "",
      supplier_name: "",
      country: "",
      city: "",
      zip_code: 0,
      contact_number: "",
      email: "",
      financial_score: 0,
      sustainability_score: 0,
      minority_supplier: false,
      language: "",
      state: "",
      company_url: "",
    });
  };

  const handleNewRowChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewRow((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddRow = async () => {
    try {
      const response = await axios.post(
        `${MASTER_DATA}/supplierMasterData/createSupplier`,
        newRow
      );
      setData([...data, { ...newRow, id: data.length + 1 }]);
      handleCloseAddDialog();
      toast.success(`New supplier added: ${newRow.supplier_name}`);
    } catch (error) {
      console.error("Error adding row:", error);
      toast.error("Failed to add new supplier");
    }
  };

  const handleEditRow = (row) => {
    setEditedRow(row);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditedRow(null);
  };

  const handleEditedRowChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditedRow((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveEditedRow = async () => {
    try {
      const response = await axios.put(
        `${MASTER_DATA}/supplierMasterData/updateSupplier/${editedRow.supplier_id}`,
        editedRow
      );
      setData((prevData) =>
        prevData.map((item) => (item.id === editedRow.id ? editedRow : item))
      );
      handleCloseEditDialog();
      toast.success(`Supplier ${editedRow.supplier_name} updated`);
    } catch (error) {
      console.error("Error updating row:", error);
      toast.error("Failed to update supplier");
    }
  };

  const handleDeleteSupplier = async (row) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await axios.delete(
          `${MASTER_DATA}/supplierMasterData/deleteSupplier/${row.supplier_id}`
        );
        setData((prevData) => prevData.filter((item) => item.id !== row.id));
        toast.success(`Supplier ${row.supplier_name} deleted`);
      } catch (error) {
        console.error("Error deleting supplier:", error);
        toast.error("Failed to delete supplier");
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "supplier_id",
        header: "Supplier ID",
        size: 150,
      },
      {
        accessorKey: "supplier_name",
        header: "Supplier Name",
        size: 200,
      },
      {
        accessorKey: "city",
        header: "City",
        size: 150,
      },
      {
        accessorKey: "state",
        header: "State",
        size: 180,
      },
      {
        accessorKey: "zip_code",
        header: "ZIP Code",
        size: 120,
      },
      {
        accessorKey: "country",
        header: "Country",
        size: 150,
      },

      {
        accessorKey: "contact_number",
        header: "Contact Number",
        size: 150,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "financial_score",
        header: "Financial Score",
        size: 150,
      },
      {
        accessorKey: "sustainability_score",
        header: "Sustainability Score",
        size: 180,
      },
      {
        accessorKey: "minority_supplier",
        header: "Minority Supplier",
        size: 150,
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
      },
      {
        accessorKey: "language",
        header: "Language",
        size: 180,
      },

      {
        accessorKey: "company_url",
        header: "Company URL",
        size: 180,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
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
      placeholder: `Search suppliers`,
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
        <Tooltip title="Create New Supplier">
          <IconButton onClick={handleOpenAddDialog}>
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
    state: {
      isLoading: loading,
      showAlertBanner: error,
      showProgressBars: loading,
    },
    enableStickyHeader: true,
    // enableEditing: true,
    editDisplayMode: "modal",
    enableRowActions: true,
    renderRowActionMenuItems: ({ row }) => [
      <MenuItem key="edit" onClick={() => handleEditRow(row.original)}>
        <Edit />
        Edit
      </MenuItem>,
      <MenuItem key="delete" onClick={() => handleDeleteSupplier(row.original)}>
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
      title="Supplier Master Data"
      caption="Access, update, and maintain detailed supplier information for effective collaboration"
    >
      <MaterialReactTable table={table} />

      {/* Add Dialog from first file */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle bgcolor="secondary.dark" color="white" variant="h3">
          Add New Supplier
        </DialogTitle>
        <DialogContent style={{ paddingTop: "20px" }}>
          {Object.keys(newRow).map((key) => (
            <FormControl fullWidth key={key} style={{ marginBottom: "16px" }}>
              {key === "minority_supplier" ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newRow[key]}
                      onChange={handleNewRowChange}
                      name={key}
                    />
                  }
                  label={key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                />
              ) : (
                <TextField
                  name={key}
                  label={key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                  value={newRow[key] || ""}
                  onChange={handleNewRowChange}
                  type={
                    [
                      "zip_code",
                      "financial_score",
                      "sustainability_score",
                    ].includes(key)
                      ? "number"
                      : "text"
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  variant="outlined"
                />
              )}
            </FormControl>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddRow} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog from first file */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle bgcolor="secondary.dark" color="white" variant="h3">
          Edit Supplier
        </DialogTitle>
        <DialogContent style={{ paddingTop: "20px" }}>
          {editedRow &&
            Object.keys(editedRow).map((key) => (
              <FormControl fullWidth key={key} style={{ marginBottom: "16px" }}>
                {key === "minority_supplier" ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={editedRow[key]}
                        onChange={handleEditedRowChange}
                        name={key}
                      />
                    }
                    label={key
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  />
                ) : (
                  <TextField
                    name={key}
                    label={key
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                    value={editedRow[key]}
                    onChange={handleEditedRowChange}
                    type={
                      [
                        "zip_code",
                        "financial_score",
                        "sustainability_score",
                      ].includes(key)
                        ? "number"
                        : "text"
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="outlined"
                    disabled={key === "id" || key === "supplier_id"}
                  />
                )}
              </FormControl>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            onClick={handleSaveEditedRow}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <FileUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleFileUpload}
      />
    </MainCard>
  );
};

export default SupplierMasterData;
