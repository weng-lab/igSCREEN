'use client'
import * as React from "react"
import CellTypeTree from "../../common/components/cellTypeTree"
import { Ref, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import { gql, useLazyQuery } from "@apollo/client";
import { client } from "../../common/utils";
import UpSetPlot from "./UpSetPlot";
import { v4 as uuidv4 } from 'uuid'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined';
import FlashOffOutlinedIcon from '@mui/icons-material/FlashOffOutlined';
import FlashAutoIcon from '@mui/icons-material/FlashAuto';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import { ArrowRight, Circle, Download, Sync } from "@mui/icons-material";
import { downloadSVG, extractQueryValues, generateCellLineageTreeState } from "./utils";
import { CellQueryValue, CellLineageTreeState, CellName, DynamicCellTypeInfo } from "./types";
import { cellTypeStaticInfo } from "../../common/consts";


type QueryGroup = {
  intersect?: CellQueryValue[][],
  exclude?: CellQueryValue[][],
  union?: CellQueryValue[],
  name: string
}

export type CCRE_CLASS = "CA-CTCF" | "CA-TF" | "CA-H3K4me3" | "TF" | "CA" | "pELS" | "dELS" | "PLS"

const classDisplaynames: { [key in CCRE_CLASS]: string } = {
  "CA-CTCF": "Chromatin Accessible with CTCF",
  "CA-TF": "Chromatin Accessible with TF",
  "CA-H3K4me3": "Chromatin Accessible with H3K4me3",
  "TF": "TF",
  "CA": "Chromatin Accessible Only",
  "pELS": "Proximal Enhancer-Like Signature",
  "dELS": "Distal Enhancer-Like Signature",
  "PLS": "Promoter-Like Signature"
}

/**
 * Initial configuration of the cell type tree
 * To break displayName into multiple lines in the tree, use '/' instead of a space
 */

export default function UpSet() {
  const [cellTypeState, setCellTypeState] = useState<CellLineageTreeState>(generateCellLineageTreeState([], true)) //state of tree
  const [stimulateMode, setStimulateMode] = useState<boolean>(false) //determines whether a click on the tree selects or stimulates cell
  //Modifications to tree and checkboxes wipe needed info for download, so store when generating:
  const [upSetCells, setUpSetCells] = useState<Partial<CellLineageTreeState>>({}) //stores array of selected cells when generating
  const [upSetClasses, setUpSetClasses] = useState<CCRE_CLASS[]>(null) //stores array of selected classes when generating
  const [upSetQueryGroups, setUpSetQueryGroups] = useState<{ [key: string]: QueryGroup }>(null) //stores groupings used to generate query (for DL)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [checkboxClasses, setCheckboxClasses] = useState<{ [key in CCRE_CLASS]: boolean }>({
    "CA-CTCF": true,
    "CA-TF": true,
    "CA-H3K4me3": true,
    "TF": true,
    "CA": true,
    "pELS": true,
    "dELS": true,
    "PLS": true
  })
  const [openSnackbar, setOpenSnackbar] = useState(false) //Snackbar is the popup alert component
  const [snackbarMessage, setSnackbarMessage] = useState(null)


  /**
   * Opens the snackbar (alert) with the passed message
   * @param message message to display on snackbar
   */
  const handleOpenSnackbar = (message: string) => {
    setSnackbarMessage(message)
    setOpenSnackbar(true);
  };


  /**
   * Closes the Snackbar (alert)
   * @param event 
   * @param reason 
   */
  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  /**
   * Applies the given stimulation status to all cells (If it doesn't exceed selection limit)
   * @param mode "U" | "S" | "B" the stimulation mode to apply to all cells
   */
  const handleStimulateAll = (mode: "U" | "S" | "B") => {
    const currentlySelected = Object.values(cellTypeState)
      .filter((x) => x.selected)
      .reduce((accumulator, current) => current.stimulated === "B" ? accumulator + 2 : accumulator + 1, 0)
    //If applying "B" stimulation status would exceed selection limit, stop and send alert to user.
    if (mode === "B" && (currentlySelected * 2) > cellTreeSelectionLimit) {
      handleOpenSnackbar("Unable to apply \"Both\" stimulation status due to selection limit (6)")
    } else {
      const newState: CellLineageTreeState = Object.fromEntries(Object.entries(cellTypeState).map(([key, value]: [CellName, DynamicCellTypeInfo]) => cellTypeStaticInfo[key].stimulable ? [key, {...value, stimulated: mode}] : [key, value])) as CellLineageTreeState
      setCellTypeState(newState)
    }
  }

  /**
   * Unselects all cells
   */
  const handleUnselectAll = () => {
    let newObj = { ...cellTypeState }
    for (let cellName in newObj) {
      newObj[cellName].selectable && (newObj[cellName].selected = false)
    }
    setCellTypeState(newObj)
  }

  /**
   * Toggles stimulation mode between true/false
   */
  const handleToggleStimulateMode = () => {
    setStimulateMode(!stimulateMode)
  }

  const GET_ICRE_FILE = gql`
    query getFile(
      $celltypes: [[String]]
      $excludecelltypes: [[String]]
      $uuid: String!
      $group: [String!]
    ) {
      createicresFilesQuery(
        uuid: $uuid
        celltypes: $celltypes
        excludecelltypes: $excludecelltypes
        group: $group
      )
    }
  `
  //Query for downloading set of iCREs. Fetches URL that is downloaded from
  const [getiCREFileURL, { data: data_download_url, loading: loading_download_url, error: error_download_url }] = useLazyQuery(GET_ICRE_FILE, { client })
  

  /**
   * Downloads the set of iCREs with the passed downloadKey. 
   * Download key is used to select a given QueryGroup from the upSetQueryGroups object state variable.
   * The key is either "Union_All", a cell name, or a combination of 1's and 0's for an intersection.
   * @param downloadKey 
   */
  const handleUpsetDownload = useCallback(async (downloadKey: string) => {
    try {
      setDownloading(true)
      const cellGroupings: QueryGroup = upSetQueryGroups[downloadKey]
      const res = await getiCREFileURL({
        variables: {
          uuid: uuidv4(),
          celltypes: cellGroupings?.union ? [[...cellGroupings.union]] : cellGroupings.intersect,
          excludecelltypes: cellGroupings?.exclude?.length > 0 ? cellGroupings.exclude : undefined,
          group: upSetClasses
        }
      })
      fetch(res.data.createicresFilesQuery)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob(); // Get the response body as a Blob
        })
        .then(blob => {
          const a = document.createElement('a');
          const blobUrl = URL.createObjectURL(blob);
          a.href = blobUrl;
          a.download = `${(downloadKey[0] === '0' || downloadKey[0] === '1') ? `Intersect_${cellGroupings.intersect.map(vals => vals[0]).flat().join('_')}_${cellGroupings.exclude.length > 0 ? `Except_${cellGroupings.exclude.map(vals => vals[0]).flat().join('_')}` : ''}` : downloadKey}.bed`
          a.click();
          URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
          console.error('Error fetching the file:', error);
        });
      setDownloading(false)
    } catch (error) {
      console.log("Something went wrong when attempting to download:\n" + error)
      setDownloading(false)
    }
  }, [setDownloading, upSetQueryGroups, upSetClasses, getiCREFileURL]);
  
  const svgRef = useRef<SVGSVGElement>(null)
  

  /**
   * Programmatically generates a gql document node with the needed queries for generating the UpSet plot
   * @param selectedCells
   * @param classes the selected cCRE classes
   * @returns gql query string for UpSet plot
   */
  const generateQuery = useCallback((selectedCellsState: Partial<CellLineageTreeState>, classes: CCRE_CLASS[]) => {
    //stores extracted relevant information from selectedCells for easier access
    let cells: { displayName: string, queryVals: CellQueryValue[] }[] = [];

    //Out of selectedCells, extract relevant information. Create two entries for cells with "B" stimulation to iterate through more easily later
    Object.entries(selectedCellsState).forEach(([key, value]: [CellName, DynamicCellTypeInfo]) => {
      const name = key.replace('-', '_')
      if (value.stimulated == "B") {
        cells.push({ displayName: name + '_U', queryVals: extractQueryValues(cellTypeStaticInfo[key], "U") })
        cells.push({ displayName: name + '_S', queryVals: extractQueryValues(cellTypeStaticInfo[key], "S") })
      } else cells.push({ displayName: name + '_' + value.stimulated, queryVals: extractQueryValues(cellTypeStaticInfo[key], value.stimulated) })
    })

    //Holds the combination of union/intersection/exlude and name for each query
    let queryGroups: QueryGroup[] = []

    //Union of all cells
    if (Object.keys(selectedCellsState).length > 0) {
      queryGroups.push({ union: Object.entries(selectedCellsState).map(([key, value]: [CellName, DynamicCellTypeInfo]) => extractQueryValues(cellTypeStaticInfo[key], value.stimulated)).flat(2), name: 'Union_All' })
    }

    //Individual counts
    cells.forEach((cell, i) => {
      //Need to pad name with underscore since GQL alias cannot start with number. Index attached to alias to preserve order
      queryGroups.push({ union: cell.queryVals, name: '_' + i.toString() + cell.displayName })
    })

    /**
     * Using binary strings to represent unique intersection/subtraction combinations for UpSet plot.
     * Binary strings from 1 to (2^n - 1) generated, and each celltype is mapped to an index/place 
     * in the string to determine if that cell is to be intersected or excluded/subtracted
     * 
     * Example for 2 cells, A and B:
     * 
     * A B
     * 0 1 -> exclude A, intersect B
     * 1 0 -> intersect A, exclude B
     * 1 1 -> intersect A and B, exclude none
     * 
     */
    let n = cells.length
    let binaryStrings: string[] = []
    for (let i = 1; i < (2 ** n); i++) {
      binaryStrings.push(i.toString(2).padStart(n, '0')) //Create array of binary strings
    }

    //For each binary string, assign each cell to be intersected or excluded based on 1/0 in string
    binaryStrings.forEach((str) => {
      let grouping: QueryGroup = { intersect: [], exclude: [], name: `UpSet_${str}` }
      for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) === '1') {
          grouping.intersect.push(cells[i].queryVals)
        } else grouping.exclude.push(cells[i].queryVals)
      }
      queryGroups.push(grouping)
    })

    // Store query groups used to generate plot. Set keys to match data used by UpSet plot
    setUpSetQueryGroups(Object.fromEntries(queryGroups.map(group => {
      let key: string;
      if (group.name === "Union_All") {
        key = "Union_All"
      } else if (group.name.includes("UpSet_")) {
        key = group.name.slice(6) // Ex: UpSet_0101 --> 0101
      } else if (group.name[0] === '_') {
        key = group.name.slice(2) //Ex: _01Bulk_B_U -> Bulk_B_U
      } else throw new Error("Error parsing queryGroups in setUpSetQueryGroups")
      return ([key, group])
    })))

    const iCREQuery = `{
      ${queryGroups.map(group => `${group.name}: iCREsCountQuery(
        ${generateQueryBody(group, classes)}
      )`).join('\n\n')}
    }`

    //Join query strings and parse into query document
    return (gql(iCREQuery))
  }, [])


  /**
   * @todo This is maybe a suboptimal way of generating queries. Maybe Directives would be better versus constructing these manually.
   * See https://graphql.org/learn/queries/#directives
   * and https://www.apollographql.com/blog/batching-client-graphql-queries#can-batching-be-done-manually
   * 
   * @param queryGroup
   * @param groups
   * @returns inside part of query to be used in iCREsCountQuery or createicresFilesQuery
   */
  const generateQueryBody = (queryGroup: QueryGroup, classes: CCRE_CLASS[]): string => {
    if (queryGroup.union) {
      return (
        //All passed as one nested array to get union of all
        `celltypes: [[\"${queryGroup.union.join('\", \"')}\"]]`
        + `group: [\"${classes.join('\", \"')}\"]`
      )
    } else if (queryGroup.intersect && !queryGroup.union) {
      return (
        `celltypes: [${queryGroup.intersect.map((vals: string[]) => `["${vals.join('", "')}"]`).join(', ')}]`
        + `${queryGroup?.exclude.length > 0 ? `\nexcludecelltypes: [${queryGroup.exclude.map((vals: string[]) => `["${vals.join('", "')}"]`).join(', ')}]` : ''}`
        + `group: [\"${classes.join('\", \"')}\"]`
      )
    } else if ((!queryGroup.intersect && !queryGroup.union) || (queryGroup.intersect && queryGroup.union)) {
      throw new Error("Something went wrong generating query groups, check: " + JSON.stringify(queryGroup))
    }
  }

  /**
   * Transforms return data into the format used by UpSet plot
   * @param data return data from gql
   * @returns data for use in making the UpSet plot
   */
  const transformtoUpSet = (data: { [key: string]: number }): { intersections: { name: string, count: number }[], counts: { name: string, count: number }[], order: string[] } => {
    let returnData: { intersections: { name: string, count: number }[], counts: { name: string, count: number }[], order: string[] } = { intersections: [], counts: [], order: [] }

    //Iterate through each query's return data
    Object.entries(data).forEach((x: [string, number]) => {
      //Union_All return data is not actually used to make the Plot, union size is just calculated. This checks to make sure that calculation is correct by comparing to expected value.
      if (x[0] === "Union_All") {
        const calculated = Object.entries(data)
          .filter(y => { return !(y[0] === "Union_All" || y[0].charAt(0) === "_") })
          .reduce((accumulator, element) => accumulator + element[1], 0)
        if (x[1] !== calculated) {
          throw new Error("Expected total union size doesn't match calculated total" + "Expected: " + x[1] + " Calculated: " + calculated)
        }
      } else if (x[0].charAt(0) === "_") { //If character is '_' it's the query for individual counts
        returnData.counts.push({ name: x[0].slice(2), count: x[1] }) //push cell name stripped of number and counts
        returnData.order.push(x[0].slice(1)) //For order, push cell stripped of leading underscore. Keep number for sorting
      } else if (x[0].includes("UpSet_")) {
        returnData.intersections.push({ name: x[0].slice(6), count: x[1] })
      } else throw new Error("Error parsing gql return data to UpSet data: Unknown key")
    })

    returnData.order = returnData.order.sort((a, b) => +a.charAt[0] - +b.charAt[0]).map(x => x.slice(1)) //sort returnData.order based on leading number, then strip leading numbers

    return (
      returnData
    )
  }

  /**
   * Stores selected cells and classes, and begins the fetch
   */
  const handleGenerateUpSet = () => {
    setUpSetCells(Object.fromEntries(Object.entries(cellTypeState).filter(([key, value]: [CellName, DynamicCellTypeInfo]) => value.selected)))
    setUpSetClasses(Object.entries(checkboxClasses).filter((x: [string, boolean]) => x[1]).map((y: [string, boolean]) => y[0] as CCRE_CLASS))
    getCountData()
  }

  const COUNT_QUERY = useMemo(() => {
    if (Object.keys(upSetCells).length > 0) {
      return (
        generateQuery(upSetCells, upSetClasses)
      )
    }
    //This is just a placeholder for when there is no valid query (no cells are selected). Never used. Seems suboptimal, probably a better way than this
    else return (
      gql`
        query count{
          iCREsCountQuery(
            celltypes: [[]]
          )
        }
        `
    )
  }, [upSetCells, upSetClasses, generateQuery])

  //Query for counts used to make UpSet
  const [getCountData, { data: data_count, loading: loading_count, error: error_count }] = useLazyQuery(COUNT_QUERY, { client })

  const cellTypeTreeWidth = 830
  const upSetWidth = 700
  const cellTreeSelectionLimit = 6

  const cellTypeTree = useMemo(() => {
    return (
      <CellTypeTree
        width={cellTypeTreeWidth}
        height={1100}
        orientation="vertical"
        cellTypeState={cellTypeState}
        setCellTypeState={setCellTypeState}
        stimulateMode={stimulateMode}
        setStimulateMode={setStimulateMode}
        selectionLimit={cellTreeSelectionLimit}
        triggerAlert={handleOpenSnackbar}
      />
    )
  }, [cellTypeState, stimulateMode])

  interface UpSetProps {
    data_count: any; // Should type this by properly typing return data from GQL
    upSetWidth: number;
    handleUpsetDownload: (downloadKey: string) => Promise<void>;
    downloading: boolean;
  }


  
  const UpSetWithRef = forwardRef((
    { data_count, upSetWidth, handleUpsetDownload, downloading }: UpSetProps,
    ref: Ref<SVGSVGElement>
  ) => {
    const upSet = useMemo(() => {
      if (data_count) {
        return (
          <UpSetPlot
            width={upSetWidth}
            height={500}
            data={transformtoUpSet(data_count)}
            handleDownload={handleUpsetDownload}
            reference={ref}
            loading={downloading}
          />
        );
      } else {
        return <></>;
      }
    }, [data_count, downloading, upSetWidth, handleUpsetDownload, ref]);
  
    return upSet;
  });
  //Needed to fix missing display name error. For some reason using forwardRef causes this issue
  UpSetWithRef.displayName = "UpSetPlot"

  
  //These boolean values are used to disable buttons in certain situaions
  const noneSelected = !Object.values(cellTypeState).map(x => x.selected).find(x => x)
  const noneStimulated = Object.entries(cellTypeState)
    .every(([key, value]: [CellName, DynamicCellTypeInfo]) => cellTypeStaticInfo[key].stimulable ? value.stimulated === "U" : true)
  const allStimulated = Object.entries(cellTypeState)
    .every(([key, value]: [CellName, DynamicCellTypeInfo]) => cellTypeStaticInfo[key].stimulable ? value.stimulated === "S": true)
  const allBothStimulated = Object.entries(cellTypeState)
    .every(([key, value]: [CellName, DynamicCellTypeInfo]) => cellTypeStaticInfo[key].stimulable ? value.stimulated === "B" : true)

  const groupCheckbox = (group: CCRE_CLASS, key: number) => {
    return (
      <FormControlLabel
        key={key}
        label={classDisplaynames[group]}
        slotProps={{ typography: { maxWidth: "10rem" } }}
        control={
          <Checkbox
            checked={checkboxClasses[group]}
            onChange={(_, checked) => setCheckboxClasses({ ...checkboxClasses, [group]: checked })}
          />
        }
      />)
  }

  const Checkboxes = () =>
    <>
      <Typography variant="h6">Immune cCRE classes to Include:</Typography>
      <FormControlLabel
        label="All Classes"
        control={
          <Checkbox
            checked={Object.values(checkboxClasses).every(val => val === true)}
            indeterminate={!Object.values(checkboxClasses).every(val => val === checkboxClasses.CA)}
            onChange={(_, checked) => setCheckboxClasses({
              "CA-CTCF": checked,
              "CA-TF": checked,
              "CA-H3K4me3": checked,
              "TF": checked,
              "CA": checked,
              "pELS": checked,
              "dELS": checked,
              "PLS": checked,
            })}
          />
        }
      />
      <Box sx={{ display: 'flex', flexWrap: "wrap", flexDirection: 'column', ml: 3, maxHeight: "12rem", gap: "1rem", alignContent: "flex-start" }}>
        {Object.keys(checkboxClasses).map((group: CCRE_CLASS, i) => groupCheckbox(group, i))}
      </Box>
    </>

  const HeaderAbout = () =>
    <Box maxWidth={cellTypeTreeWidth}>
      <Typography variant="h4">Immune cCRE Activity by Cell Type</Typography>
      <Typography mb={1}>Compare immune cCRE activity between selected immune cell types.</Typography>
      <Typography variant="h6">How to Use:</Typography>
      <List disablePadding dense sx={{mb: 2}}>
          <ListItem disablePadding>
              <ListItemIcon>
                <ArrowRight  />
              </ListItemIcon>
              <ListItemText>
                Click to select up to 6 cells.
              </ListItemText>
          </ListItem>
          <ListItem disablePadding>
              <ListItemIcon>
                <ArrowRight  />
              </ListItemIcon>
              <ListItemText>
              For stimulable cells, hold Option/Command (MacOS) or Alt/Windows (Windows) and click to stimulate cell.
              </ListItemText>
          </ListItem>
          <ListItem disablePadding>
              <ListItemIcon>
                <ArrowRight  />
              </ListItemIcon>
              <ListItemText>
              Stimulating a cell does not automatically select it.
              </ListItemText>
          </ListItem>
          <ListItem disablePadding>
              <ListItemIcon>
                <ArrowRight  />
              </ListItemIcon>
              <ListItemText>
              By default, all cells are unstimulated. Stimulable cells can be unstimulated, stimulated, or both (counts as two selections).
              </ListItemText>
          </ListItem>
          <ListItem disablePadding>
              <ListItemIcon>
                <ArrowRight  />
              </ListItemIcon>
              <ListItemText>
              The more cells types that are selected, the longer it will take to generate.
              </ListItemText>
          </ListItem>
          <ListItem disablePadding>
              <ListItemIcon>
                <ArrowRight  />
              </ListItemIcon>
              <ListItemText>
              Click any bar/count in UpSet plot to download set (.BED)
              </ListItemText>
          </ListItem>
        </List>
    </Box>

  const GenerateUpsetButton = () =>
    <LoadingButton loading={loading_count} loadingPosition="end" disabled={noneSelected} endIcon={data_count ? <Sync /> : <BarChartOutlinedIcon />} sx={{ textTransform: "none", mt: 2, mb: 2, mr: 2 }} variant="contained" onClick={handleGenerateUpSet}>
      <span>{loading_count ? "Generating" : noneSelected ? "Select Cells to Generate UpSet" : "Generate UpSet"}</span>
    </LoadingButton>

  const StimulationWarning = () => 
    <Typography>Tip: Stimulating a cell does not automatically select it! Exit Stimulation Mode and click to select.</Typography>

  const DownloadUpsetButton = () =>
    data_count && <Button variant="text" endIcon={<Download />} sx={{ textTransform: "none" }} onClick={() => downloadSVG(svgRef, "UpSet.svg")}>Download UpSet Plot</Button>
  
  return (
    <>
      <Grid2 container mt={3} ml={3} mr={3}>
        <Grid2 xs={12} xl={5} container justifyContent={"center"}>
          {/* Display header, checkboxes and UpSet on left on big screen */}
          <Box display={{ xs: "none", xl: "block" }}>
            <HeaderAbout />
            <Box>
              <Checkboxes />
              <GenerateUpsetButton />
              <DownloadUpsetButton />
              {noneSelected && !noneStimulated && <StimulationWarning />}
              <Box>
                {/* {upSet} */}
                <UpSetWithRef data_count={data_count} upSetWidth={upSetWidth} handleUpsetDownload={handleUpsetDownload} downloading={downloading} ref={svgRef} />
              </Box>
            </Box>
          </Box>
        </Grid2>
        <Grid2 xs={12} xl={7} container justifyContent={"center"}>
          <Box>
            {/* On smaller screen display header on top */}
            <Box display={{ xs: "block", xl: "none" }}>
              <HeaderAbout />
            </Box>
            <Stack spacing={1} direction="row" mb={3}>
              <Tooltip title="Tip: Holding Option/Command (MacOS) or Alt/Windows (Windows) will enter stimulate mode. Stimulating a cell does NOT select it.">
                <Button endIcon={stimulateMode ? <CancelOutlinedIcon /> : <AddBoxOutlinedIcon />} sx={{ textTransform: "none" }} variant="outlined" onClick={handleToggleStimulateMode}>{stimulateMode ? 'Exit Stimulate Mode' : 'Enter Stimulate Mode'}</Button>
              </Tooltip>
              <Tooltip title="Note: Not all cells are stimulable">
                <Button disabled={allStimulated} endIcon={<FlashOnOutlinedIcon />} sx={{ textTransform: "none" }} variant="outlined" onClick={() => handleStimulateAll("S")}>Stimulate All</Button>
              </Tooltip>
              <Button disabled={noneStimulated} endIcon={<FlashOffOutlinedIcon />} sx={{ textTransform: "none" }} variant="outlined" onClick={() => handleStimulateAll("U")}>Unstimulate All</Button>
              <Tooltip title="Note: Not all cells are stimulable">
                <Button disabled={allBothStimulated} endIcon={<FlashAutoIcon />} sx={{ textTransform: "none" }} variant="outlined" onClick={() => handleStimulateAll("B")}>Stim + Unstim All</Button>
              </Tooltip>
              <Button disabled={noneSelected} endIcon={<UndoOutlinedIcon />} sx={{ textTransform: "none" }} variant="outlined" onClick={handleUnselectAll}>Unselect All</Button>
            </Stack>
            {cellTypeTree}
            {/* On smaller screen display checkboxes and UpSet plot on bottom of tree */}
            <Box display={{ xs: "block", xl: "none" }}>
              <Checkboxes />
              <GenerateUpsetButton />
              <DownloadUpsetButton />
              {noneSelected && !noneStimulated && <StimulationWarning />}
              <Box>
                {/* {upSet} */}
                <UpSetWithRef data_count={data_count} upSetWidth={upSetWidth} handleUpsetDownload={handleUpsetDownload} downloading={downloading}  ref={svgRef} />
              </Box>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
      <Snackbar
        sx={{ "& .MuiSnackbarContent-message": { margin: "auto" } }}
        open={openSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  )
}
