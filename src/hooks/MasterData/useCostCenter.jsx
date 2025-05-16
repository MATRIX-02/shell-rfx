import { useState, useCallback } from "react";
import axios from "axios";

const useCostCenterApi = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const MASTER_DATA = import.meta.env.VITE_CATEGORY_CARD_URL;

	const handleApiCall = useCallback(async (apiCall) => {
		setLoading(true);
		setError(null);
		try {
			const result = await apiCall();
			return result;
		} catch (err) {
			setError(err.message || "An error occurred");
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const getAllCostCenters = useCallback(() => {
		return handleApiCall(() =>
			axios.get(`${MASTER_DATA}/costCenter/getALLCostCenters`)
		);
	}, [handleApiCall]);

	const deleteCostCenter = useCallback(
		(costCenterNumber) => {
			return handleApiCall(() =>
				axios.delete(
					`${MASTER_DATA}/costCenter/deleteCostCenter/${costCenterNumber}`
				)
			);
		},
		[handleApiCall]
	);

	const createCostCenter = useCallback(
		(costCenterData) => {
			return handleApiCall(() =>
				axios.post(
					`${MASTER_DATA}/costCenter/insertSingleCostCenter`,
					costCenterData
				)
			);
		},
		[handleApiCall]
	);

	const updateCostCenter = useCallback(
		(costCenterNumber, costCenterData) => {
			return handleApiCall(() =>
				axios.put(
					`${MASTER_DATA}/costCenter/updateCostCenter/${costCenterNumber}`,
					costCenterData
				)
			);
		},
		[handleApiCall]
	);

	return {
		loading,
		error,
		getAllCostCenters,
		deleteCostCenter,
		createCostCenter,
		updateCostCenter,
	};
};

export default useCostCenterApi;
