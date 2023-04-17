import React, { useState } from "react";
import { HStack, Input, Text } from "@chakra-ui/react";

function EgysegesDarabszamDij() {
  const [netto, setNetto] = useState(0);

  const handleNettoChange = (e) => {
    setNetto(e.target.value);
  };

  const calculateBrutto = () => {
    const brutto = Number(netto) * 1.27;
    return brutto.toFixed(2);
  };

  return (
    <HStack spacing={4}>
      <Text>Nettó:</Text>
      <Input type="number" value={netto} onChange={handleNettoChange} />
      <Text>Ft</Text>
      <Text>Bruttó:</Text>
      <Input type="number" value={calculateBrutto()} readOnly />
      <Text>Ft</Text>
    </HStack>
  );
}

export default EgysegesDarabszamDij;
