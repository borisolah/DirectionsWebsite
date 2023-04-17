import React, { useState } from "react";
import {
  Button,
  Text,
  VStack,
  HStack,
  Spacer,
  Input,
  Checkbox,
  CheckboxGroup,
  FormControl,
} from "@chakra-ui/react";
import TeljesDijtabla from "./Szazalekos/TeljesDijtabla";
import UjDijtabla from "./UjDijtabla";
import DarabszamosArlista from "./Darabszamos/DarabszamosArlista";

function OptionForm({ option }) {
  const [teljesDijtablaChecked, setTeljesDijtablaChecked] = useState(false);
  const [ujDijtablaChecked, setUjDijtablaChecked] = useState(false);
  const handleUjDijtablaChange = (e) => {
    setUjDijtablaChecked(e.target.checked);
  };
  const handleTeljesDijtablaChange = (e) => {
    setTeljesDijtablaChecked(e.target.checked);
  };
  if (option === "kmDij") {
    return (
      <HStack>
        <Text>Kilóméter dija</Text>
        <Spacer />
        <Input placeholder="Kilóméter dija" />
        <Spacer />
        <Text>Ft</Text>
      </HStack>
    );
  } else if (option === "kedvezmeny") {
    return (
      <FormControl>
        <CheckboxGroup>
          <HStack>
            <Checkbox
              value="teljesDijtabla"
              onChange={handleTeljesDijtablaChange}
            >
              Teljes Dijtábla
            </Checkbox>{" "}
            <Spacer />
            <Checkbox value="ujDijtabla" onChange={handleUjDijtablaChange}>
              Új Dijtábla Megadása
            </Checkbox>
          </HStack>
        </CheckboxGroup>
        {teljesDijtablaChecked && <TeljesDijtabla />}
        {ujDijtablaChecked && <UjDijtabla />}
      </FormControl>
    );
  } else if (option === "árlista") {
    return <DarabszamosArlista />;
  } else {
    return null;
  }
}

function OptionDetails({ partner, option, onBackClick }) {
  return (
    <VStack>
      <Text fontSize="2xl">{partner.name}</Text>
      <Text>{option}</Text>

      <OptionForm option={option} />

      <Button onClick={onBackClick} mt={4} colorScheme="red">
        Back
      </Button>
    </VStack>
  );
}

export { OptionDetails };
