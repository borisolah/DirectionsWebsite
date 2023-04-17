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

const TruckForm = () => {
  const { postData, loading, error } = usePostData();
  const [truckData, setTruckData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    postData("http://localhost:3500/api/trucks", truckData);
  };

  const handleChange = (e) => {
    setTruckData({ ...truckData, [e.target.name]: e.target.value });
  };

  return (
    <Box backgroundColor="gray.100" w="400px">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="dernszam">
            <FormLabel>Rendszám:</FormLabel>
            <Input
              name="rendszam"
              type="text"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="biztositas-kezdete">
            <FormLabel>Biztosítás Kezdete:</FormLabel>
            <Input
              name="biztositasKezdete"
              type="date"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="muszaki-ev">
            <FormLabel>Műszaki Év:</FormLabel>
            <Input
              name="muszakiEv"
              type="number"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="sajat-tomeg">
            <FormLabel>Saját Tömeg:</FormLabel>
            <Input
              name="sajatTomeg"
              type="number"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="ossztomeg">
            <FormLabel>Össztömeg:</FormLabel>
            <Input
              name="ossztomeg"
              type="number"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="terheles">
            <FormLabel>Terhelés:</FormLabel>
            <Input
              name="terheles"
              type="number"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl id="sofor">
            <FormLabel>Sofőr:</FormLabel>
            <Select
              name="sofor"
              placeholder="Válassz egy sofőrt"
              sx={inputOptions}
              onChange={handleChange}
            >
              <option value="sofor1">Sofőr 1</option>
              <option value="sofor2">Sofőr 2</option>
              <option value="sofor3">Sofőr 3</option>
            </Select>
          </FormControl>

          <FormControl id="auto-neve">
            <FormLabel>Autó Neve:</FormLabel>
            <Input
              name="autoNeve"
              type="text"
              sx={inputOptions}
              onChange={handleChange}
            />
          </FormControl>
          <Button colorScheme="blue" mt={4} type="submit" isLoading={loading}>
            Autó Hozzáadása
          </Button>
          {error && <p>Error: {error.message}</p>}
        </VStack>
      </form>
    </Box>
  );
};

export default TruckForm;
