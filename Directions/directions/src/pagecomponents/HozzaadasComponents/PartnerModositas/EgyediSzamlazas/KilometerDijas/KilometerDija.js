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

function KilometerDija({ currentUgyfel, onBackClick }) {
  const [kmDij, setKmDij] = useState(0);
  const [checkedRaklapos, setCheckedRaklapos] = useState(false);
  const [checkedNemRaklapos, setCheckedNemRaklapos] = useState(false);
  const { createOrUpdateData } = useCreateOrUpdateData();

  const handleKmDijChange = (e) => {
    setKmDij(e.target.value);
  };

  const handleRaklaposChange = (e) => {
    setCheckedRaklapos(e.target.checked);
  };

  const handleNemRaklaposChange = (e) => {
    setCheckedNemRaklapos(e.target.checked);
  };

  const handleSaveClick = async () => {
    const data = {};

    if (checkedRaklapos) {
      data.raklapos = {
        kmDij: kmDij,
      };
    }

    if (checkedNemRaklapos) {
      data.nemRaklapos = {
        kmDij: kmDij,
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
        <Text>Kilóméter dija:</Text>
        <Input type="number" value={kmDij} onChange={handleKmDijChange} />
        <Text>Ft</Text>
      </HStack>
      <Button onClick={onBackClick} mt={4} colorScheme="red">
        Back
      </Button>
      <Button colorScheme="blue" mt={4} onClick={handleSaveClick}>
        Díjtábla mentése
      </Button>
    </FormControl>
  );
}

export default KilometerDija;
