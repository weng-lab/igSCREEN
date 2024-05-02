"use client"
import * as React from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import Typography from "@mui/material/Typography"
import { debounce } from "@mui/material/utils"
import { useRouter } from "next/navigation"
import { Search } from "@mui/icons-material"
import { Stack, IconButton } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2"

///search?assembly=GRCh38&chromosome=chr11&start=5205263&end=5381894&accession=EH38E1516972

const CCRE_AUTOCOMPLETE_QUERY = `
query iCREQuery($accession_prefix: [String!], $limit: Int) {
  iCREQuery(accession_prefix: $accession_prefix, limit: $limit) {
      rdhs
      accession
      celltypes
      coordinates {
        start
        end
        chromosome
      }
    }
}
`
export const CcreAutoComplete = (props) => {
  const [value, setValue] = React.useState(null)
  const [inputValue, setInputValue] = React.useState("")
  const [options, setOptions] = React.useState([])
  const [ccreAccessions, setCcreAccessions] = React.useState([])

  const onSearchChange = async (value: any) => {
    setOptions([])
    const response = await fetch("https://factorbook.api.wenglab.org/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: CCRE_AUTOCOMPLETE_QUERY,
        variables: {
          
          accession_prefix: [value],
          limit: 100,
        },
      }),
      headers: { "Content-Type": "application/json" },
    })
    const ccreSuggestion = (await response.json()).data?.iCREQuery
    if (ccreSuggestion && ccreSuggestion.length > 0) {
      const r = ccreSuggestion.map((g: any) => g.accession)
      const ccres = ccreSuggestion.map((g: any) => {
        return {
          chrom: g.coordinates.chromosome,
          start: g.coordinates.start,
          end: g.coordinates.end,
          ccreaccession: g.accession,
        }
      })
      setOptions(r)
      setCcreAccessions(ccres)
    } else if (ccreSuggestion && ccreSuggestion.length === 0) {
      setOptions([])
      setCcreAccessions([])
    }
  }

  const debounceFn = React.useCallback(debounce(onSearchChange, 500), [])

  const handleSubmit = () => {
    if (value) {
      return (`icres?accession=${value}`)
    }
  }

  return (
    <Stack direction="row" spacing={2}>
      <Autocomplete
          size={props.header ? "small" : "medium"}
          id="ccre-autocomplete"
          sx={{ width: 300, paper: { height: 200 } }}
          options={options}
          ListboxProps={{
            style: {
              maxHeight: "180px",
            },
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.defaultPrevented = true
              window.open(handleSubmit(), "_self")
            }
          }}
          value={value}
          onChange={(_, newValue: string | null) => {
            setValue(newValue)
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            if (newInputValue != "") {
              debounceFn(newInputValue)
            }

            setInputValue(newInputValue)
          }}
          noOptionsText={props.assembly === "mm10" ? "e.g EM10E0000207" : "e.g. EH38E0001314"}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter a cCRE accession"
              InputLabelProps={{ shrink: true, style: props.header ? {color: "white"} : { color: "black" } }}
              placeholder={props.assembly === "mm10" ? "e.g EM10E0000207" : "e.g. EH38E0001314"}
              fullWidth
              sx={{
                //Border at rest
                fieldset: props.header ? { borderColor: "white" } : { borderColor: "black" },
                '& .MuiOutlinedInput-root': {
                  //hover border color
                  '&:hover fieldset': props.header ? { borderColor: "white" } : { borderColor: "black" },
                  //focused border color
                  '&.Mui-focused fieldset': props.header ? { borderColor: "white" } : { borderColor: "black" },
                },
                //Text
                '& .MuiOutlinedInput-input': props.header && { color: "white" },
                //Icon
                '& .MuiSvgIcon-root': props.header && { fill: "white"}
              }}
            />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={props.id}>
                <Grid2 container alignItems="center">
                  <Grid2 sx={{ width: "100%", wordWrap: "break-word" }}>
                    <Box component="span" sx={{ fontWeight: "regular" }}>
                      {option}
                    </Box>
                    {ccreAccessions && ccreAccessions.find((g: { ccreaccession: string }) => g.ccreaccession === option) && (
                      <Typography variant="body2" color="text.secondary">
                        {`${(ccreAccessions.find((g: { ccreaccession: string }) => g.ccreaccession === option))?.chrom}:${(ccreAccessions.find((g: { ccreaccession: string }) => g.ccreaccession === option))?.start
                          }-${(ccreAccessions.find((g: { ccreaccession: string }) => g.ccreaccession === option))?.end}`}
                      </Typography>
                    )}
                  </Grid2>
                </Grid2>
              </li>
            )
          }}
      />
      <IconButton aria-label="Search" type="submit" href={handleSubmit()} sx={{ color: `${props.header ? "white" : "black"}`, maxHeight: "100%" }}>
        <Search />
      </IconButton>
    </Stack>
  )
}
