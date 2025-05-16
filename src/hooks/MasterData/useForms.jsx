import { useState, useCallback } from "react";
import axios from "axios";

const useFormApi = () => {
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

	const getAllForms = useCallback(() => {
		return handleApiCall(() => axios.get(`${MASTER_DATA}/form/getAllForms`));
	}, [handleApiCall]);

	const deleteForm = useCallback(
		(formId) => {
			return handleApiCall(() =>
				axios.delete(`${MASTER_DATA}/form/deleteForm/${formId}`)
			);
		},
		[handleApiCall]
	);

	const createForm = useCallback(
		(formData) => {
			return handleApiCall(() =>
				axios.post(`${MASTER_DATA}/form/createForm`, formData)
			);
		},
		[handleApiCall]
	);

	const updateCategory = useCallback(
		(formId, formData) => {
			return handleApiCall(() =>
				axios.put(`${MASTER_DATA}/form/updateCategory/${formId}`, formData)
			);
		},
		[handleApiCall]
	);

	return {
		loading,
		error,
		getAllForms,
		deleteForm,
		createForm,
		updateCategory,
	};
};

export default useFormApi;
