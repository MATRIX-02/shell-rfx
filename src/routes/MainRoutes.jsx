import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
//import approvalWorkflowDesign from "views/technicalSettings/Automation360/Post_PO_Collaboration/Approval_Workflow_Design/ApprovalWorkflowDesign";

// lazy load all the views
const DashboardDefault = Loadable(lazy(() => import("views/dashboard")));
const Catalogs = Loadable(
	lazy(() => import("views/solutions/MasterData/Catalogs/Catalogs"))
);
const Forms = Loadable(
	lazy(() => import("views/solutions/MasterData/Forms/Forms"))
);
const Contracts = Loadable(
	lazy(() => import("views/solutions/MasterData/Contracts/Contracts"))
);
const SupplierMasterData = Loadable(
	lazy(
		() =>
			import("views/solutions/MasterData/suppliermasterdata/SupplierMasterData")
	)
);
const CategoryCard = Loadable(
	lazy(() => import("views/solutions/MasterData/categoryCard/CategoryCard"))
);
const GlAccount = Loadable(
	lazy(() => import("views/solutions/MasterData/glAccount/GlAccount"))
);
const CostCenter = Loadable(
	lazy(() => import("views/solutions/MasterData/costCenter/CostCenter"))
);
const CategoryID = Loadable(
	lazy(() => import("views/solutions/MasterData/categoryID/CategoryID"))
);
const ActivateSolution = Loadable(
	lazy(() => import("views/solutions/ActivateSolution/ActivateSolution"))
);
const ScenarioActivation = Loadable(
	lazy(
		() =>
			import(
				"views/technicalSettings/Automation360/Post_PO_Collaboration/Maintain_Fields/ScenarioActivation"
			)
	)
);
const ApprovalWorkflowDesign = Loadable(
	lazy(
		() =>
			import(
				"../views/technicalSettings/Approval_Workflow_Design/ApprovalWorkflowDesign"
			)
	)
);
const SolutionScenarioActivation = Loadable(
	lazy(
		() =>
			import(
				"views/solutions/Automation360/Post_PO_Collaboration/Maintain_Fields/index"
			)
	)
);

const OrgDetails = Loadable(
	lazy(() => import("views/solutions/MasterData/OrgDetails/OrgDetails"))
);

const ApprovalRule = Loadable(
	lazy(() => import("views/solutions/ApprovalRule/ApprovalRule"))
);

const ErrorBoundary = Loadable(
	lazy(() => import("views/Maintenance/ErrorBoundary"))
);

const RFXConfiguration = Loadable(
	lazy(()=>import("views/solutions/Sourcing360/RFXConfiguration/RFXConfiguration"))
)

const MainRoutes = {
	path: "/",
	element: <MainLayout />,
	children: [
		{
			path: "/home",
			element: <DashboardDefault />,
		},
		{
			path: "technicalSettings",
			children: [
				{
					path: "automation360",
					children: [
						{
							path: "postPoCollaboration",
							children: [
								{
									path: "scenarioActivation",
									element: <ScenarioActivation />,
								},
							],
						},
					],
				},
				{
					path: "approvalWorkflowDesign",
					element: <ApprovalWorkflowDesign />,
				},
			],
		},
		{
			path: "solutions",
			children: [
				{
					path: "automation360",
					children: [
						{
							path: "postPoCollaboration",
							children: [
								{
									path: "scenarioActivation",
									element: <SolutionScenarioActivation />,
								},
							],
						},
					],
				},
				{
					path: "sourcing360",
					children: [
						{
							path: "rfxconfiguration",
							element: <RFXConfiguration />,
						},
					],
				},
				{
					path: "approvalRule",
					element: <ApprovalRule />,
				},
				{
					path: "activateSolution",
					element: <ActivateSolution />,
				},
				{
					path: "masterData",
					children: [
						{
							path: "orgDetails",
							element: <OrgDetails />,
						},
						{
							path: "categoryID",
							element: <CategoryID />,
						},
						{
							path: "costCenter",
							element: <CostCenter />,
						},
						{
							path: "glAccount",
							element: <GlAccount />,
						},
						{
							path: "categoryCard",
							element: <CategoryCard />,
						},
						{
							path: "supplierData",
							element: <SupplierMasterData />,
						},
						{
							path: "contract",
							element: <Contracts />,
						},
						{
							path: "forms",
							element: <Forms />,
						},
						{
							path: "catalog",
							element: <Catalogs />,
						},
					],
				},
			],
		},
	],
	errorElement: <ErrorBoundary />,
};

export default MainRoutes;
