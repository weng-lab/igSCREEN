"use client";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  List,
  ListItem,
  ListItemText,
  FormGroup,
  Checkbox,
  IconButton,
  Button,
} from "@mui/material";
import CellLineageTree, {
  cellTypeConfig,
  getCellImagePath,
  NodeInfo,
} from "common/components/CellLineageTree";
import React, { useCallback, useMemo, useState } from "react";
import MultiSelect from "../celllineage/_components/multiselect";
import Image from "next/image";
import { BarChartOutlined, Close, Sync } from "@mui/icons-material";
import { gql } from "types/generated";
import { useLazyQuery } from "@apollo/client";
import { AssayEnum } from "types/generated/graphql";
import NewUpSetPlot, { UpSetPlotDatum } from "app/celllineage/NewUpSetPlot";
import { v4 as uuidv4 } from "uuid";

type Assay = "DNase" | "ATAC";

export type CCRE_CLASS = "CA-CTCF" | "CA-TF" | "CA-H3K4me3" | "TF" | "CA" | "pELS" | "dELS" | "PLS";

const GET_UPSET_COUNTS = gql(`
  query GetIcreCounts(
    $targetedcelltypes: [String!]!
    $icreclasses: [String!]
    $assay: AssayEnum!
  ) {
    upsetploticrecounts(
      targetedcelltypes: $targetedcelltypes
      icreclasses: $icreclasses
      assay: $assay
    ) {
      count
      includedCelltypes
      excludedCelltypes
    }
  }
`);

const GET_UPSET_FILE = gql(`
  query getSetFile(
    $celltypes: [[String]]
    $excludecelltypes: [[String]]
    $dnasecelltypes: [[String]]
    $dnaseexcludecelltypes: [[String]]
    $uuid: String!
    $group: [String!]
  ) {
    createicresFilesQuery(
      uuid: $uuid
      celltypes: $celltypes
      excludecelltypes: $excludecelltypes
      dnasecelltypes: $dnasecelltypes
      dnaseexcludecelltypes: $dnaseexcludecelltypes
      group: $group
    )
  }
`);

const ccreClasses: {
  label: string;
  class: CCRE_CLASS;
}[] = [
  {
    label: "Chromatin Accessible with CTCF",
    class: "CA-CTCF",
  },
  {
    label: "Chromatin Accessible with TF",
    class: "CA-TF",
  },
  {
    label: "Chromatin Accessible with H3K4me3",
    class: "CA-H3K4me3",
  },
  {
    label: "Chromatin Accessible Only",
    class: "CA",
  },
  {
    label: "TF",
    class: "TF",
  },
  {
    label: "Proximal Enhancer",
    class: "pELS",
  },
  {
    label: "Distal Enhancer",
    class: "dELS",
  },
  {
    label: "Promoter",
    class: "PLS",
  },
];

type SelectedCelltype = NodeInfo & {
  /**
   * Stimulated data exists for cell in current assay
   */
  hasStim: boolean;
  /**
   * Unstimulated data exists for cell in current assay
   */
  hasUnstim: boolean;
  /**
   * checkbox value
   */
  stim: boolean;
  /**
   * checkbox value
   */
  unstim: boolean;
};



const CellLineagePage = () => {
  const [selectedAssay, setSelectedAssay] = useState<Assay>("ATAC");
  const [selectedCelltypes, setSelectedCelltypes] = useState<SelectedCelltype[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<{ label: string; class: CCRE_CLASS }[]>(ccreClasses);
  const selectedCelltypeNames = useMemo(() => selectedCelltypes.map((x) => x.celltype), [selectedCelltypes]);
  const selectedCellsWithStim = useMemo(() => selectedCelltypes.reduce((prev: string[], current: SelectedCelltype) => {
    const x = [...prev]
    if (current.stim) x.push(current.celltype + '-Stim')
    if (current.unstim) x.push(current.celltype + "-Unstim");
    return x
  }, []), [selectedCelltypes]);

  const handleAssayChange = (assay: Assay) => {
    setSelectedCelltypes([]);
    setSelectedAssay(assay);
  };

  /**
   * Toggles a cell between selected/unselected.
   */
  const handleNodeClick = useCallback(
    (node: NodeInfo) => {
      if (selectedCelltypeNames.includes(node.celltype)) {
        setSelectedCelltypes(selectedCelltypes.filter((x) => x.celltype !== node.celltype));
      } else {
        const hasStim = cellTypeConfig[node.celltype][selectedAssay].Stim;
        const hasUnstim = cellTypeConfig[node.celltype][selectedAssay].Unstim;
        setSelectedCelltypes([
          ...selectedCelltypes,
          {
            ...node,
            hasStim,
            stim: hasStim,
            hasUnstim,
            unstim: hasUnstim,
          },
        ]);
      }
    },
    [selectedAssay, selectedCelltypeNames, selectedCelltypes]
  );

  const handleChangeStim = useCallback(
    (cell: SelectedCelltype, modify: "stim" | "unstim", checked: boolean) => {
      const newSelected = [...selectedCelltypes]
      newSelected.find(x => x.celltype === cell.celltype)[modify] = checked
      setSelectedCelltypes(newSelected);
    },
    [selectedCelltypes]
  );

  const [getUpSetData, { data: UpSetData, loading: UpSetLoading, error: UpSetError }] = useLazyQuery(GET_UPSET_COUNTS);
  const [getUpSetFile, { data: UrlData, loading: UrlLoading, error: UrlError }] = useLazyQuery(GET_UPSET_FILE);

  const handleGenerateUpSet = useCallback(() => {
    if (selectedCellsWithStim.length > 6) {
      window.alert("UpSet can only be generated with <= 6 cells")
      return
    }
    getUpSetData({
      variables: {
        assay: selectedAssay === "ATAC" ? AssayEnum.Atac : AssayEnum.Dnase,
        targetedcelltypes: selectedCellsWithStim,
        icreclasses:
          selectedClasses.length === ccreClasses.length ? undefined : selectedClasses.map((x) => x.class),
      },
    })
  }, [selectedAssay, selectedCellsWithStim, selectedClasses])

  const handleUpSetBarClick = useCallback((grouping: UpSetPlotDatum) => {
    const vars = selectedAssay === "ATAC" ?
    {
      celltypes: grouping.includedCelltypes.map(x => [x]),
      excludecelltypes: grouping?.excludedCelltypes?.length > 0 ? grouping.excludedCelltypes.map(x => [x]) : undefined
    }
    :
    {
      dnasecelltypes: grouping.includedCelltypes.map(x => [x]),
      dnaseexcludecelltypes: grouping?.excludedCelltypes?.length > 0 ? grouping.excludedCelltypes.map(x => [x]) : undefined
    }
    getUpSetFile({variables: {
      ...vars,
      group: selectedClasses.length === ccreClasses.length ? undefined : selectedClasses.map((x) => x.class),
      uuid: uuidv4()
    }}).then(x => console.log(x.data.createicresFilesQuery))
  }, []) 

  return (
    <Stack alignItems={"center"} spacing={2} m={2}>
      <FormControl>
        <FormLabel id="assay-radio">Assay</FormLabel>
        <RadioGroup
          row
          aria-labelledby="assay-radio"
          value={selectedAssay}
          onChange={(_, value) => handleAssayChange(value as Assay)}
        >
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
      <MultiSelect
        options={ccreClasses}
        value={selectedClasses}
        onChange={(_, value) => {
          setSelectedClasses(value);
        }}
        placeholder="Include iCRE classes"
        limitTags={2}
      />
      <List sx={{ width: "100%", maxWidth: "500px" }} disablePadding>
        {selectedCelltypes.map((cell, i) => (
          <ListItem key={i} disablePadding>
            <IconButton onClick={() => handleNodeClick(cell)}>
              <Close />
            </IconButton>
            <Image width={40} height={40} src={getCellImagePath(cell.celltype)} alt={cell.celltype + " Image"} />
            {!cell.stim && !cell.unstim ? (
              <ListItemText sx={{ paddingX: 1 }}>
                <s>{cell.celltype}</s>
              </ListItemText>
            ) : (
              <ListItemText sx={{ paddingX: 1 }}>{cell.celltype}</ListItemText>
            )}
            <FormGroup row sx={{ flexShrink: 0 }}>
              <FormControlLabel
                disabled={!cell.hasStim}
                control={
                  <Checkbox
                    size="small"
                    checked={cell.stim}
                    onChange={(_, checked) => handleChangeStim(cell, "stim", checked)}
                  />
                }
                label="S"
              />
              <FormControlLabel
                disabled={!cell.hasUnstim}
                control={
                  <Checkbox
                    size="small"
                    checked={cell.unstim}
                    onChange={(_, checked) => handleChangeStim(cell, "unstim", checked)}
                  />
                }
                label="U"
              />
            </FormGroup>
          </ListItem>
        ))}
      </List>
      <Button
        loading={UpSetLoading}
        loadingPosition="end"
        disabled={selectedCelltypes.length === 0}
        endIcon={UpSetData ? <Sync /> : <BarChartOutlined />}
        variant="contained"
        onClick={handleGenerateUpSet}
      >
        <span>
          {UpSetLoading
            ? "Generating"
            : selectedCelltypes.length === 0
            ? "Select Cells to Generate UpSet"
            : "Generate UpSet"}
        </span>
      </Button>
      {UpSetData && (
        <NewUpSetPlot
          width={700}
          height={500}
          data={UpSetData.upsetploticrecounts}
          onBarClicked={handleUpSetBarClick}
          // reference={ref}
          loadingDownload={UpSetLoading}
        />
      )}
    </Stack>
  );
};

export default CellLineagePage;
