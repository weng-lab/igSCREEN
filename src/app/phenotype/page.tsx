"use client"
import { gql, useQuery } from "@apollo/client";
import { Autocomplete, Box, CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Slider, Stack, TextField, Typography } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState, useMemo } from "react";
import { client } from "../../common/utils";
import ChangeHistoryTwoToneIcon from '@mui/icons-material/ChangeHistoryTwoTone';
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import LDSCplot from "./ldsc";
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility";
export type LDSCDataPoint = {
  snps: number,
  study: string,
  stimulation: string,
  h2: number,
  enrichment: number,
  enrichment_p: number,
  enrichment_std_error: number,
  coefficient: number,
  coefficient_zscore: number,
  coefficient_std_error: number,
  celltype: string,
  expvalue: string,
  lineage: string,
  biosample: string,
  biosampleid: string,
  source: string
}

export default function Phenotype() {
  const [selectedStudy, setSelectedStudy] = useState<string>("BCX2.BasophilCount")
  const [pValCutoff, setPValCutoff] = useState<number>(0.05)
  const [stimView, setStimView] = useState<"S" | "U" | "B">("B")
  
  /**
   * @todo type gql queries and return data https://www.apollographql.com/docs/react/development-testing/static-typing/
   */
  const ICRE_STUDIES = gql`
    {
      iCRELdscStudiesQuery {
        disease
        author
        value
        category
        study_source
      }
    }
  `

const { data: dataStudies } = useQuery(ICRE_STUDIES, { client })

  const iCRE_LDSC_QUERY = gql`
    query getLDSCValues(
      $study: [String]!
    ){
      iCRELdscQuery(study: $study) {
        study
        expvalue
        source
        celltype      
        lineage        
        biosample      
        biosampleid        
        stimulation
        
        study_source        
        disease      
        category

        snps
        h2
        h2_std_error
        enrichment
        enrichment_std_error
        enrichment_p
        coefficient
        coefficient_std_error
        coefficient_zscore
      }
    }
  `
 
  const { data: dataiCRELDSC, loading: loadingiCRELDSC } = useQuery(
    iCRE_LDSC_QUERY,
    {
      client,
      variables: { study: selectedStudy },
      skip: !selectedStudy
    }
  )
  
  const legendEntries = useMemo(() => {
    if (!dataiCRELDSC) return [];
      // Count occurrences of each unique cellType
      const cellTypeCounts = dataiCRELDSC.iCRELdscQuery.reduce((acc, point) => {
        const cellType = point.lineage;
        acc.set(cellType, (acc.get(cellType) || 0) + 1);
        return acc;
      }, new Map<string, number>());

      return Array.from(cellTypeCounts.entries()).map(([cellType, count]) => ({
        label: getCellCategoryDisplayname(cellType),
        color: getCellCategoryColor(cellType),
        value: count
      })).sort((a,b) => b.value - a.value);
    
  }, [dataiCRELDSC]);
  
  let LDSCStudies =  dataStudies && dataStudies.iCRELdscStudiesQuery 

  const rawData: LDSCDataPoint[] = dataiCRELDSC && dataiCRELDSC.iCRELdscQuery

  // In the slider, the "value" is used to place marks equally on track. The scale function below is used to pull out the true value that we want
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
    (<Grid2 container mt={3}>
      
      <Grid2 size={12}>
        <Box margin={"auto"} maxWidth={600} display={"flex"} flexDirection={"column"} gap={2}>
          <Box>
            <Typography variant="h4">LD Score Regression by Phenotype</Typography>
          </Box>
          <Typography>Select a phenotype to explore its heritability enrichment (calculated by LD score regression) within 736 immune cell experiments.</Typography>
          {LDSCStudies && LDSCStudies.length >0 && 
          <Autocomplete
            fullWidth
            options={LDSCStudies.slice().sort((a, b) => a.category.localeCompare(b.category))}
            groupBy={(option) => option.category}
            getOptionLabel={(option) => option.disease}
            renderInput={(params) => <TextField {...params} label="Select Study" />}
            filterOptions={(options, { inputValue }) =>
              options.filter(
                (option) =>
                  option.disease.toLowerCase().includes(inputValue.toLowerCase()) ||
                  option.category.toLowerCase().includes(inputValue.toLowerCase())
              )
            }
            value={LDSCStudies.find((l) => l.value === selectedStudy)}
            onChange={(_, value) => value && setSelectedStudy(value.value)}
            renderOption={(props, option) => (
              <li {...props}>
                <div>
                  <Typography variant="body1">{option.disease}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {option.study_source}{":"}
                    {option.author}
                  </Typography>
                </div>
              </li>
            )}
          />}
          <Box>
            <FormLabel><i>P</i> Cutoff</FormLabel>
            <Slider
              min={0} //Min/Max is 0/4 since that is the true value of the marks above
              max={4}
              defaultValue={3}
              scale={scale} //Allows the slider to access the scaled values which we want displayed
              aria-label="Restricted values"
              onChange={(event: Event, value: number, activeThumb: number) => setPValCutoff(scale(value))} //Sets p value cutoff to scaled value
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
                    <CircleTwoToneIcon fontSize="small" color="primary" sx={{ fontSize: 12 }} />
                    <ChangeHistoryTwoToneIcon color="primary" sx={{ fontSize: 14 }} />
                  </Stack>
                }
              />
              <FormControlLabel
                value="U"
                control={<Radio />}
                label={
                  <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                    <Typography>Unstimulated</Typography>
                    <CircleTwoToneIcon fontSize="small" color="primary" sx={{ fontSize: 12 }} />
                  </Stack>
                }
              />
              <FormControlLabel
                value="S"
                control={<Radio />}
                label={
                  <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                    <Typography>Stimulated</Typography>
                    <ChangeHistoryTwoToneIcon color="primary" sx={{ fontSize: 14 }} />
                  </Stack>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid2>
      <Grid2 margin={"auto"}>
        {loadingiCRELDSC ?
          <CircularProgress />
          :
          rawData && <LDSCplot width={1200} height={400} data={rawData} pValCutoff={pValCutoff} stimView={stimView} legendEntries={legendEntries}/>
        }
        
      </Grid2>
    </Grid2>)
  );
}