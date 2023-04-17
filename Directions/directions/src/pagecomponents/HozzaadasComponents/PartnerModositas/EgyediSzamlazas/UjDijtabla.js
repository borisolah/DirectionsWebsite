import React, { useState } from "react";
import { Text, Input, HStack, Flex, VStack, Button } from "@chakra-ui/react";

function UjDijtabla() {
  const [rows, setRows] = useState([{ netto: 0 }]);

  const handleNettoChange = (e, index) => {
    const newRows = [...rows];
    newRows[index].netto = e.target.value;
    setRows(newRows);
  };

  const calculateBrutto = (netto) => {
    const brutto = Number(netto) * 1.27;
    return brutto.toFixed(2);
  };

  const addRow = () => {
    setRows([...rows, { netto: 0 }]);
  };

  return (
    <VStack spacing={4}>
      {rows.map((row, index) => (
        <HStack key={index} spacing={4}>
          <Flex direction="column" alignItems="center">
            <Text>Kg-tól</Text>
            <Input type="number" placeholder="Kg-tól" />
          </Flex>
          <Flex direction="column" alignItems="center">
            <Text>Kg-ig</Text>
            <Input type="number" placeholder="Kg-ig" />
          </Flex>
          <Flex direction="column" alignItems="center">
            <Text>Nettó/Bruttó</Text>
            <HStack>
              <Input
                type="number"
                placeholder="Nettó"
                value={row.netto}
                onChange={(e) => handleNettoChange(e, index)}
              />
              <Text>Ft</Text>
              <Input
                type="number"
                placeholder="Bruttó"
                value={calculateBrutto(row.netto)}
                readOnly
              />
            </HStack>
          </Flex>
        </HStack>
      ))}
      <Button onClick={addRow} colorScheme="green">
        Add
      </Button>
    </VStack>
  );
}

export default UjDijtabla;
