import axios from "axios";
import extractSenderAndReceiverInfo from "./extractInfo";

const databasePromise = async () => {
  try {
    const response = await axios.get(
      "https://www.hejjavitko.hu/api/getPackages"
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

// https://www.hejjavitko.hu/api/getPackages
// "mongodb+srv://borisz0929:yW9M9KivNC1XVdW1@cluster0.foweg.mongodb.net/DirectionsDB?retryWrites=true&w=majority",
