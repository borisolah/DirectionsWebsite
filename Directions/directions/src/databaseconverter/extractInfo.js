import parseSerializedString from "./perseSerialStr";
import fetchBatchAddresses from "../components/fetchBatchAdresses";

async function extractSenderAndReceiverInfo(preDatabase) {
  const nulledItems = [];
  const positions = preDatabase.map((item) => {
    try {
      const pckReceiverString = item.pck_receiver;
      const pckReceiverObject = parseSerializedString(pckReceiverString);

      if (pckReceiverObject.address_street && pckReceiverObject.address_city) {
        return {
          address_street: pckReceiverObject.address_street,
          address_city: pckReceiverObject.address_city,
        };
      } else {
        console.error(
          "Unable to parse address_street and address_city for pck_ID:",
          item.pck_ID
        );
        nulledItems.push(item);
        return null;
      }
    } catch (error) {
      console.error("Error creating position for pck_ID:", item.pck_ID, error);
      nulledItems.push(item);
      return null;
    }
  });

  const validPositions = positions.filter((pos) => pos !== null);
  const coordinates = await fetchBatchAddresses(validPositions);

  const newDatabasePromises = preDatabase
    .filter((_, index) => positions[index] !== null)
    .map(async (item, index) => {
      const pckSenderString = item.pck_sender;
      const pckSenderObject = parseSerializedString(pckSenderString);

      const pckReceiverString = item.pck_receiver;
      const pckReceiverObject = parseSerializedString(pckReceiverString);

      const coordinate = coordinates[index];
      item.lat = coordinate.lat;
      item.lng = coordinate.lng;

      return {
        ...item,
        pck_sender: pckSenderObject,
        pck_receiver: pckReceiverObject,
      };
    });

  const newDatabase = await Promise.all(newDatabasePromises);
  return { newDatabase, nulledItems };
}

export default extractSenderAndReceiverInfo;
