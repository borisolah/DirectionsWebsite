import React, { useState } from "react";
import { Select, VStack, Wrap, HStack } from "@chakra-ui/react";
import TruckForm from "./AutoHozzaadas";
import SoforForm from "./SoforHozzaadas";
import TelephelyForm from "./TelephelyHozzaadas";
import PartnerForm from "./PartnerModositas/PartnerForm";
import DijtablakForm from "./DijtablakHozzaadas"; // Import the new component

function HozzadasForm() {
  const [selectedForm, setSelectedForm] = useState("truck");

  const handleChange = (e) => {
    setSelectedForm(e.target.value);
  };

  return (
    <Wrap
      spacing="5px"
      backgroundColor="gray.100"
      alignItems="center"
      justify="center"
      w="100%"
      flexGrow={1}
    >
      <HStack>
        <Select value={selectedForm} onChange={handleChange}>
          <option value="telephely">Telephely Hozzáadása</option>
          <option value="sofor">Sofőr Hozzáadása</option>
          <option value="truck">Autó Hozzáadása</option>
          <option value="partner">Partner Hozzáadása</option>
          <option value="dijtablak">Dijtáblák Hozzáadása</option>{" "}
          {/* Add the new selector option */}
        </Select>
      </HStack>
      <VStack
        spacing="5px"
        backgroundColor="gray.100"
        alignItems="center"
        justify="center"
        w="100%"
      >
        {selectedForm === "telephely" && <TelephelyForm />}
        {selectedForm === "sofor" && <SoforForm />}
        {selectedForm === "truck" && <TruckForm />}
        {selectedForm === "partner" && <PartnerForm />}
        {selectedForm === "dijtablak" && <DijtablakForm />}{" "}
        {/* Render the new component when selected */}
      </VStack>
    </Wrap>
  );
}

export default HozzadasForm;
