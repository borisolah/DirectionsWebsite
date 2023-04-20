import { useState, useEffect } from "react";
import databasePromise from "./databasePromise";
import useFetchTrucks from "../hooks/useFetchTrucks";

export const useDatabase = () => {
  const [database, setDatabase] = useState([]);
  const [databaseLoading, setDatabaseLoading] = useState(true);
  const [nulledItems, setNulledItems] = useState([]);
  const {
    data: trucks,
    loading: trucksLoading,
    error: trucksError,
  } = useFetchTrucks();

  useEffect(() => {
    (async () => {
      try {
        const [result] = await Promise.all([databasePromise()]);
        setDatabase(result.newDatabase);
        setNulledItems(result.nulledItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDatabaseLoading(false);
      }
    })();
  }, []);

  return [database, databaseLoading, nulledItems, trucks];
};
