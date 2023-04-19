import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Select,
  HStack,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import usePostData from "../../hooks/usePostData";

const inputOptions = {
  borderColor: "gray.600",
  borderWidth: "2px",
};

const SoforForm = () => {
  const { postData, loading, error } = usePostData();
  const [soforData, setSoforData] = useState({ ervenyesKategoriak: [] });

  const handleSubmit = (e) => {
    e.preventDefault();
    postData("http://localhost:3500/api/sofors", soforData);
  };
  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSoforData({
        ...soforData,
        ervenyesKategoriak: [...soforData.ervenyesKategoriak, e.target.name],
      });
    } else {
      setSoforData({
        ...soforData,
        ervenyesKategoriak: soforData.ervenyesKategoriak.filter(
          (category) => category !== e.target.name
        ),
      });
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setSoforData({ ...soforData, [e.target.name]: value });
  };

  const categories = [
    "AM",
    "A1",
    "A2",
    "A",
    "B1",
    "B",
    "C1",
    "C",
    "D1",
    "D",
    "BE",
    "C1E",
    "CE",
    "D1E",
    "DE",
    "T",
    "K",
  ];

  return (
    <Box backgroundColor="gray.100" w="400px">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="nev">
            <FormLabel>Név:</FormLabel>
            <Input
              name="nev"
              type="text"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="anya-neve">
            <FormLabel>Anya Neve:</FormLabel>
            <Input
              name="anyaNeve"
              type="text"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="szuletesi-datum">
            <FormLabel>Születési Dátum:</FormLabel>
            <Input
              name="szuletesiDatum"
              type="date"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="telefonszam">
            <FormLabel>Telefonszám:</FormLabel>
            <Input
              name="telefonszam"
              type="tel"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="varos">
            <FormLabel>Város:</FormLabel>
            <Input
              name="varos"
              type="text"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="ervenyes-kategoriak">
            <FormLabel>Érvényes Kategóriák:</FormLabel>
            <CheckboxGroup colorScheme="blue">
              <VStack spacing={4}>
                <HStack spacing={4}>
                  {categories.slice(0, 6).map((category) => (
                    <Checkbox
                      key={category}
                      name={category}
                      value={category}
                      onChange={handleCheckboxChange}
                    >
                      {category}
                    </Checkbox>
                  ))}
                </HStack>
                <HStack spacing={4}>
                  {categories.slice(6, 12).map((category) => (
                    <Checkbox
                      key={category}
                      name={category}
                      value={category}
                      onChange={handleCheckboxChange}
                    >
                      {category}
                    </Checkbox>
                  ))}
                </HStack>
                <HStack spacing={4}>
                  {categories.slice(12).map((category) => (
                    <Checkbox
                      key={category}
                      name={category}
                      value={category}
                      onChange={handleCheckboxChange}
                    >
                      {category}
                    </Checkbox>
                  ))}
                </HStack>
              </VStack>
            </CheckboxGroup>
          </FormControl>

          <FormControl id="munkaviszony-kezdete">
            <FormLabel>Munkaviszony Kezdete:</FormLabel>
            <Input
              name="munkaviszonyKezdete"
              type="date"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>

          <Button colorScheme="blue" mt={4} type="submit" isLoading={loading}>
            Sofőr Hozzáadása
          </Button>
          {error && <p>Error: {error.message}</p>}
        </VStack>
      </form>
    </Box>
  );
};

export default SoforForm;
