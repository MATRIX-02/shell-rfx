import React, { useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const ESCustomTable = ({
	columns,
	data,
	enableSorting = false,
	enablePagination = false,
	enableRowSelection = false,
	enableColumnOrdering = false,
	enableTopToolbar = false,
	enableBottomToolbar = false,
	enableColumnActions = false,
	renderTopToolbarCustomActions,
	renderBottomToolbarCustomActions,
	muiSearchTextFieldProps,
	isLoading = false,
	minHeight = 400,
	maxHeight = 500,
	muiLinearProgressProps = {},
	muiTableProps,
	muiTopToolbarProps,
	muiMenuProps,
	renderRowActions = () => {},
	...props
}) => {
	const [showAlert, setShowAlert] = useState(false);

	const toggleAlertVisibility = () => {
		setShowAlert((prev) => !prev);
	};

	const NoRowsSVG = () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			width="96"
			viewBox="0 0 452 257"
			aria-hidden="true"
			focusable="false"
		>
			<path
				className="no-rows-primary"
				d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
			></path>
			<path
				className="no-rows-primary"
				d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
			></path>
			<path
				className="no-rows-primary"
				d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
			></path>
			<path
				className="no-rows-secondary"
				d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
			></path>
		</svg>
	);

	const processedColumns = columns.map((column) => ({
		...column,
		Header: typeof column.header === "function" ? column.header : column.header,
		sortingFn:
			column.sortingFn ||
			((rowA, rowB, columnId) => {
				const valueA = rowA.original[columnId];
				const valueB = rowB.original[columnId];
				return valueA.localeCompare(valueB);
			}),
	}));

	return (
		<div style={{ position: "relative" }}>
			<MaterialReactTable
				columns={processedColumns}
				data={data}
				enableSorting={enableSorting}
				enablePagination={enablePagination}
				enableRowSelection={enableRowSelection}
				enableColumnOrdering={enableColumnOrdering}
				enableTopToolbar={enableTopToolbar}
				enableBottomToolbar={enableBottomToolbar}
				enableColumnActions={enableColumnActions}
				enableStickyHeader
				renderTopToolbarCustomActions={renderTopToolbarCustomActions}
				renderRowActions={renderRowActions}
				renderBottomToolbarCustomActions={({ table }) => (
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							width: "100%",
							backgroundColor: "#000",
						}}
					>
						{renderBottomToolbarCustomActions &&
							renderBottomToolbarCustomActions({ table })}
					</div>
				)}
				muiTableContainerProps={{
					sx: {
						maxHeight: maxHeight,
						minHeight: minHeight,
						border: "1px solid #ddd",
					},
				}}
				muiTablePaperProps={{
					sx: {
						boxShadow: "none",
						position: "relative",
					},
				}}
				muiTableProps={muiTableProps}
				muiMenuProps={muiMenuProps}
				muiTopToolbarProps={muiTopToolbarProps}
				muiTableHeadCellProps={{
					sx: {
						backgroundColor: "#f9f9f9",
						fontWeight: "400",
						color: "#000",
						fontSize: "1rem",
					},
				}}
				muiTableBodyProps={{
					sx: {
						"& .MuiIconButton-root": {
							color: "#2B2B2B",
						},
						"& .MuiTableRow-root": {
							height: "40px",
						},
					},
				}}
				muiTableBodyRowProps={{
					sx: {
						height: "40px",
					},
				}}
				muiSearchTextFieldProps={muiSearchTextFieldProps}
				state={{ isLoading, showProgressBars: true, showLoadingOverlay: false }}
				renderEmptyRowsFallback={() => (
					// <div
					// 	style={{
					// 		display: "flex",
					// 		flexDirection: "column",
					// 		justifyContent: "center",
					// 		alignItems: "center",

					// 	}}
					// >
					// 	<NoRowsSVG />
					// 	<p></p>
					// </div>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							width: "100%",
							flexDirection: "column",
							padding: "20px",
							height: 400,
						}}
					>
						<Box sx={{ m: 0, p: 0, position: "relative" }}>
							<img
								width="80"
								height="80"
								src="https://img.icons8.com/external-tal-revivo-light-tal-revivo/100/000000/external-online-search-results-from-a-search-engine-wireframe-light-tal-revivo.png"
								alt="shopping-cart--v1"
							/>
							<img
								style={{ position: "absolute", right: "3px" }}
								width="80"
								height="80"
								src="https://img.icons8.com/external-tal-revivo-light-tal-revivo/100/9747ff/external-online-search-results-from-a-search-engine-wireframe-light-tal-revivo.png"
								alt="shopping-cart--v1"
							/>
							{/* <NoRowsSVG/> */}
							{/* <img
				style={{ position: "absolute", right: "-10px", bottom:'-5px'}}
				width="30"
				height="30"
				src="https://img.icons8.com/ios/50/000000/cancel-2.png"
				alt="shopping-cart--v1"
				/>
				<img
				style={{ position: "absolute", right: "-9px", bottom:'-5px'}}
				width="30"
				height="30"
				src="https://img.icons8.com/ios/50/9747ff/cancel-2.png"
				alt="shopping-cart--v1"
				/> */}
						</Box>
						<Typography
							variant="body1"
							sx={{ mb: 1, fontWeight: "600", fontSize: "1.5rem" }}
						>
							No rows to display
						</Typography>
						<Typography variant="body1">
							Search Supplier or Product name in search bar to see details
						</Typography>
					</Box>
				)}
				muiSkeletonProps={{
					animation: "wave",
					sx: {
						backgroundColor: "#f9f9f9",
						"& .MuiSkeleton-text": {
							backgroundColor: "#f9f9f9",
						},
					},
				}}
				muiLinearProgressProps={({ isTopToolbar = true }) => ({
					sx: {
						display: isLoading ? "block" : "none",
						position: "relative",
						top: "0",
						left: "0",
						width: "100%",
						zIndex: 9999,
						...(muiLinearProgressProps.sx || {}),
					},
					...muiLinearProgressProps,
				})}
				{...props}
			/>
			{enableBottomToolbar && showAlert && (
				<div
					className={`toolbar-alert-banner ${showAlert ? "toolbar-alert-banner-enter-active" : "toolbar-alert-banner-exit-active"}`}
				>
					<span>Alert Banner</span>
					<button onClick={toggleAlertVisibility}>Close</button>
				</div>
			)}
		</div>
	);
};

export default ESCustomTable;
