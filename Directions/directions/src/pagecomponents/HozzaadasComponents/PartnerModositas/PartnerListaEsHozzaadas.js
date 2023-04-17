import React from "react";
import { Box, Text, VStack, Button, useToast, HStack } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import AddPartnerForm from "../PartnerHozzaadas";
import usePostData from "../../../hooks/usePostData"; // Import the usePostData hook

function PartnerList({ partners, onPartnerClick, onAddPartner }) {
  const toast = useToast();
  const { postData, loading, error } = usePostData(); // Use the hook

  const processExcelData = async (excelData) => {
    try {
      for (const row of excelData) {
        const [nev, telephoneNumber, email, cim] = row;
        console.log(nev, telephoneNumber, email, cim);
        await postData("http://localhost:3500/api/ugyfelek", {
          nev,
          telephoneNumber,
          email,
          cim,
        });
      }
    } catch (err) {
      console.error("Error in processExcelData:", err);
      throw err;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ".xls,.xlsx",
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach(async (file) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const excelData = XLSX.utils.sheet_to_json(firstSheet, {
            header: 1,
          });

          try {
            await processExcelData(excelData);

            toast({
              title: "Excel file uploaded",
              description: "Your Excel file has been uploaded and processed.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          } catch (err) {
            console.error("Error while uploading file:", err);

            toast({
              title: "Error",
              description: err.message,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        };
        reader.readAsArrayBuffer(file);
      });
    },
  });

  return (
    <VStack>
      <HStack>
        <AddPartnerForm onAddPartner={onAddPartner} />
        <Box {...getRootProps()}>
          <input {...getInputProps()} />
          <Button colorScheme="blue">
            {isDragActive ? "Drop Excel file here" : "Upload Excel"}
          </Button>
        </Box>
      </HStack>
      <Box
        height="70vh"
        overflowY="auto"
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.300"
        mt={4}
      >
        <VStack>
          {partners.map((partner) => (
            <Text
              key={partner.id}
              onClick={() => onPartnerClick(partner)}
              p={2}
              cursor="pointer"
              _hover={{ backgroundColor: "gray.200" }}
            >
              {partner.name}
            </Text>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
}

export { PartnerList };
