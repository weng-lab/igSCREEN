"use client";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Stack } from "@mui/material";
import CellLineageTree, { cellTypeConfig, NodeInfo } from "common/components/CellLineageTree";
import React, { useCallback, useMemo, useState } from "react";

type Assay = "DNase" | "ATAC"

const CellLineagePage = () => {
  const [selectedAssay, setSelectedAssay] = useState<Assay>("ATAC");
  const [selectedCelltypes, setSelectedCelltypes] = useState<{ celltype: string; stim: boolean; unstim: boolean }[]>(
    []
  );
  const [selectedClasses, setSelectedClasses] = useState<
    ("CA-CTCF" | "CA-TF" | "CA-H3K4me3" | "TF" | "CA" | "pELS" | "dELS" | "PLS")[]
  >([]);

  const selectedCelltypeNames = useMemo(() => selectedCelltypes.map((x) => x.celltype), [selectedCelltypes]);

  const handleAssayChange = (assay: Assay) => {
    setSelectedCelltypes([])
    setSelectedAssay(assay);
  };

  const handleClassesChange = (
    classes: ("CA-CTCF" | "CA-TF" | "CA-H3K4me3" | "TF" | "CA" | "pELS" | "dELS" | "PLS")[]
  ) => {
    setSelectedClasses(classes);
  };

  const handleNodeClick = useCallback(
    (node: NodeInfo) => {
      if (selectedCelltypeNames.includes(node.celltype)) {
        setSelectedCelltypes(selectedCelltypes.filter((x) => x.celltype !== node.celltype));
      } else {
        const hasStim = cellTypeConfig[node.celltype][selectedAssay].Stim;
        const hasUnstim = cellTypeConfig[node.celltype][selectedAssay].Unstim;
        setSelectedCelltypes([...selectedCelltypes, { ...node, stim: hasStim, unstim: hasUnstim }]);
      }
    },
    [selectedAssay, selectedCelltypeNames, selectedCelltypes]
  );

  return (
    <Stack alignItems={"center"}>
      <FormControl>
        <FormLabel id="assay-radio">Assay</FormLabel>
        <RadioGroup row aria-labelledby="assay-radio" value={selectedAssay} onChange={(_, value) => handleAssayChange(value as Assay)}>
          <FormControlLabel value="ATAC" control={<Radio />} label="ATAC" />
          <FormControlLabel value="DNase" control={<Radio />} label="DNase" />
        </RadioGroup>
      </FormControl>
      <CellLineageTree
        width={900}
        height={1100}
        onNodeClicked={handleNodeClick}
        assay={selectedAssay}
        selected={selectedCelltypeNames.length > 0 ? selectedCelltypeNames : null}
      />
    </Stack>
  );
};

export default CellLineagePage;
