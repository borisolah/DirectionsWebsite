import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { PartnerList } from "./PartnerListaEsHozzaadas";
import { PartnerDetails } from "./PartnerModositas";
import { OptionDetails } from "./EgyediSzamlazas/OptionDetails";
import useFetchUgyfelek from "../../../hooks/useFetchUgyfelek";

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
      <Text fontSize="xl">Partnerek Módositása És Hozzáadása</Text>
      {!selectedOption && !selectedPartner && (
        <PartnerList
          partners={partners}
          onPartnerClick={(partner) => setSelectedPartner(partner)}
        />
      )}

      {selectedPartner && !selectedOption && (
        <PartnerDetails
          partner={selectedPartner}
          onOptionClick={(option) => setSelectedOption(option)}
          onBackClick={() => setSelectedPartner(null)}
        />
      )}

      {selectedOption && (
        <OptionDetails
          partner={selectedPartner}
          option={selectedOption}
          onBackClick={() => setSelectedOption(null)}
        />
      )}
    </Box>
  );
}
export default PartnerForm;
