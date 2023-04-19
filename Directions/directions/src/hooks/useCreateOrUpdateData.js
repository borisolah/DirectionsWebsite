import { useState } from "react";
import axios from "axios";

const useCreateOrUpdateData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrUpdateData = async (url, data) => {
    setLoading(true);
    setError(null);
    console.log("createOrUpdateData url:", url);
    console.log("createOrUpdateData data:", data);

    try {
      const method = url.includes("/api/ugyfelek/") ? "put" : "post";
      const response = await axios({
        method,
        url: `http://localhost:3500${url}`,
        data,
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { createOrUpdateData, loading, error };
};

export default useCreateOrUpdateData;
