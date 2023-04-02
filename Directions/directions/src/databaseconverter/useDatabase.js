import { useState, useEffect } from "react";
import databasePromise from "./databasePromise";

export const useDatabase = () => {
  const [database, setDatabase] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await databasePromise;
      setDatabase(data);
      setLoading(false);
    })();
  }, []);

  return [database, loading];
};
