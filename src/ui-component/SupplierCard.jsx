import React, { useState } from "react";
import {
	Card,
	CardContent,
	Typography,
	Box,
	Chip,
	Avatar,
	Grid,
	Rating,
	Tooltip,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import { CircularProgress } from "@mui/material";

const SupplierCard = ({ supplier, onMoreInfo, isExternal }) => {
	if (!supplier) {
		return null;
	}

	const [isFetching, setIsFetching] = useState(false);
	const [fetched, setFetched] = useState(false);

	const handleFetchInfo = () => {
		setIsFetching(true);
		setTimeout(() => {
			setIsFetching(false);
			setFetched(true);
		}, 2000);
	};

	return (
		<Card
			sx={{
				width: "100%",
				height: 400,
				m: 1,
				border: "1px solid #eee",
				borderRadius: "1rem",
				backgroundColor: "#FEF7FF",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				position: "relative",
			}}
		>
			<CardContent sx={{ flexGrow: 1 }}>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 2,
					}}
				>
					<Typography
						variant="h4"
						component="div"
						color="secondary.dark"
						noWrap
					>
						{supplier.supplierName}
					</Typography>
				</Box>
				{!isExternal && (
					<Box sx={{ position: "absolute", top: 19, right: 10 }}>
						<Tooltip
							placement="top"
							title={`EaseworkAI Rating: ${supplier.overallRating}`}
						>
							<Box>
								<Rating
									name="read-only"
									value={supplier.overallRating}
									readOnly
									precision={0.1}
									sx={{ color: "#5E35B1" }}
								/>
							</Box>
						</Tooltip>
					</Box>
				)}
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						mb: 2,
						bgcolor: "white",
						width: "calc(100% + 49px)",
						marginLeft: "-25px",
						marginRight: "-25px",
						p: 2,
					}}
				>
					<Avatar
						sx={{
							width: 80,
							height: 80,
							border: "1px solid #5e17eb",
							color: "#9747FF",
							bgcolor: "white",
						}}
					>
						<BusinessIcon />
					</Avatar>
				</Box>
				<Typography variant="body2" color="text.secondary" noWrap>
					Company URL -{" "}
					<Link
						target="_blank"
						rel="noopener noreferrer"
						component="button"
						variant="body2"
						style={{ color: "#9747ff" }}
						to={supplier.companyURL}
					>
						{supplier.companyURL}
					</Link>
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Country - {supplier.country}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					State - {supplier.state}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					City - {supplier.city}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					PIN Code - {supplier.zipCode}
				</Typography>
			</CardContent>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					p: 2,
					pt: 0,
				}}
			>
				{isExternal ? (
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-around",
							width: "100%",
						}}
					>
						<Chip
							label={
								isFetching
									? "Fetching..."
									: fetched
										? "View Info"
										: "Fetch Info"
							}
							color="secondary"
							size="small"
							onClick={handleFetchInfo}
							disabled={isFetching}
							icon={
								isFetching ? (
									<CircularProgress size={16} style={{ color: "#fff" }} />
								) : null
							}
							sx={{
								bgcolor: "#9747ff",
								color: "#fff",
								padding: " 1rem .4rem",
							}}
						/>
						<Chip
							label="Proceed to Draft Email"
							color="secondary"
							size="small"
							onClick={() => onMoreInfo(supplier)}
							sx={{ bgcolor: "#9747ff", color: "#fff", padding: " 1rem .4rem" }}
						/>
					</Box>
				) : (
					<Chip
						label="More Info"
						color="secondary"
						size="small"
						onClick={() => onMoreInfo(supplier)}
						sx={{ bgcolor: "#9747ff", color: "#fff", padding: " 1rem .4rem" }}
					/>
				)}
			</Box>
		</Card>
	);
};

const StyledGridOverlay = styled("div")(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	height: "40vh",
	"& .no-rows-primary": {
		fill: "#AEB8C2",
	},
	"& .no-rows-secondary": {
		fill: "#E8EAED",
	},
}));

const SupplierCardGrid = ({ suppliers = [], onMoreInfo, isExternal }) => {
	if (!suppliers || suppliers.length === 0) {
		return (
			<StyledGridOverlay>
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
				<Box sx={{ mt: 2 }}>Nothing to show</Box>
			</StyledGridOverlay>
		);
	}

	return (
		<Box sx={{ margin: "auto 0", width: "99%" }}>
			<Grid container spacing={2} justifyContent="flex-start">
				{suppliers.map((supplier, index) => (
					<Grid item xs={12} sm={6} md={3} key={index}>
						<SupplierCard
							supplier={supplier}
							onMoreInfo={onMoreInfo}
							isExternal={isExternal}
						/>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export { SupplierCard, SupplierCardGrid };
