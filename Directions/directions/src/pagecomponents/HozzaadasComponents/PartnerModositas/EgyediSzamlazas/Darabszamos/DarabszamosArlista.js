import React, { useState } from "react";
import {
  Checkbox,
  Spacer,
  CheckboxGroup,
  FormControl,
  HStack,
} from "@chakra-ui/react";
import UjDijtabla from "../UjDijtabla";
import EgysegesDarabszamDij from "../../../../EgysegesDarabszamDij";

function DarabszamosArlista() {
  const [egysegesDarabszamDij, setEgysegesDarabszamDij] = useState(false);
  const [savosDarabszam, setSavosDarabszam] = useState(false);

  const handleEgysegesDarabszamDijChange = (e) => {
    setEgysegesDarabszamDij(e.target.checked);
  };

  const handleSavosDarabszamChange = (e) => {
    setSavosDarabszam(e.target.checked);
  };

  return (
    <FormControl>
      <CheckboxGroup>
        <HStack>
          <Checkbox
            value="egysegesDarabszamDij"
            onChange={handleEgysegesDarabszamDijChange}
          >
            Egységes darabszám dij
          </Checkbox>{" "}
          <Spacer />
          <Checkbox
            value="savosDarabszam"
            onChange={handleSavosDarabszamChange}
          >
            Sávos Darabszám
          </Checkbox>
        </HStack>
      </CheckboxGroup>
      {egysegesDarabszamDij && <EgysegesDarabszamDij />}
      {savosDarabszam && <UjDijtabla />}
    </FormControl>
  );
}

export default DarabszamosArlista;
