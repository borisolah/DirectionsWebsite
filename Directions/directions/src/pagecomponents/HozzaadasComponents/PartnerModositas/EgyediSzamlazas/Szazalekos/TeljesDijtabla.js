import React from "react";
import { Text, Input, HStack } from "@chakra-ui/react";

function TeljesDijtabla() {
  return (
    <>
      <HStack>
        <Text>"A" Dijtábla Kedvezmény</Text>
        <Input type="number" placeholder="A Dijtábla Kedvezmény" />
        <Text>%</Text>
      </HStack>
      <HStack>
        <Text>"B" Dijtábla Kedvezmény</Text>
        <Input type="number" placeholder="B Dijtábla Kedvezmény" />
        <Text>%</Text>
      </HStack>
    </>
  );
}

export default TeljesDijtabla;
