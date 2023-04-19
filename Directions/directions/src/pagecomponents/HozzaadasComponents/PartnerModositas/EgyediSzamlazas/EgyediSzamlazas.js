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
import KilometerDija from "./KilometerDijas/KilometerDija";

function EgyediSzamlazas({ option, currentUgyfel, onBackClick }) {
  console.log(currentUgyfel, "ASDASD");
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
      <KilometerDija currentUgyfel={currentUgyfel} onBackClick={onBackClick} />
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
        {teljesDijtablaChecked && (
          <TeljesDijtabla currentUgyfel={currentUgyfel} />
        )}
        {ujDijtablaChecked && <UjDijtabla currentUgyfel={currentUgyfel} />}

        <Button onClick={onBackClick} mt={4} colorScheme="red">
          Back
        </Button>
      </FormControl>
    );
  } else if (option === "árlista") {
    return (
      <DarabszamosArlista
        currentUgyfel={currentUgyfel}
        onBackClick={onBackClick}
      />
    );
  } else {
    return null;
  }
}

export default EgyediSzamlazas;
