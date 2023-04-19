import React, { useState } from "react";
import {
  HStack,
  Input,
  Button,
  FormControl,
  CheckboxGroup,
  Checkbox,
  Text,
} from "@chakra-ui/react";
import useCreateOrUpdateData from "../../../../../hooks/useCreateOrUpdateData";

function EgysegesDarabszamDij({ currentUgyfel }) {
  const [netto, setNetto] = useState(0);
  const [checkedRaklapos, setCheckedRaklapos] = useState(false);
  const [checkedNemRaklapos, setCheckedNemRaklapos] = useState(false);
  const { createOrUpdateData } = useCreateOrUpdateData();

  const handleNettoChange = (e) => {
    setNetto(e.target.value);
  };

  const handleRaklaposChange = (e) => {
    setCheckedRaklapos(e.target.checked);
  };

  const handleNemRaklaposChange = (e) => {
    setCheckedNemRaklapos(e.target.checked);
  };

  const calculateBrutto = () => {
    const brutto = Number(netto) * 1.27;
    return brutto.toFixed(2);
  };

  const handleSaveClick = async () => {
    const data = {};

    if (checkedRaklapos) {
      data.raklapos = {
        netto: netto,
        brutto: calculateBrutto(),
      };
    }

    if (checkedNemRaklapos) {
      data.nemRaklapos = {
        netto: netto,
        brutto: calculateBrutto(),
      };
    }

    const url = currentUgyfel
      ? `/api/ugyfelek/${currentUgyfel.id}`
      : "/api/ugyfelek";
    await createOrUpdateData(url, data);
  };

  return (
    <FormControl>
      <CheckboxGroup>
        <HStack>
          <Checkbox value="raklapos" onChange={handleRaklaposChange}>
            Raklapos
          </Checkbox>
          <Checkbox value="nemRaklapos" onChange={handleNemRaklaposChange}>
            Nem raklapos
          </Checkbox>
        </HStack>
      </CheckboxGroup>
      <HStack spacing={4}>
        <Text>Nettó:</Text>
        <Input type="number" value={netto} onChange={handleNettoChange} />
        <Text>Ft</Text>
        <Text>Bruttó:</Text>
        <Input type="number" value={calculateBrutto()} readOnly />
        <Text>Ft</Text>
      </HStack>
      <Button colorScheme="blue" mt={4} onClick={handleSaveClick}>
        Díjtábla mentése
      </Button>
    </FormControl>
  );
}

export default EgysegesDarabszamDij;
