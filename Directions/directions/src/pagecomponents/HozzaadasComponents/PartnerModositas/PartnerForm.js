import React, { useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { PartnerList } from "./PartnerListaEsHozzaadas";
import { PartnerModositasa } from "./PartnerModositas";
import useFetchUgyfelek from "../../../hooks/useFetchUgyfelek";
import EgyediSzamlazasiModKlikk from "./EgyediSzamlazas/EgyediSzamlazas";

function PartnerForm() {
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const { data: ugyfelek, loading, error } = useFetchUgyfelek();
  const partners = ugyfelek.map((ugyfel) => ({
    name: ugyfel.nev,
    id: ugyfel._id,
  }));
  return (
    <Box zIndex={10} backgroundColor="gray.100" boxShadow="sm" p={4}>
      <Box width="100%" textAlign="center">
        <Text fontSize="xl">Partnerek Módositása És Hozzáadása</Text>
      </Box>{" "}
      {!selectedOption && !selectedPartner && (
        <PartnerList
          partners={partners}
          onPartnerClick={(partner) => setSelectedPartner(partner)}
        />
      )}
      {selectedPartner && !selectedOption && (
        <PartnerModositasa
          currentUgyfel={selectedPartner}
          partner={selectedPartner}
          onOptionClick={(option) => setSelectedOption(option)}
          onBackClick={() => setSelectedPartner(null)}
        />
      )}
      {selectedOption && (
        <EgyediSzamlazasiModKlikk
          currentUgyfel={selectedPartner}
          partner={selectedPartner}
          option={selectedOption}
          onBackClick={() => setSelectedOption(null)}
        />
      )}
    </Box>
  );
}
export default PartnerForm;
