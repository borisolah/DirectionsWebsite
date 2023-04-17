import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import usePostData from "../../hooks/usePostData";

const inputOptions = {
  borderColor: "gray.600",
  borderWidth: "2px",
};

function TelephelyForm() {
  const { postData, loading, error } = usePostData();
  const [telephelyData, setTelephelyData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    postData("http://localhost:3500/api/telephelyek", telephelyData);
  };

  const handleChange = (e) => {
    setTelephelyData({ ...telephelyData, [e.target.name]: e.target.value });
  };

  return (
    <Box zIndex={10} backgroundColor="gray.100" boxShadow="sm">
      <Flex alignItems="center" justifyContent="center">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Név:</FormLabel>
              <Input
                name="nev"
                type="text"
                sx={inputOptions}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Cim:</FormLabel>
              <Input
                name="cim"
                type="text"
                sx={inputOptions}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Raktárvezető:</FormLabel>
              <Input
                name="raktarvezeto"
                type="text"
                sx={inputOptions}
                onChange={handleChange}
              />
            </FormControl>
            <Button colorScheme="blue" mt={4} type="submit" isLoading={loading}>
              Telephely Hozzáadása
            </Button>
            {error && <p>Error: {error.message}</p>}
          </VStack>
        </form>
      </Flex>
    </Box>
  );
}

export default TelephelyForm;
