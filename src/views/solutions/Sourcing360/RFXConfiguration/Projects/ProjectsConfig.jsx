import React, { lazy, Suspense, useState, useEffect } from "react";
import {
	Box,
	Paper,
	Typography,
	CircularProgress,
} from "@mui/material";
import { useInView } from "react-intersection-observer";

// Immediately load lighter components
import DocumentType from "./DocumentType";
import FileUploadSettings from "./FileUploadSettings";

// Lazy load heavier components
const DefineAndActivateFields = lazy(() => import("./DefineAndActivateFields"));
const NumberFormat = lazy(() => import("./NumberFormat"));
const DataValidation = lazy(() => import("./DataValidation"));
const EmailSummarise = lazy(() => import("./EmailSummarise"));
const ModelKeyConfig = lazy(() => import("./ModelKeyConfig"));
const LLMConfig = lazy(() => import("./LLMConfig"));

// Component to handle lazy loading with IntersectionObserver
const LazyLoadComponent = ({ component: Component, placeholder = 100 }) => {
	const { ref, inView } = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	return (
		<div ref={ref} style={{ minHeight: '100px' }}>
			{inView ? (
				<Suspense
					fallback={
						<Box className="flex justify-center items-center py-8">
							<CircularProgress size={24} />
						</Box>
					}
				>
					<Component />
				</Suspense>
			) : (
				<Box className="flex justify-center items-center py-8">
					<CircularProgress size={24} />
				</Box>
			)}
		</div>
	);
};

const dividerStyle = {
    height: '3px',
    backgroundColor: '#E5E7EB',
    margin: '48px 0',
};

const ProjectsConfig = () => {
	// State to control progressive loading
	const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);

	useEffect(() => {
		// Delay loading of advanced configuration
		const timer = setTimeout(() => {
			setShowAdvancedConfig(true);
		}, 100);
		return () => clearTimeout(timer);
	}, []);

	return (
		<Box>
			<DocumentType />
			<div style={dividerStyle} />
			<FileUploadSettings />
			<div style={dividerStyle} />

			<LazyLoadComponent component={DefineAndActivateFields} />
			<div style={dividerStyle} />
			<LazyLoadComponent component={DataValidation} />
			<div style={dividerStyle} />
			<LazyLoadComponent component={NumberFormat} />
			<div style={dividerStyle} />

			{showAdvancedConfig && (
				<>
					<LazyLoadComponent component={EmailSummarise} />
					<div style={dividerStyle} />
					<LazyLoadComponent component={ModelKeyConfig} />
					<div style={dividerStyle} />
					<LazyLoadComponent component={LLMConfig} />
				</>
			)}
		</Box>
	);
};

export default ProjectsConfig;