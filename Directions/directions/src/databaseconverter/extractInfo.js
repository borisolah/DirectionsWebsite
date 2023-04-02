import parseSerializedString from "./perseSerialStr";
import getLatLng from "../components/getLatLng";

async function extractSenderAndReceiverInfo(preDatabase) {
  const newDatabasePromises = preDatabase.map(async (item) => {
    const pckSenderString = item.pck_sender;
    const pckSenderObject = parseSerializedString(pckSenderString);

    const pckReceiverString = item.pck_receiver;
    const pckReceiverObject = parseSerializedString(pckReceiverString);

    const receiverLatLng = await getLatLng(
      pckReceiverObject.address_street,
      pckReceiverObject.address_city
    );
    item.lat = receiverLatLng.lat;
    item.lng = receiverLatLng.lng;

    return {
      ...item,
      pck_sender: pckSenderObject,
      pck_receiver: pckReceiverObject,
    };
  });

  const newDatabase = await Promise.all(newDatabasePromises);
  console.log(newDatabase);
  return newDatabase;
}

export default extractSenderAndReceiverInfo;
