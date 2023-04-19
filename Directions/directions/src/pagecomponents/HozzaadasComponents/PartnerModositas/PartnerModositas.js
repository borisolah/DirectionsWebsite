import React, { useState, useEffect } from "react";
import {
  Flex,
  Button,
  Input,
  Text,
  Checkbox,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import useFetchUgyfelek from "../../../hooks/useFetchUgyfelek";
import usePutData from "../../../hooks/usePutData";
import useFetchDijtablas from "../../../hooks/useFetchDijtablas";
import DijtablaCheckboxes from "./DijtablaCheckboxes";

function PartnerModositasa({ partner, onOptionClick, onBackClick }) {
  const { data: ugyfelek, loading, error } = useFetchUgyfelek();
  const [modositas, setModositas] = useState(false);
  const [editableUgyfel, setEditableUgyfel] = useState(null);
  const [currentUgyfel, setCurrentUgyfel] = useState(null);
  const { putData, loading: putLoading, error: putError } = usePutData();
  const [checkedA, setCheckedA] = useState(false);
  const [checkedB, setCheckedB] = useState(false);
  const [checkedEgyedi, setCheckedEgyedi] = useState(false);

  const {
    data: dijtablas,
    loading: dijtablasLoading,
    error: dijtablasError,
  } = useFetchDijtablas();

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    if (name === "A") {
      setCheckedA(checked);
      if (checked) setCheckedEgyedi(false);
    } else if (name === "B") {
      setCheckedB(checked);
      if (checked) setCheckedEgyedi(false);
    } else if (name === "Egyedi") {
      setCheckedEgyedi(checked);
      if (checked) {
        setCheckedA(false);
        setCheckedB(false);
      }
    }
  };

  const handleInputChange = (event, field) => {
    setEditableUgyfel({ ...editableUgyfel, [field]: event.target.value });
  };

  const handleSaveChanges = async () => {
    await putData(
      `http://localhost:3500/api/ugyfelek/${currentUgyfel._id}`,
      editableUgyfel
    );
    setModositas(false);
  };

  useEffect(() => {
    if (ugyfelek && partner) {
      const foundUgyfel = ugyfelek.find((ugyfel) => ugyfel._id === partner.id);
      setCurrentUgyfel(foundUgyfel);
    }
  }, [ugyfelek, partner]);

  useEffect(() => {
    if (currentUgyfel) {
      setEditableUgyfel({ ...currentUgyfel });
    }
  }, [currentUgyfel]);

  return (
    <VStack>
      {currentUgyfel && (
        <>
          <Text fontSize="2xl">{currentUgyfel.nev}</Text>
          <Flex direction="row" w="100%" justifyContent="space-between">
            <FormControl>
              <Checkbox
                isChecked={modositas}
                onChange={(e) => setModositas(e.target.checked)}
              >
                Módositás
              </Checkbox>
              {modositas && (
                <Button onClick={handleSaveChanges} mt={4}>
                  Módositás
                </Button>
              )}
              <FormLabel>Telephone number</FormLabel>
              <Input
                value={editableUgyfel?.telephoneNumber || ""}
                readOnly={!modositas}
                onChange={(e) => handleInputChange(e, "telephoneNumber")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={editableUgyfel?.email || ""}
                readOnly={!modositas}
                onChange={(e) => handleInputChange(e, "email")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Cim</FormLabel>
              <Input
                value={editableUgyfel?.cim || ""}
                readOnly={!modositas}
                onChange={(e) => handleInputChange(e, "cim")}
              />
            </FormControl>
          </Flex>
          <FormLabel>Számlázási mód</FormLabel>
          <Flex>
            <DijtablaCheckboxes
              dijtablas={dijtablas}
              currentUgyfel={currentUgyfel}
            />
          </Flex>{" "}
          <Checkbox
            isChecked={checkedEgyedi}
            isDisabled={checkedA || checkedB}
            name="Egyedi"
            onChange={handleCheckboxChange}
          >
            Egyedi
          </Checkbox>
          {checkedEgyedi && (
            <>
              <Flex>
                <Button onClick={() => onOptionClick("kmDij")}>
                  Kilóméter Dijas Szállitás
                </Button>
                <Button onClick={() => onOptionClick("kedvezmeny")}>
                  Százalékos kedvezmény
                </Button>
                <Button onClick={() => onOptionClick("árlista")}>
                  Darabszámos Árlista
                </Button>
              </Flex>
            </>
          )}
          <Flex>
            <Button onClick={onBackClick} mt={4} colorScheme="red">
              Back
            </Button>
          </Flex>
        </>
      )}
    </VStack>
  );
}

export { PartnerModositasa };
