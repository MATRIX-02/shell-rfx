export const routeConfig = {
	technicalSettings: {
		name: "Technical Settings",
		childRoutes: {
			automation360: {
				name: "Automation 360",
				childRoutes: {
					postPoCollaboration: {
						name: "Post PO Collaboration",
						childRoutes: {
							scenarioActivation: { name: "Scenario Activation" },
						},
					},
				},
			},
			approvalWorkflowDesign: { name: "Approval Workflow Design" },
		},
	},
	solutions: {
		name: "Solution Settings",
		childRoutes: {
			automation360: {
				name: "Automation 360",
				childRoutes: {
					postPoCollaboration: {
						name: "Post PO Collaboration",
						childRoutes: {
							scenarioActivation: { name: "Scenario Activation" },
						},
					},
				},
			},
			sourcing360: {
				name: "Sourcing 360",
				childRoutes: {
					rfxconfiguration: {
						name: "RFX Configuration",
						// childRoutes: {
						// 	scenarioActivation: { name: "Scenario Activation" },
						// },
					},
				},
			},
			approvalRule: { name: "Approval Rule" },
			activateSolution: { name: "Activate Solution" },
			masterData: {
				name: "Master Data",
				childRoutes: {
					categoryID: { name: "Category ID" },
					costCenter: { name: "Cost Center" },
					glAccount: { name: "GL Account" },
					categoryCard: { name: "Category Card" },
					supplierData: { name: "Supplier Master Data" },
					contract: { name: "Contracts" },
					forms: { name: "Forms" },
					catalog: { name: "Catalogs" },
				},
			},
		},
	},
	dashboard: { name: "Dashboard" },
};
