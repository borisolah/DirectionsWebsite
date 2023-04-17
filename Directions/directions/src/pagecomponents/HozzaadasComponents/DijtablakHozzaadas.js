import React, { useState } from "react";
import { Text, Input, HStack, Flex, VStack, Button } from "@chakra-ui/react";
import axios from "axios";

function DijtablakForm() {
  const [dijtablaNeve, setDijtablaNeve] = useState("");
  const handleDijtablaNeveChange = (e) => setDijtablaNeve(e.target.value);
  const [rows, setRows] = useState([
    { kgTol: 0, kgIg: 0, netto: 0, brutto: 0 },
  ]);

  const handleKgTolChange = (e, index) => {
    const newRows = [...rows];
    newRows[index].kgTol = e.target.value;
    setRows(newRows);
  };

  const handleKgIgChange = (e, index) => {
    const newRows = [...rows];
    newRows[index].kgIg = e.target.value;
    setRows(newRows);
  };

  const handleNettoChange = (e, index) => {
    const newRows = [...rows];
    newRows[index].netto = e.target.value;
    newRows[index].brutto = calculateBrutto(e.target.value);
    setRows(newRows);
  };

  const calculateBrutto = (netto) => {
    const brutto = Number(netto) * 1.27;
    return brutto.toFixed(2);
  };

  const addRow = () => {
    setRows([...rows, { kgTol: 0, kgIg: 0, netto: 0, brutto: 0 }]);
  };

  const handleAddDijtabla = async () => {
    try {
      const dijtak = rows.map((row) => ({
        ...row,
        brutto: calculateBrutto(row.netto),
      }));

      const response = await axios.post("http://localhost:3500/api/dijtablak", {
        dijtablaNeve,
        dijtak: rows,
      });

      console.log("Dijtabla saved:", response.data);
    } catch (error) {
      console.error("Error saving dijtabla:", error);
    }
  };

  return (
    <VStack spacing={4}>
      <HStack>
        <Text>Dijtábla Neve</Text>
        <Input
          value={dijtablaNeve}
          onChange={handleDijtablaNeveChange}
          placeholder="Dijtábla Neve"
        />
        <Button
          onClick={handleAddDijtabla}
          minWidth="160px"
          background="blue.400"
        >
          Dijtábla Hozzáadása
        </Button>
      </HStack>
      {rows.map((row, index) => (
        <HStack key={index} spacing={4}>
          <Flex direction="column" alignItems="center">
            <Text>Kg-tól</Text>
            <Input
              type="number"
              placeholder="Kg-tól"
              value={row.kgTol}
              onChange={(e) => handleKgTolChange(e, index)}
            />
          </Flex>
          <Flex direction="column" alignItems="center">
            <Text>Kg-ig</Text>
            <Input
              type="number"
              placeholder="Kg-ig"
              value={row.kgIg}
              onChange={(e) => handleKgIgChange(e, index)}
            />
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
      <Button onClick={addRow} background="green.500">
        Add
      </Button>
    </VStack>
  );
}

export default DijtablakForm;
