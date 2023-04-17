// hooks/usePutData.js
import { useState } from "react";
import axios from "axios";

const usePutData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const putData = async (url, data) => {
    setLoading(true);
    setError(null);

    try {
      await axios.put(url, data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { putData, loading, error };
};

export default usePutData;
