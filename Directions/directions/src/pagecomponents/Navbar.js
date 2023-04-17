import React from "react";
import { Box, Flex, Link, Center } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export const Navbar = ({ isMap }) => {
  const bg = isMap ? "transparent" : "gray.100";
  const position = isMap ? "fixed" : "sticky"; // Change this line
  const zIndex = isMap ? 10 : "sticky"; // Changed this line

  return (
    <Box
      bg={bg}
      position={position}
      top={0}
      zIndex={zIndex} // Changed this line
      boxShadow="sm"
      p="2"
    >
      <Center h="100%">
        <Flex alignItems="center" justifyContent="center">
          <Link
            as={RouterLink}
            to="/"
            fontSize="lg"
            fontWeight="semibold"
            px="4"
          >
            Hozzáadás
          </Link>
          <Link
            as={RouterLink}
            to="/map"
            fontSize="lg"
            fontWeight="semibold"
            px="4"
          >
            Map
          </Link>
        </Flex>
      </Center>
    </Box>
  );
};

export default Navbar;
