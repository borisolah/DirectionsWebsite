import React from "react";
import { Button, Text, VStack } from "@chakra-ui/react";
import EgyediSzamlazas from "./EgyediSzamlazas";

function OptionDetails({ partner, option, onBackClick, currentUgyfel }) {
  return (
    <VStack>
      <Text fontSize="2xl">{partner.name}</Text>

      <EgyediSzamlazas
        option={option}
        currentUgyfel={currentUgyfel}
        onBackClick={onBackClick}
      />
    </VStack>
  );
}

export { OptionDetails };
