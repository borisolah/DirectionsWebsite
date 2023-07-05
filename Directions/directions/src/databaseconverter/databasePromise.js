import axios from "axios";
import extractSenderAndReceiverInfo from "./extractInfo";

const databasePromise = async () => {
  try {
    const response = await axios.get(
      
    );

    if (response.status !== 200) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const result = await extractSenderAndReceiverInfo(response.data);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default databasePromise;
