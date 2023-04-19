import React, { useState } from "react";
import { Text, Input, Flex, Checkbox, HStack, Button } from "@chakra-ui/react";
import useCreateOrUpdateData from "../../../../../hooks/useCreateOrUpdateData";

function TeljesDijtabla({ currentUgyfel }) {
  const [checkedRaklapos, setCheckedRaklapos] = useState(false);
  const [checkedNemRaklapos, setCheckedNemRaklapos] = useState(false);
  const [discountA, setDiscountA] = useState("");
  const [discountB, setDiscountB] = useState("");
  const { createOrUpdateData, loading, error } = useCreateOrUpdateData();
  console.log("TeljesDijtabla currentUgyfel:", currentUgyfel);

  const handleRaklaposCheckboxChange = (e) => {
    setCheckedRaklapos(e.target.checked);
  };

  const handleNemRaklaposCheckboxChange = (e) => {
    setCheckedNemRaklapos(e.target.checked);
  };

  const handleDiscountAChange = (e) => {
    setDiscountA(e.target.value);
  };

  const handleDiscountBChange = (e) => {
    setDiscountB(e.target.value);
  };

  const handleSaveClick = async () => {
    const data = {
      dijtabla: {},
    };

    if (checkedRaklapos) {
      data.dijtabla.raklapos = {
        discountA: discountA,
        discountB: discountB,
      };
    }

    if (checkedNemRaklapos) {
      data.dijtabla.nemRaklapos = {
        discountA: discountA,
        discountB: discountB,
      };
    }

    const url = currentUgyfel
      ? `/api/ugyfelek/${currentUgyfel.id}`
      : "/api/ugyfelek";

    console.log("handleSaveClick data:", data);
    console.log("handleSaveClick url:", url);

    await createOrUpdateData(url, data);
  };

  return (
    <>
      <HStack>
        <Flex>
          <Checkbox
            isChecked={checkedRaklapos}
            name="Raklapos"
            onChange={handleRaklaposCheckboxChange}
          >
            Raklapos
          </Checkbox>
          <Checkbox
            isChecked={checkedNemRaklapos}
            name="NemRaklapos"
            onChange={handleNemRaklaposCheckboxChange}
          >
            Nem Raklapos
          </Checkbox>
        </Flex>
        <Text>"A" Dijtábla Kedvezmény</Text>
        <Input
          type="number"
          placeholder="A Dijtábla Kedvezmény"
          value={discountA}
          onChange={handleDiscountAChange}
        />
        <Text>%</Text>
      </HStack>
      <HStack>
        <Text>"B" Dijtábla Kedvezmény</Text>
        <Input
          type="number"
          placeholder="B Dijtábla Kedvezmény"
          value={discountB}
          onChange={handleDiscountBChange}
        />
        <Text>%</Text>
      </HStack>
      <Button onClick={handleSaveClick} isLoading={loading} mt={4}>
        Dijtábla Mentése
      </Button>
      {error && <Text color="red.500">Error: {error.message}</Text>}
    </>
  );
}

export default TeljesDijtabla;
