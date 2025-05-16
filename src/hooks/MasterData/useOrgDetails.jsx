import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showSnackbar } from "store/modules/SnackBar/snackbarSlice";

const API_BASE_URL = import.meta.env.VITE_CATEGORY_CARD_URL;

const useOrgDetails = () => {
	const [companyData, setCompanyData] = useState([]);
	const [siteData, setSiteData] = useState([]);
	const [warehouseData, setWarehouseData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const dispatch = useDispatch();

	const showNotification = (message, severity) => {
		dispatch(showSnackbar({ message, severity }));
	};

	const fetchData = useCallback(async (endpoint, setDataFunction) => {
		setLoading(true);
		try {
			const response = await axios.get(`${API_BASE_URL}${endpoint}`);
			setDataFunction(response.data);
		} catch (err) {
			setError(err.message);
			showNotification(`Error fetching data: ${err.message}`, "error");
		} finally {
			setLoading(false);
		}
	}, []);

	const fetchCompanyData = useCallback(
		() => fetchData("/org/companyDetails/", setCompanyData),
		[fetchData]
	);
	const fetchSiteData = useCallback(
		() => fetchData("/org/siteDetails/", setSiteData),
		[fetchData]
	);
	const fetchWarehouseData = useCallback(
		() => fetchData("/org/warehouseDetails/", setWarehouseData),
		[fetchData]
	);

	useEffect(() => {
		fetchCompanyData();
		fetchSiteData();
		fetchWarehouseData();
	}, [fetchCompanyData, fetchSiteData, fetchWarehouseData]);

	const createCompany = async (data) => {
		try {
			await axios.post(`${API_BASE_URL}/org/companyDetails/`, data);
			showNotification("Company created successfully", "success");
			fetchCompanyData();
		} catch (err) {
			showNotification(`Error creating company: ${err.message}`, "error");
		}
	};

	const updateCompany = async (companyId, data) => {
		try {
			await axios.put(`${API_BASE_URL}/org/companyDetails/${companyId}`, data);
			showNotification("Company updated successfully", "success");
			fetchCompanyData();
		} catch (err) {
			showNotification(`Error updating company: ${err.message}`, "error");
		}
	};

	const deleteCompany = async (companyId) => {
		try {
			await axios.delete(
				`${API_BASE_URL}/org/companyDetails/delete_company/${companyId}`
			);
			showNotification("Company deleted successfully", "success");
			fetchCompanyData();
		} catch (err) {
			showNotification(`Error deleting company: ${err.message}`, "error");
		}
	};

	const createSite = async (data) => {
		try {
			await axios.post(`${API_BASE_URL}/org/siteDetails/`, data);
			showNotification("Site created successfully", "success");
			fetchSiteData();
		} catch (err) {
			showNotification(`Error creating site: ${err.message}`, "error");
		}
	};

	const updateSite = async (siteId, data) => {
		try {
			await axios.put(`${API_BASE_URL}/org/siteDetails/${siteId}`, data);
			showNotification("Site updated successfully", "success");
			fetchSiteData();
		} catch (err) {
			showNotification(`Error updating site: ${err.message}`, "error");
		}
	};

	const deleteSite = async (siteId) => {
		try {
			await axios.delete(`${API_BASE_URL}/org/siteDetails/${siteId}`);
			showNotification("Site deleted successfully", "success");
			fetchSiteData();
		} catch (err) {
			showNotification(`Error deleting site: ${err.message}`, "error");
		}
	};

	const createWarehouse = async (data) => {
		try {
			await axios.post(`${API_BASE_URL}/org/warehouseDetails/`, data);
			showNotification("Warehouse created successfully", "success");
			fetchWarehouseData();
		} catch (err) {
			showNotification(`Error creating warehouse: ${err.message}`, "error");
		}
	};

	const updateWarehouse = async (warehouseId, data) => {
		try {
			await axios.put(
				`${API_BASE_URL}/org/warehouseDetails/${warehouseId}`,
				data
			);
			showNotification("Warehouse updated successfully", "success");
			fetchWarehouseData();
		} catch (err) {
			showNotification(`Error updating warehouse: ${err.message}`, "error");
		}
	};

	const deleteWarehouse = async (warehouseId) => {
		try {
			await axios.delete(`${API_BASE_URL}/org/warehouseDetails/${warehouseId}`);
			showNotification("Warehouse deleted successfully", "success");
			fetchWarehouseData();
		} catch (err) {
			showNotification(`Error deleting warehouse: ${err.message}`, "error");
		}
	};

	return {
		companyData,
		siteData,
		warehouseData,
		loading,
		error,
		createCompany,
		updateCompany,
		deleteCompany,
		createSite,
		updateSite,
		deleteSite,
		createWarehouse,
		updateWarehouse,
		deleteWarehouse,
	};
};

export default useOrgDetails;
