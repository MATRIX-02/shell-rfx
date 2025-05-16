import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Snackbar as MuiSnackbar,
	IconButton,
	Typography,
	Box,
	Button,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { selectSnackbarState } from "store/modules/SnackBar/snackbarSelectors";
import { hideSnackbar } from "store/modules/SnackBar/snackbarSlice";
import {
	WarningAmber as WarningIcon,
	InfoOutlined as InfoIcon,
	Close as CloseIcon,
} from "@mui/icons-material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { IconArrowNarrowRight } from "@tabler/icons-react";

const Snackbar = () => {
	const dispatch = useDispatch();
	const { open, message, severity, variant, customContent, duration } =
		useSelector(selectSnackbarState);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		dispatch(hideSnackbar());
	};

	// Function to get icon and background color for each severity
	const getVariantStyles = (severity) => {
		switch (severity) {
			case "success":
				return {
					icon: <DoneAllIcon sx={{ color: "#fff", fontSize: "25px" }} />,
					bgColor: "#80DBB7",
					borderColor: "#9BD2A8",
					glow: "2px 10px 25px #80DBB7",
				};
			case "error":
				return {
					icon: <DoNotDisturbIcon sx={{ color: "#fff", fontSize: "25px" }} />,
					bgColor: "#F2AA9C",
					borderColor: "#F1998E",
					glow: "2px 10px 25px #F2AA9C",
				};
			case "warning":
				return {
					icon: <WarningIcon sx={{ color: "#fff", fontSize: "25px" }} />,
					bgColor: "#FFC785",
					borderColor: "#FFD384",
					glow: "2px 10px 25px #FFC785",
				};
			case "info":
				return {
					icon: <InfoIcon sx={{ color: "#fff", fontSize: "25px" }} />,
					bgColor: "#A1BAFF",
					borderColor: "#A7D3F1",
					glow: "2px 10px 25px #A1BAFF",
				};
			default:
				return {
					icon: null,
					bgColor: "rgba(189, 189, 189, 0.6)",
					borderColor: "#BDBDBD",
					glow: "0px 0px 8px rgba(189, 189, 189, 0.6)",
				};
		}
	};

	const variantStyles = getVariantStyles(severity);

	// Standard variant styling
	if (variant !== "custom") {
		return (
			<MuiSnackbar
				open={open}
				autoHideDuration={duration}
				onClose={handleClose}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						bgcolor: "#fff",
						color: "#000",
						borderRadius: "12px",
						boxShadow: variantStyles.glow,
						p: 1,
						pl: 3,
						minWidth: 350,
						position: "relative",
						width: "fit-content",
					}}
				>
					<Box
						sx={{
							backgroundColor: variantStyles.bgColor,
							px: 1,
							py: 0.9,
							borderRadius: "30%",
							display: "flex",
							justifyContent: "center",
						}}
					>
						{variantStyles.icon}
					</Box>
					<Box sx={{ ml: 2, flexGrow: 1, mr: 4 }}>
						<Typography
							variant="body1"
							sx={{ fontWeight: 600, fontSize: "16px" }}
						>
							{severity.charAt(0).toUpperCase() + severity.slice(1)}
						</Typography>
						<Typography
							variant="body2"
							sx={{ color: "#555", fontSize: "14px", mt: 0.5 }}
						>
							{message}
						</Typography>
					</Box>
					{/* Close button */}
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={handleClose}
						sx={{
							position: "absolute",
							top: "16px",
							right: "2px",
							color: "#999",
							"&:hover": { color: "#000" },
						}}
					>
						<CloseIcon fontSize="medium" />
					</IconButton>
				</Box>
			</MuiSnackbar>
		);
	}

	// Custom variant remains unchanged
	return (
		<MuiSnackbar
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			open={open}
			autoHideDuration={duration}
			onClose={handleClose}
		>
			<Box
				sx={{
					bgcolor: (theme) => theme.palette.background.paper,
					color: (theme) => theme.palette.common.white,
					borderRadius: "5px",
					boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
					border: "1px solid rgba(38, 105, 93, 0.1)",
					p: 2,
					mt: 10,
				}}
			>
				<Typography variant="h4" mb="0.5rem">
					{customContent.title}
				</Typography>
				<Typography variant="body1" sx={{ color: "#000" }}>
					{customContent.body}
				</Typography>
				{customContent.action && (
					<Button
						variant="outlined"
						color="secondary"
						size="small"
						onClick={customContent.action.onClick}
						sx={{
							mt: 2,
							display: "flex",
							alignItems: "center",
							gap: "5px",
						}}
					>
						{customContent.action.text}
						<IconArrowNarrowRight
							size="20px"
							style={{ marginBottom: ".15rem" }}
						/>
					</Button>
				)}
				<IconButton
					size="small"
					aria-label="close"
					color="inherit"
					onClick={handleClose}
					sx={{ position: "absolute", top: 8, right: 8 }}
				>
					<CloseIcon fontSize="small" />
				</IconButton>
			</Box>
		</MuiSnackbar>
	);
};

export default Snackbar;
