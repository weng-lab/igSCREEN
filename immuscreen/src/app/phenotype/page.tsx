"use client"
import { gql, useQuery } from "@apollo/client";
import { Autocomplete, Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slider, Stack, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";
import { client } from "../../common/utils";
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';
import LDSCplot from "./LDSC";

export type LDSCDataPoint = {
  snps: number,
  study: string,
  h2: number,
  enrichment: number,
  enrichment_p: number,
  enrichment_std_error: number,
  coefficient: number,
  coefficient_zscore: number,
  coefficient_std_error: number,
  celltype: string
}

export default function Phenotype() {
  const [selectedStudy, setSelectedStudy] = useState<string>("EBI_MultipleSclerosis_Sawcer2011")
  const [pValCutoff, setPValCutoff] = useState<number>(0.05)
  const [stimView, setStimView] = useState<"S" | "U" | "B">("B")

  /**
   * @todo type gql stuff https://www.apollographql.com/docs/react/development-testing/static-typing/
   */
  const ICRE_STUDIES = gql`
    {
      iCRELdrStudiesQuery
    }
  `

  const { data: dataStudies, loading: loadingStudies, error: errorStudies } = useQuery(ICRE_STUDIES, { client })


  const LDSC_QUERY = gql`
    query LDSC(
      $study: [String]
    ){
      iCRELdrQuery(study: $study) {
        snps
        study
        h2
        enrichment
        enrichment_p
        enrichment_std_error
        coefficient
        coefficient_zscore
        coefficient_std_error
        celltype
      }
    }
  `

  const { data: dataLDSC, loading: loadingLDSC, error: errorLDSC } = useQuery(
    LDSC_QUERY,
    {
      client,
      variables: { study: selectedStudy },
      skip: !selectedStudy
    }
  )

  const studies: string[] = dataStudies && dataStudies.iCRELdrStudiesQuery

  const rawData: LDSCDataPoint[] = dataLDSC && dataLDSC.iCRELdrQuery

  const pValMarks = [
    {
      value: 0,
      scaledValue: 0.0001,
      label: 0.0001
    },
    {
      value: 1,
      scaledValue: 0.001,
      label: 0.001
    },
    {
      value: 2,
      scaledValue: 0.01,
      label: 0.01
    },
    {
      value: 3,
      scaledValue: 0.05,
      label: 0.05
    },
    {
      value: 4,
      scaledValue: 1,
      label: 1
    },
  ]

  const scale = (value: number) => {
    return pValMarks.find(x => x.value === value).scaledValue
  };

  return (
    <Grid2 container mt={3}>
      <Grid2 xs={12}>
        <Box margin={"auto"} maxWidth={600} display={"flex"} flexDirection={"column"} gap={2}>
          <Autocomplete
            fullWidth
            options={studies ?? []}
            renderInput={(params) => <TextField {...params} label="Study" />}
            value={selectedStudy}
            onChange={(_, value) => setSelectedStudy(value)}
          />
          <Box>
            <FormLabel>P-value Cutoff</FormLabel>
            <Slider
              min={0}
              max={4}
              defaultValue={3}
              scale={scale}
              aria-label="Restricted values"
              onChange={(event: Event, value: number, activeThumb: number) => setPValCutoff(scale(value))}
              getAriaValueText={(value: number, index: number) => value.toString()}
              step={null}
              valueLabelDisplay="auto"
              marks={pValMarks}
            />
          </Box>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Showing experiments in cells that are: </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue={"B"}
              onChange={(_, value: "B" | "U" | "S") => setStimView(value)}
            >
              <FormControlLabel
                value="B" 
                control={<Radio />}
                label={
                  <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                    <Typography>Unstimulated & Stimulated</Typography>
                    <CircleIcon fontSize="small" color="primary" sx={{fontSize: 13, opacity: 0.6}} />
                    <SquareIcon color="primary" sx={{rotate: "45deg", fontSize: 11, opacity: 0.6}} />
                  </Stack>
                }
              />
              <FormControlLabel
                value="U"
                control={<Radio />}
                label={
                  <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                    <Typography>Unstimulated</Typography>
                    <CircleIcon fontSize="small" color="primary" sx={{fontSize: 13, opacity: 0.6}} />
                  </Stack>
                }
              />
              <FormControlLabel 
              value="S"
               control={<Radio />} 
               label={
                <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                  <Typography>Stimulated</Typography>
                  <SquareIcon color="primary" sx={{rotate: "45deg", fontSize: 11, opacity: 0.6}} />
                </Stack>
              }
               />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid2>
      <Grid2 margin={"auto"}>
        {rawData && <LDSCplot width={1200} height={600} data={rawData} pValCutoff={pValCutoff} stimView={stimView} />}
      </Grid2>
    </Grid2>
  )
}
