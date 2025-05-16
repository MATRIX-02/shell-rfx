import { useState, useCallback } from "react";
import axios from "axios";

const useContracts = () => {
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

  const getAllContracts = useCallback(() => {
    return handleApiCall(() =>
      axios.get(`${MASTER_DATA}/contracts/getAllContracts`)
    );
  }, [handleApiCall]);

  const deleteContract = useCallback(
    (contractId) => {
      return handleApiCall(() =>
        axios.delete(`${MASTER_DATA}/contracts/deleteContract/${contractId}`)
      );
    },
    [handleApiCall]
  );

  const createContract = useCallback(
    (contractData, contractFile) => {
      // Create a FormData object
      const formData = new FormData();
      formData.append("contract", JSON.stringify(contractData));
      if (contractFile) {
        formData.append("file", contractFile);
      }

      return handleApiCall(() =>
        axios.post(`${MASTER_DATA}/contracts/createContract`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      );
    },
    [handleApiCall]
  );
  const updateContract = useCallback(
    (supplierId, contractId, contractData, contractFile) => {
      return handleApiCall(() =>
        axios.put(
          `${MASTER_DATA}/contracts/updateContract/${supplierId}/${contractId}`,
          {
            updated_contract: JSON.stringify(contractData),
            file: contractFile,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
      );
    },
    [handleApiCall]
  );

  return {
    loading,
    error,
    getAllContracts,
    deleteContract,
    createContract,
    updateContract,
  };
};

export default useContracts;
