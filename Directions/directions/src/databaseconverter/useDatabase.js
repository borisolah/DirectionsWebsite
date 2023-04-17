import { useState, useEffect } from "react";
import databasePromise from "./databasePromise";

export const useDatabase = () => {
  const [database, setDatabase] = useState([]);
  const [databaseLoading, setDatabaseLoading] = useState(true); // Rename loading to databaseLoading
  const [nulledItems, setNulledItems] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await databasePromise();
      setDatabase(result.newDatabase);
      setNulledItems(result.nulledItems);
      setDatabaseLoading(false); // Rename setLoading to setDatabaseLoading
    })();
  }, []);

  // Make sure the return statement is inside the useDatabase function
  return [database, databaseLoading, nulledItems]; // Rename loading to databaseLoading
};
