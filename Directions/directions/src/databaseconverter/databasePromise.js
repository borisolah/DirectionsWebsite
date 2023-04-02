import extractSenderAndReceiverInfo from "./extractInfo";
import preDatabase from "./preDatabase.json";

const databasePromise = (async () => {
  return await extractSenderAndReceiverInfo(preDatabase);
})();

export default databasePromise;
