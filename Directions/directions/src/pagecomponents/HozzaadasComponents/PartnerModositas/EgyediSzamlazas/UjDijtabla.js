import React, { useState } from "react";
import {
  Text,
  Input,
  HStack,
  Flex,
  VStack,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import useCreateOrUpdateData from "../../../../hooks/useCreateOrUpdateData";

function UjDijtabla({ currentUgyfel }) {
  const [rows, setRows] = useState([{ netto: 0 }]);
  const [checkedRaklapos, setCheckedRaklapos] = useState(false);
  const [checkedNemRaklapos, setCheckedNemRaklapos] = useState(false);
  const { createOrUpdateData, loading, error } = useCreateOrUpdateData();

  console.log(currentUgyfel, "currentugyfel");
  const handleNettoChange = (e, index) => {
    const newRows = [...rows];
    newRows[index].netto = e.target.value;
    setRows(newRows);
  };
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

  const calculateBrutto = (netto) => {
    const brutto = Number(netto) * 1.27;
    return brutto.toFixed(2);
  };

  const addRow = () => {
    setRows([...rows, { kgTol: "", kgIg: "", netto: 0 }]);
  };

  const handleRaklaposCheckboxChange = (e) => {
    setCheckedRaklapos(e.target.checked);
  };

  const handleNemRaklaposCheckboxChange = (e) => {
    setCheckedNemRaklapos(e.target.checked);
  };
  const handleSaveClick = async () => {
    console.log("handleSaveClick rows:", rows);

    const data = {};

    if (checkedRaklapos) {
      data.raklapos = rows.map((row) => ({
        kgTol: row.kgTol,
        kgIg: row.kgIg,
        netto: row.netto,
        brutto: calculateBrutto(row.netto),
      }));
      console.log("handleSaveClick raklapos:", data.raklapos);
    }

    if (checkedNemRaklapos) {
      data.nemRaklapos = rows.map((row) => ({
        kgTol: row.kgTol,
        kgIg: row.kgIg,
        netto: row.netto,
        brutto: calculateBrutto(row.netto),
      }));
      console.log("handleSaveClick nemRaklapos:", data.nemRaklapos);
    }

    console.log("handleSaveClick data:", data);

    const url = currentUgyfel
      ? `/api/ugyfelek/${currentUgyfel.id}`
      : "/api/ugyfelek";
    console.log("handleSaveClick url:", url);

    await createOrUpdateData(url, data);
  };

  return (
    <VStack spacing={4}>
      <HStack>
        <Checkbox
          isChecked={checkedRaklapos}
          name="Raklapos"
          onChange={handleRaklaposCheckboxChange}
        >
          Raklapos
        </Checkbox>
        <Checkbox
          isChecked={checkedNemRaklapos}
          name="NemRaklapos"
          onChange={handleNemRaklaposCheckboxChange}
        >
          Nem Raklapos
        </Checkbox>
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

      <Button onClick={addRow} colorScheme="green">
        Add
      </Button>
      <Button onClick={handleSaveClick} isLoading={loading} mt={4}>
        Dijtábla Mentése
      </Button>
      {error && <Text color="red.500">Error: {error.message}</Text>}
    </VStack>
  );
}

export default UjDijtabla;
