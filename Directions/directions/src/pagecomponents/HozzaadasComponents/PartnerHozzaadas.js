import React, { useState } from "react";
import { Box, Button, Input, VStack } from "@chakra-ui/react";
import usePostData from "../../hooks/usePostData"; // Import the custom hook

function AddPartnerForm() {
  const [showForm, setShowForm] = useState(false);
  const [nev, setNev] = useState("");
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [cim, setCim] = useState("");
  const { postData, loading, error } = usePostData(); // Use the custom hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUgyfel = { nev, telephoneNumber, email, cim };
    await postData("http://localhost:3500/api/ugyfelek", newUgyfel); // Specify the full URL
    // Handle the response as needed (e.g., clear form, show error message, etc.)
    if (!error) {
      setNev("");
      setTelephoneNumber("");
      setEmail("");
      setCim("");
      setShowForm(false);
    } else {
      console.error(error);
    }
  };

  const handleButtonClick = () => {
    setShowForm(!showForm);
  };

  return (
    <Box>
      <Button onClick={handleButtonClick} colorScheme="teal">
        Partner Hozzáadása{" "}
      </Button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          {" "}
          {/* Add the onSubmit handler */}
          <VStack mt={4} spacing={2}>
            <Input
              placeholder="Partner Name"
              value={nev} // Add value
              onChange={(e) => setNev(e.target.value)} // Add onChange
            />
            <Input
              placeholder="Telephone Number"
              value={telephoneNumber} // Add value
              onChange={(e) => setTelephoneNumber(e.target.value)} // Add onChange
            />
            <Input
              placeholder="Email"
              value={email} // Add value
              onChange={(e) => setEmail(e.target.value)} // Add onChange
            />
            <Input
              placeholder="CIM"
              value={cim} // Add value
              onChange={(e) => setCim(e.target.value)} // Add onChange
            />
            <Button mt={4} colorScheme="teal" type="submit">
              {" "}
              {/* Add type="submit" */}
              Hozzáadás
            </Button>
          </VStack>
        </form>
      )}
    </Box>
  );
}

export default AddPartnerForm;
