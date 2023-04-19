import React, { useState } from "react";
import { Flex, Input, Button, Checkbox, Select } from "@chakra-ui/react";
import useCreateOrUpdateData from "../../../hooks/useCreateOrUpdateData";

const DijtablaCheckboxes = ({ dijtablas, currentUgyfel }) => {
  const [selectedDijtabla, setSelectedDijtabla] = useState(null);
  const [dijtakInputs, setDijtakInputs] = useState({});
  const [checkedRaklapos, setCheckedRaklapos] = useState(false);
  const [checkedNemRaklapos, setCheckedNemRaklapos] = useState(false);
  const { createOrUpdateData, loading, error } = useCreateOrUpdateData();

  console.log(currentUgyfel, "CURRENTUGYFEL");
  const handleDijtablaChange = (dijtablaId) => {
    const dijtabla = dijtablas.find((d) => d._id === dijtablaId);

    if (dijtabla) {
      setSelectedDijtabla(dijtablaId);
      setDijtakInputs({ ...dijtakInputs, [dijtablaId]: dijtabla.dijtak });
    }
  };

  const renderDijtakInputs = () => {
    if (!selectedDijtabla) return null;

    const dijtak = dijtakInputs[selectedDijtabla];
    const inputs = [];

    dijtak.forEach((dijt, index) => {
      const { kgTol, kgIg, netto, brutto } = dijt;

      if (
        kgTol !== null &&
        kgTol !== undefined &&
        kgIg !== null &&
        kgIg !== undefined
      ) {
        inputs.push(
          <div key={`${selectedDijtabla}-${index}`} style={{ display: "flex" }}>
            <Input value={`Tól: ${kgTol}`} isDisabled={true} />
            <Input value={`Ig: ${kgIg}`} isDisabled={true} />
            <Input value={`Nettó: ${netto}`} isDisabled={true} />
            <Input value={`Bruttó: ${brutto}`} isDisabled={true} />
          </div>
        );

        if ((index + 1) % 4 === 0) {
          inputs.push(<br key={`break-${selectedDijtabla}-${index}`} />);
        }
      }
    });

    return inputs;
  };
  const handleSaveClick = async () => {
    if (!selectedDijtabla || !currentUgyfel) return;

    const dijtak = dijtakInputs[selectedDijtabla];
    const url = `/api/ugyfelek/${currentUgyfel._id}`;

    const data = {
      raklapos: checkedRaklapos ? dijtak : undefined,
      nemRaklapos: checkedNemRaklapos ? dijtak : undefined,
    };

    await createOrUpdateData(url, data);
  };

  return (
    <React.Fragment>
      <Flex>
        <Flex>
          <Checkbox
            isChecked={checkedRaklapos}
            onChange={(e) => setCheckedRaklapos(e.target.checked)}
          >
            Raklapos
          </Checkbox>
          <Checkbox
            isChecked={checkedNemRaklapos}
            onChange={(e) => setCheckedNemRaklapos(e.target.checked)}
          >
            Nem Raklapos
          </Checkbox>
        </Flex>

        <Select
          placeholder="Válasszon egy dijtáblát"
          onChange={(e) => handleDijtablaChange(e.target.value)}
        >
          {dijtablas &&
            dijtablas.map((dijtabla) => (
              <option key={dijtabla._id} value={dijtabla._id}>
                {dijtabla.dijtablaNeve}
              </option>
            ))}
        </Select>
      </Flex>
      <Flex wrap="wrap">{renderDijtakInputs()}</Flex>
      <Button
        mt={4}
        colorScheme="blue"
        onClick={handleSaveClick}
        isLoading={loading}
      >
        Dijtábla Mentése
      </Button>
    </React.Fragment>
  );
};

export default DijtablaCheckboxes;
