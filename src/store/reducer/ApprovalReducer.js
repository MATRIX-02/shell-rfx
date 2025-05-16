import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	columns: [
		{
			name: "es_country",
			label: "Country",
			type: "text",
			key: false,
			required: true,
			isPredefined: true,
			isActive: true
		},
		{
			name: "es_company",
			label: "Company",
			type: "text",
			key: false,
			required: true,
			isPredefined: true,
			isActive: true
		},
		{
			name: "es_department",
			label: "Department",
			type: "text",
			key: false,
			required: true,
			isPredefined: true,
			isActive: true
		},
		{
			name: "es_category_id",
			label: "Category ID",
			type: "number",
			key: true,
			required: true,
			isPredefined: true,
			isActive: true
		},
	],
	tables: [
		{
			"id": "#7885",
			"name": "IT Purchase",
			"approvalType": "Purchase Request",
			"fields": [
				{
					"name": "es_company",
					"label": "Company",
					"type": "text",
					"key": false,
					"required": true,
					"isPredefined": true,
					"operator": "equal"
				},
				{
					"name": "es_category_id",
					"label": "Category ID",
					"type": "number",
					"key": true,
					"required": true,
					"isPredefined": true,
					"operator": "equal"
				},
				{
					"name": "es_country",
					"label": "Country",
					"type": "text",
					"key": false,
					"required": true,
					"isPredefined": true,
					"operator": "equal"
				}
			],
			"approvers": [],
			"flowType": "Parallel",
			"isSaved": true,
			"isExpanded": true,
			"isApproversExpanded": false,
			"isActive": true,
			"isEditable": false
		},
		{
			"id": "#8009",
			"name": "Desktop Purchase",
			"approvalType": "Purchase Request",
			"fields": [
				{
					"name": "es_country",
					"label": "Country",
					"type": "text",
					"key": false,
					"required": true,
					"isPredefined": true,
					"operator": "equal"
				},
				{
					"name": "es_company",
					"label": "Company",
					"type": "text",
					"key": false,
					"required": true,
					"isPredefined": true,
					"operator": "equal"
				}
			],
			"approvers": [],
			"flowType": "",
			"isSaved": false,
			"isExpanded": true,
			"isApproversExpanded": false,
			"isActive": true,
			"isEditable": true
		}
	],

	selectedEndpoints: {},
	AllLevelsData: [],
	advancedRules: [],
	selectedApproverRules: [],
	showMultipleApproverBox: false,
	isAllLevelsDataDropdownExpanded: false
};

const approvalSlice = createSlice({
	name: 'approval',
	initialState,
	reducers: {
		addColumn: (state, action) => {
			state.columns.push({ ...action.payload, key: false });
		},
		updateColumn: (state, action) => {

			const { index, updatedField } = action.payload;

			console.log(index, updatedField);
			const column = state.columns[index];
			let updatedColumn = { ...updatedField };

			if (column.name.startsWith("es_") && !updatedColumn.name.startsWith("es_")) {
				updatedColumn.name = `es_${updatedColumn.name}`;
			}

			if (updatedColumn.key) {
				// If the updated column has key set to true, set it for this column and clear the key for others
				state.columns = state.columns.map((col, i) =>
					i === index ? { ...updatedColumn, key: true } : { ...col, key: false }
				);
			} else {
				// If updatedColumn.key is false, just update the column without affecting other columns
				state.columns[index] = { ...updatedColumn, key: false };
			}

		},
		deleteColumn: (state, action) => {
			state.columns = state.columns.filter(
				(column, index) => index !== action.payload || column.name.startsWith("es_")
			);
			state.selectedEndpoints = Object.fromEntries(
				Object.entries(state.selectedEndpoints).filter(
					([key], index) => index !== action.payload || key.startsWith("es_")
				)
			);
		},
		changeColumnState: (state, action) => {
			const { column_name } = action.payload;
			// Find the whole object that matches the condition
			const requiredColumn = state.columns.find((column) => column.name === column_name);

			// Check if the column exists
			if (requiredColumn) {
				// You can access the whole column object here
				requiredColumn.isActive = !requiredColumn.isActive;  // Toggle isActive value
			} else {
				console.error(`Column with name ${column_name} not found.`);
			}
		},


		selectEndpoint: (state, action) => {
			const { columnName, endpoint } = action.payload;
			state.selectedEndpoints[columnName] = endpoint;
		},
		addTable: (state, action) => {
			state.tables.push(action.payload);
		},
		updateTable: (state, action) => {
			const index = state.tables.findIndex(table => table.id === action.payload.id);
			if (index !== -1) {
				state.tables[index] = action.payload;
			}
		},
		deleteTable: (state, action) => {
			state.tables = state.tables.filter(table => table.id !== action.payload);
			delete state.tableData[action.payload];
		},
		updateTableData: (state, action) => {
			const { tableId, data } = action.payload;
			state.tableData[tableId] = data;
		},
		addApproverRule: (state, action) => {
			state.approvers.push(action.payload);
		},
		updateApproverRule: (state, action) => {
			const index = state.approvers.findIndex(rule => rule.id === action.payload.id);
			if (index !== -1) {
				state.approvers[index] = { ...state.approvers[index], ...action.payload };
			}
		},
		deleteApproverRule: (state, action) => {
			state.approvers = state.approvers.filter(rule => rule.levelId !== action.payload);
		},
		addApproverLevel: (state, action) => {
			const { ruleId, levelData } = action.payload;


			// Find the specific rule in the tables array
			const rule = state.tables.find(rule => rule.id === ruleId);

			if (rule) {
				rule.approvers.push({
					...levelData,
					isApproverSaved: false,
					levelId: Math.floor(1000 + Math.random() * 9000), // Generates a random level ID
					maxLevelValue: 0
				});
			}
		},

		updateApproverLevel: (state, action) => {

			const { ruleId, id, levelData } = action.payload;
			const ruleIndex = state.tables.findIndex(rule => rule.id === ruleId);
			if (ruleIndex !== -1) {

				state.tables[ruleIndex].approvers = state.tables[ruleIndex].approvers.map(approver => {

					if (approver.levelId === id) {
						return {
							levelId: id,
							...levelData,
							maxLevelValue: levelData.numberFieldOne + levelData.numberFieldTwo, // Calculate maxLevelValue
							isApproverSaved: false
						};
					}
					return approver;
				});
			}
		},

		saveApproverLevel: (state, action) => {
			const { ruleId, levelId } = action.payload;

			// Find the rule by ruleId
			const rule = state.tables.find(rule => rule.id === ruleId);

			if (rule) {
				// Update the approvers array immutably
				rule.approvers = rule.approvers.map(approver =>
					approver.levelId === levelId
						? { ...approver, isApproverSaved: true }  // Mark approver as saved
						: approver
				);
			}
		},

		deleteApproverLevel: (state, action) => {
			const { ruleId, id } = action.payload; // Destructure ruleId and levelId from the action payload


			// Find the rule based on ruleId
			const rule = state.tables.find(rule => rule.id === ruleId);

			if (rule) {
				// If the rule is found, filter the approvers to remove the one with the specified levelId
				rule.approvers = rule.approvers.filter(approver => approver.levelId !== id);
			}
		},
		updateApproverLevelforSelectedRules: (state, action) => {
			const { allSelectedRules, levelData } = action.payload;

			// Iterate through each rule in the tables
			state.tables.forEach(rule => {
				// Check if the rule's name matches any name in allSelectedRules
				if (allSelectedRules.some(selectedRule => selectedRule.value === rule.name)) {
					// Replace the approvers data of the matching rule with levelData
					rule.approvers = levelData;
				}
			});
		},
		// -----------------AllLevelsData------------------------------------------
		addToAllLevelsData: (state, action) => {

			state.AllLevelsData.push({
				...action.payload,
				isEditing: false,
				levelId: Math.floor(1000 + Math.random() * 9000), // Generates a random level ID
				maxLevelValue: 0,
				isSaved: false,



			})

		},
		saveToAllLevelsData: (state, action) => {
			const { levelId } = action.payload;


			// Immutably update the AllLevelsData array
			state.AllLevelsData = state.AllLevelsData.map((level) =>
				level.levelId === levelId
					? { ...level, isSaved: true }  // Create a new object with isSaved = true
					: level  // Return the original object if no change
			);
		},

		deleteFromAllLevelData: (state, action) => {
			const { levelId } = action.payload;

			state.AllLevelsData = state.AllLevelsData.filter((value) => value.levelId !== levelId)

		},
		updateToAllLevelData: (state, action) => {
			const { levelId, levelData } = action.payload;


			const levelIndex = state.AllLevelsData.findIndex(level => level.levelId === levelId);

			if (levelIndex !== -1) {
				// Update the existing level data with the new levelData
				state.AllLevelsData[levelIndex] = {
					levelId: levelId,
					...levelData,
					maxLevelValue: Number(levelData.numberFieldOne) + Number(levelData.numberFieldTwo), // Calculate maxLevelValue
				};
			}

		},
		SetAllDataToAllLevelsData: (state, action) => {
			const selectedRulesToSet = action.payload.allSelectedRules;

			state.tables.forEach((rule) => {
				// If the ruleId exists in selectedRulesToSet, push the entire AllLevelsData to approvers
				const isRuleSelected = selectedRulesToSet.some(selectedRule => selectedRule.ruleId === rule.id);
				console.log(isRuleSelected);

				if (isRuleSelected) {
					// Push all AllLevelsData to the approvers field of the rule from state.tables
					rule.approvers = [...state.AllLevelsData];
				}
			});
		},
		changeFlowTypeOfAllSelectedRules: (state, action) => {
			const { allRules, value } = action.payload;

			state.tables.forEach((rule) => {
				// Check if the current rule exists in allRules based on ruleId
				const isRuleInAllRules = allRules.some(selectedRule => selectedRule.ruleId === rule.id);

				// If it exists, update the flowType of the rule
				if (isRuleInAllRules) {
					rule.flowType = value;
				}
			});
		},

		setIsExpandedToAllLevelsData: (state) => {
			state.isAllLevelsDataDropdownExpanded = !state.isAllLevelsDataDropdownExpanded
		},

		// -----------------------------------------------------------
		changeFlowType: (state, action) => {
			const { ruleId, label } = action.payload;
			const rule = state.tables.find(rule => rule.id === ruleId);
			rule.flowType = label
		},
		setIsApproversDropdownOpen: (state, action) => {
			const { ruleId, } = action.payload;
			const rule = state.tables.find(rule => rule.id === ruleId);
			rule.isApproversExpanded = !rule.isApproversExpanded
		},
		setIsMultipleRulesSetterBox: (state, action) => { },
		setSelectedApproverRules: (state, action) => {
			const allRules = action.payload.e;


			// Map through allRules and create new objects with uniqueId
			const updatedRules = allRules.map((rule, index) => ({
				...rule,
				uniqueId: index, // Assigning a uniqueId based on the index
			}));

			// Set state.selectedApproverRules to the new array
			state.selectedApproverRules = updatedRules;
		},




		addAdvancedRule: (state, action) => {
			state.advancedRules.push(action.payload);
		},
		updateAdvancedRule: (state, action) => {
			const index = state.advancedRules.findIndex(rule => rule.id === action.payload.id);
			if (index !== -1) {
				state.advancedRules[index] = { ...state.advancedRules[index], ...action.payload };
			}
		},
		deleteAdvancedRule: (state, action) => {
			state.advancedRules = state.advancedRules.filter(rule => rule.id !== action.payload);
		},

		updateRuleFieldValue: (state, action) => {
			const { ruleId, fieldName, value } = action.payload;


			const ruleIndex = state.tables.findIndex(rule => rule.id === ruleId);
			if (ruleIndex !== -1) {
				state.tables[ruleIndex].fields = state.tables[ruleIndex].fields.map(field => {
					if (field.name.toLowerCase() === "amount") {
						if (fieldName === "amount_currency") {
							return { ...field, currency: value };
						} else if (fieldName === "amount_lower_limit") {
							return { ...field, lowerLimit: value };
						} else if (fieldName === "amount_upper_limit") {
							return { ...field, upperLimit: value };
						} else {
							return { ...field, value };
						}
					} else if (field.name === fieldName) {
						return { ...field, value };
					}
					return field;
				});
			}
		},
		updateTableArray: (state, action) => {
			const index = state.tables.findIndex(table => table.id === action.payload.id);
			if (index !== -1) {
				state.tables[index] = action.payload;
			}
		},
		setShowMultipleApproversBox: (state, action) => {
			state.showMultipleApproverBox = !state.showMultipleApproverBox
		}
	},
});

export const {
	addColumn,
	updateColumn,
	deleteColumn,
	selectEndpoint,
	changeColumnState,
	addTable,
	updateTable,
	deleteTable,
	updateTableData,
	addApproverRule,
	updateApproverRule,
	deleteApproverRule,
	addApproverLevel,
	updateApproverLevel,
	deleteApproverLevel,
	addAdvancedRule,
	updateAdvancedRule,
	deleteAdvancedRule,
	updateRuleFieldValue,
	updateTableArray,
	changeFlowType,
	setIsApproversDropdownOpen,
	setSelectedApproverRules,
	updateApproverLevelforSelectedRules,
	addToAllLevelsData,
	updateToAllLevelData,
	deleteFromAllLevelData,
	SetAllDataToAllLevelsData,
	changeFlowTypeOfAllSelectedRules,
	setShowMultipleApproversBox,
	saveApproverLevel,
	saveToAllLevelsData,
	setIsExpandedToAllLevelsData
} = approvalSlice.actions;

export default approvalSlice.reducer;