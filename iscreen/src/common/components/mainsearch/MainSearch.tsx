"use client"
import React, { useState } from "react"
import Grid2 from "../../mui-client-wrappers/Grid2"
import { Stack, TextField, IconButton, InputAdornment, InputBaseProps, createTheme } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import GenomeSwitch from "../GenomeSwitch"
import { useRouter } from "next/navigation"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"


export type MainSearchProps = InputBaseProps & {
  //false for human, true for mouse
  initialChecked?: boolean,  
  textColor?: string
}
const MainSearch: React.FC<MainSearchProps> = (props: MainSearchProps) => {
  const [value, setValue] = useState("")
  const [checked, setChecked] = useState(props.initialChecked || false)
  const [selectedSearch, setSelectedSearch] = useState<string>("Genomic Region")
  const assembly = checked ? "mm10" : "GRCh38"
  const handleSearchChange = (event: SelectChangeEvent) => {
    setSelectedSearch(event.target.value)
  }
  const router = useRouter()

  const handleChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setValue(event.target.value)
  }

  function handleSubmit() {
    const assembly = checked ? "mm10" : "GRCh38"
    //if submitted with empty value, use default search
    if (value == "") {
      router.push(`/search?assembly=${assembly}&chromosome=chr11&start=5205263&end=5381894`)
      return
    }
    const input = value.split(":")
    const chromosome = input[0]
    const coordinates = input[1].split("-")
    const start = coordinates[0]
    const end = coordinates[1]
    router.push(`/search?assembly=${assembly}&chromosome=${chromosome}&start=${start}&end=${end}`)
  }

  return (
    <Stack direction={"row"} sx={{ mt: "1em", display: "flex", flexGrow: 1 }}>
      <Grid2 container>
       
        <Grid2>
         
        </Grid2>
        <Grid2>
          <GenomeSwitch
            initialChecked={props.initialChecked && props.initialChecked}
            checked={checked}
            onSwitchChange={(checked) => setChecked(checked)}
          />
        </Grid2>
      </Grid2>
    </Stack>
  )
}

export default MainSearch
