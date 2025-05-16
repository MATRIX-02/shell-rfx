import React, { useState } from "react";
import { Box, Divider, Tab, Tabs, Typography, Paper } from "@mui/material";
import { FileText, ShoppingCart, Send } from "lucide-react";
import MainCard from "ui-component/cards/MainCard";
import GoodsConfig from "./Goods/GoodsConfig";
import ProjectsConfig from "./Projects/ProjectsConfig";

const RFXConfiguration = () => {
	const [activeType, setActiveType] = useState("RFP");
	const [subTabValue, setSubTabValue] = useState(0);

	// RFX type tabs configuration
	const rfxTypes = [
		{
			id: "RFI",
			icon: <FileText size={20} />,
			label: "Request for Information",
		},
		{
			id: "RFP",
			icon: <ShoppingCart size={20} />,
			label: "Request for Proposal",
		},
		{ id: "RFQ", icon: <Send size={20} />, label: "Request for Quotation" },
	];

	const handleRFXChange = (event, newValue) => {
		setActiveType(rfxTypes[newValue].id);
	};

	const handleSubTabChange = (event, newValue) => {
		setSubTabValue(newValue);
	};

	return (
		<MainCard
			title="RFX Configuration"
			caption="RFX Configuration (RFI, RFP, RFQ)"
		>
			<Box sx={{ width: "100%", mt: 4 }}>
				{/* RFX Type Tabs */}
				<Box sx={{ mb: 4 }}>
					<Tabs
						value={rfxTypes.findIndex((type) => type.id === activeType)}
						onChange={handleRFXChange}
						aria-label="RFX type tabs"
						variant="fullWidth"
						sx={{
							mb: 2,
							"& .MuiTabs-indicator": {
								height: 3,
								borderRadius: "3px 3px 0 0",
							},
							"&::after": {
								bgcolor: "#ddd",
								height: "1px",
							},
						}}
					>
						{rfxTypes.map((type) => (
							<Tab
								key={type.id}
								label={
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											gap: 1,
										}}
									>
										<Paper
											elevation={0}
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												width: 48,
												height: 48,
												borderRadius: "12px",
												backgroundColor: (theme) =>
													type.id === activeType
														? theme.palette.secondary.dark
														: theme.palette.grey[100],
												transition: "all 0.3s ease",
												mb: 1,
											}}
										>
											<Box
												sx={{
													color: type.id === activeType ? "white" : "#000",
													display: "flex",
													transition: "all 0.3s ease",
												}}
											>
												{type.icon}
											</Box>
										</Paper>
										<Typography
											variant="body1"
											sx={{
												color:
													type.id === activeType ? "secondary.dark" : "#000",
												fontWeight: type.id === activeType ? 600 : 400,
												transition: "all 0.3s ease",
											}}
										>
											{type.id}
										</Typography>
									</Box>
								}
								sx={{
									minHeight: "auto",
									padding: 2,
									"&.Mui-selected": {
										color: "secondary.dark",
									},
								}}
							/>
						))}
					</Tabs>
				</Box>

				{activeType === "RFP" ? (
					<Box sx={{ display: "flex", minHeight: 400 }}>
						<Tabs
							orientation="vertical"
							value={subTabValue}
							onChange={handleSubTabChange}
							sx={{
								borderColor: "divider",
								minWidth: 200,
								"& .MuiTab-root": {
									minHeight: 50,
									justifyContent: "flex-start",
									textAlign: "left",
									textTransform: "none",
									fontSize: "1rem",
									color: "#777777",
									"&.Mui-selected": {
										color: "#424242",
									},
								},
								"&::after": {
									bgcolor: "#ddd",
									height: 0,
								},
							}}
						>
							<Tab label="Goods" />
							<Tab label="Projects" />
						</Tabs>

						{/* Vertical Divider */}
						<Divider orientation="vertical" flexItem />

						{/* Content Area */}
						<Box sx={{ flex: 1, pl: 3 }}>
							<Box role="tabpanel" hidden={subTabValue !== 0}>
								{subTabValue === 0 && <GoodsConfig />}
							</Box>
							<Box
								role="tabpanel"
								sx={{ height: "70vh", overflowY: "auto" }}
								hidden={subTabValue !== 1}
							>
								{subTabValue === 1 && <ProjectsConfig />}
							</Box>
						</Box>
					</Box>
				) : (
					<Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
						{activeType} configuration coming soon
					</Box>
				)}
			</Box>
		</MainCard>
	);
};

export default RFXConfiguration;
