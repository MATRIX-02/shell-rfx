import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	Typography,
	Divider,
	Link,
} from "@mui/material";
import { useDropzone } from "react-dropzone";

const FileUploadDialog = ({ open, onClose, onUpload }) => {
	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => {
			onUpload(acceptedFiles);
		},
	});

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle
				sx={{
					bgcolor: "secondary.dark",
					color: "primary.contrastText",
					fontSize: 20,
				}}
			>
				Upload File
			</DialogTitle>
			<DialogContent dividers>
				<Box
					{...getRootProps()}
					sx={{
						border: "2px dashed #e0e0e0",
						borderRadius: 1,
						p: 3,
						textAlign: "center",
						cursor: "pointer",
					}}
				>
					<input {...getInputProps()} />
					<Typography variant="h6" gutterBottom>
						Drag 'n' drop some files here, or click to select files
					</Typography>
				</Box>
			</DialogContent>
			<DialogActions sx={{ px: 3, py: 2, bgcolor: "grey.100" }}>
				<Link href="/path/to/template.csv" target="_blank" sx={{ mr: "auto" }}>
					Download the template
				</Link>
				<Button onClick={onClose} variant="outlined">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default FileUploadDialog;
