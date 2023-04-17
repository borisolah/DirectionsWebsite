import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Select,
} from "@chakra-ui/react";
import usePostData from "../../hooks/usePostData";

const inputOptions = {
  borderColor: "gray.600",
  borderWidth: "2px",
};

const SoforForm = () => {
  const { postData, loading, error } = usePostData();
  const [soforData, setSoforData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    postData("http://localhost:3500/api/soforok", soforData);
  };

  const handleChange = (e) => {
    setSoforData({ ...soforData, [e.target.name]: e.target.value });
  };

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
            <Select
              name="ervenyesKategoriak"
              placeholder="Válassz kategóriát"
              sx={inputOptions}
              onChange={handleChange}
            >
              <option value="kat1">Kategória 1</option>
              <option value="kat2">Kategória 2</option>
              <option value="kat3">Kategória 3</option>
            </Select>
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
