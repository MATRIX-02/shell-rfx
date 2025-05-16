import React, { useState, useEffect } from "react";

import MainCard from "ui-component/cards/MainCard";
import {
	Stepper,
	Step,
	StepLabel,
	Button,
	Box,
	Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Import your step components here
import AddFields from "./tabs/AddFields";
import Review from "./tabs/Review";
import Lookup from "./tabs/Lookup";
import MaintainConfiguration from "./tabs/MaintainConfiguration";

// Icons
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const steps = ["Add Fields", "Review", "Lookup", "Screen Design"];

const predefinedFields = [
	{
		name: "company",
		label: "Company",
		type: "text",
		key: false,
		required: true,
	},
	{
		name: "country",
		label: "Country",
		type: "text",
		key: false,
		required: true,
	},
	{
		name: "post po document",
		label: "Post Po Document",
		type: "file",
		key: false,
		required: true,
	},
	{
		name: "categoryID",
		label: "Category ID",
		type: "number",
		key: true,
		required: true,
	},
];

const ScenarioActivation = () => {
	const [fields, setFields] = useState(() => {
		const savedFields = localStorage.getItem("scenarioFields");
		return savedFields ? JSON.parse(savedFields) : predefinedFields;
	});

	const handleAddField = (newField) => {
		setFields([...fields, newField]);
	};

	const handleFieldUpdate = (index, updatedField) => {
		const updatedFields = fields.map((field, i) => {
			if (i === index) {
				return updatedField;
			} else if (updatedField.key) {
				return { ...field, key: false };
			}
			return field;
		});
		setFields(updatedFields);
	};

	const handleDeleteField = (index) => {
		if (index >= predefinedFields.length) {
			setFields(fields.filter((_, i) => i !== index));
		}
	};

	const [activeStep, setActiveStep] = useState(0);

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const renderStepComponent = () => {
		switch (activeStep) {
			case 0:
				return (
					<AddFields
						fields={fields}
						onAddField={handleAddField}
						onFieldUpdate={handleFieldUpdate}
						onDeleteField={handleDeleteField}
						predefinedFieldsCount={predefinedFields.length}
					/>
				);
			case 1:
				return <Review fields={fields} />;
			case 2:
				return <Lookup fields={fields} />;
			case 3:
				return <MaintainConfiguration fields={fields} />;
			// case 4:
			//   return <DesignScreen />;
			default:
				return <div>Unknown step</div>;
		}
	};

	useEffect(() => {
		localStorage.setItem("scenarioFields", JSON.stringify(fields));
	}, [fields]);

	return (
		<MainCard title="Scenario Activation">
			<Typography variant="body1">
				Manage and customize the screen fields required for your forms, ensuring
				accurate data collection.
			</Typography>
			<Stepper
				activeStep={activeStep}
				alternativeLabel
				sx={{ marginTop: "4rem" }}
			>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
			<Box mt={4}>{renderStepComponent()}</Box>
			<Box mt={4} display="flex" justifyContent="space-between">
				{activeStep > 0 && (
					<Button onClick={handleBack} variant="contained">
						<IconChevronLeft size={20} />
						Back
					</Button>
				)}
				<Box flexGrow={1} />
				{activeStep < steps.length - 1 ? (
					<Button onClick={handleNext} variant="contained">
						Next
						<IconChevronRight size={20} />
					</Button>
				) : (
					<Button variant="contained" s>
						Publish
					</Button>
				)}
			</Box>
		</MainCard>
	);
};

export default ScenarioActivation;
