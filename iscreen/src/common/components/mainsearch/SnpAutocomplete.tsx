import * as React from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import { debounce } from "@mui/material/utils"
import { useRouter } from "next/navigation"

const SNP_AUTOCOMPLETE_QUERY = `
query snpAutocompleteQuery($snpid: String!, $assembly: String!) {
    snpAutocompleteQuery(snpid: $snpid, assembly: $assembly) {
        id
        coordinates {
            chromosome
            start
            end
        }
    }
}
`
export const SnpAutoComplete = (props) => {
  const [value, setValue] = React.useState<any>(null)
  const [inputValue, setInputValue] = React.useState("")
  const [options, setOptions] = React.useState<any[]>([])
  const [snpids, setSnpIds] = React.useState<any[]>([])
  const router = useRouter()

  const onSearchChange = async (value: any) => {
    setOptions([])
    const response = await fetch("https://ga.staging.wenglab.org/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: SNP_AUTOCOMPLETE_QUERY,
        variables: {
          assembly: "grch38",
          snpid: value,
        },
      }),
      headers: { "Content-Type": "application/json" },
    })
    const snpSuggestion = (await response.json()).data?.snpAutocompleteQuery
    if (snpSuggestion && snpSuggestion.length > 0) {
      const r = snpSuggestion.map((g: any) => g.id)
      const snp = snpSuggestion.map((g: any) => {
        return {
          chrom: g.coordinates.chromosome,
          start: g.coordinates.start,
          end: g.coordinates.end,
          id: g.id,
        }
      })
      setOptions(r)
      setSnpIds(snp)
    } else if (snpSuggestion && snpSuggestion.length === 0) {
      setOptions([])
      setSnpIds([])
    }
    //setgeneCards([]);
  }

  const debounceFn = React.useCallback(debounce(onSearchChange, 500), [])

  return (
    <Grid container sx={{ mr: "1em" }}>
      <Grid item sm={5.5} md={5.5} lg={5.5} xl={5.5}>
        <Autocomplete
          id="snp-autocomplete"
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

              if (value) {
                let chromosome = snpids.find((g) => g.id === value)?.chrom
                let start = snpids.find((g) => g.id === value)?.start - 2000
                let end = snpids.find((g) => g.id === value)?.end + 2000
                router.push(
                  `/snp?rsid=${value}`
                )
              }
            }
          }}
          value={value}
          onChange={(_: any, newValue: string | null) => {
            setValue(newValue)
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            if (newInputValue != "") {
              debounceFn(newInputValue)
            }

            setInputValue(newInputValue)
          }}
          noOptionsText="e.g. rs11669173"
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter a snp rsId"
              InputLabelProps={{ shrink: true, style: { color: props.textColor || "black" } }}
             // InputProps={{ style: { color: props.textColor || "black" } }}
              placeholder="e.g. rs11669173"
              fullWidth
              sx={{ fieldset: { borderColor: props.textColor || "black"}, '& .MuiInput-underline:after': {
                borderBottomColor: props.textColor || "black",
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: props.textColor || "black",
                },
                '&:hover fieldset': {
                  borderColor: props.textColor || "black"
                  
                },
                '&.Mui-focused fieldset': {
                  borderColor: props.textColor || "black",
                },
              }}}
            />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={props.id}>
                <Grid container alignItems="center">
                  <Grid item sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}>
                    <Box component="span" sx={{ fontWeight: "regular" }}>
                      {option}
                    </Box>
                    {snpids && snpids.find((g) => g.id === option) && (
                      <Typography variant="body2" color="text.secondary">
                        {`${snpids.find((g) => g.id === option)?.chrom}:${snpids.find((g) => g.id === option)?.start}:${
                          snpids.find((g) => g.id === option)?.end
                        }`}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </li>
            )
          }}
        />
      </Grid>
    </Grid>
  )
}
