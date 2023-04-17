import { useState } from "react";
import axios from "axios";

const usePostData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (url, data) => {
    setLoading(true);
    setError(null);
    console.log("Submitting data:", data); // Add this line

    try {
      await axios.post(url, data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { postData, loading, error };
};

export default usePostData;
