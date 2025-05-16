import { useState, useCallback } from "react";
import axios from "axios";

const useCatalogs = () => {
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

	const getAllCatalogs = useCallback(() => {
		return handleApiCall(() =>
			axios.get(`${MASTER_DATA}/catalogs/getAllCatalogs`)
		);
	}, [handleApiCall]);

	const deleteCatalog = useCallback(
		(catalogId) => {
			return handleApiCall(() =>
				axios.delete(`${MASTER_DATA}/catalogs/deleteCatalog/${catalogId}`)
			);
		},
		[handleApiCall]
	);

	const createCatalog = useCallback(
		(catalogData) => {
			return handleApiCall(() =>
				axios.post(`${MASTER_DATA}/catalogs/createCatalog`, catalogData)
			);
		},
		[handleApiCall]
	);

	const updateCatalog = useCallback(
		(catalogId, catalogData) => {
			return handleApiCall(() =>
				axios.put(
					`${MASTER_DATA}/catalogs/updateCatalog/${catalogId}`,
					catalogData
				)
			);
		},
		[handleApiCall]
	);

	return {
		loading,
		error,
		getAllCatalogs,
		deleteCatalog,
		createCatalog,
		updateCatalog,
	};
};

export default useCatalogs;
