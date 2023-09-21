"use client"
import React, {useState} from "react"
import { DataTable } from "@weng-lab/psychscreen-ui-components"
import { Tabs,  Typography } from "@mui/material"
import { client } from "../search/ccredetails/client"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { ReadonlyURLSearchParams, useSearchParams, usePathname } from "next/navigation"

import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client"
import { SnpAutoComplete } from "../../common/components/mainsearch/SnpAutocomplete"
import { StyledTab } from "../../common/utils"

  export const EQTL_QUERY = gql`
  query iCREeQTLQuery($study: String!, $rsid: String) 
    {
        icreeQTLQuery(study:$study, rsid:$rsid) {
          variant_id
          pvalue
          qvalue
          geneid          
          celltype
          study
          rsid
          pval_beta
        
        }
    }
  
`

//Need better text styling

const Snp = () =>{
 const searchParams: ReadonlyURLSearchParams = useSearchParams()!
    const [value, setValue] = useState(0)
  
  const handleChange = (_, newValue: number) => {
    setValue(newValue)
  }
  const { loading: loading, data: data } = useQuery(EQTL_QUERY, {
    variables: {
      study: "Yazar.Powell",
      rsid: searchParams.get("rsid")
    },
    skip: !searchParams.get("rsid"),
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    client,
  })

  return !searchParams.get("rsid") ? (<main>

    <Grid2 container spacing={6} sx={{ mr: "auto", ml: "auto", mt: "3rem" }}>
            <Grid2 xs={6} sx={{ mt: "5em", ml:"2em"}}>
              <Typography variant="h3">SNP Portal</Typography>
              
              <br/>
             
              <br/>
              <br/>
              <SnpAutoComplete textColor={"black"} assembly={"GRCh38"} />
            </Grid2>
           
          </Grid2>
    
      </main>) : (
    <main>
      <Grid2 container spacing={4} sx={{ maxWidth: "70%", mr: "auto", ml: "auto", mt: "3rem" }}>
         <Grid2 xs={12} lg={6}>
            {searchParams.get("rsid") && <Typography variant="h4">SNP Details: {searchParams.get("rsid")}</Typography>}
          
        <Grid2 container spacing={3} sx={{ mt: "2rem", mb: "2rem" }}>
        <Grid2 xs={12} lg={12}>
          <Tabs aria-label="snps_tabs" value={value} onChange={handleChange}>
            
             <StyledTab label="eQTLs" />
          </Tabs>
        </Grid2>
        {value===0 && !loading && data && 
        <Grid2 container>
                    <Grid2 xs={6} lg={6}>
                            <DataTable
                              columns={[
                                {
                                  header: "Gene Id",
                                  value: (row) => row.geneid  || "",
                                  
                                },
                                
                                {
                                  header: "P-Value",
                                  value: (row) => row.pvalue && row.pvalue.toExponential(2) || 0 ,
                                },
                                {
                                  header: "Q-Value",
                                  value: (row) => row.qvalue && row.qvalue.toExponential(2) || 0,
                                },
                                {
                                  header: "Celltype",
                                  value: (row) => row.celltype || "",
                                  
                                }
                              
                              ]}
                        tableTitle={`Yazar.Powell eQTLs have been identified for ${searchParams.get('gene')}:`}
                        rows={data.icreeQTLQuery || []}
                        
                        
                        itemsPerPage={10}
                      />
                      </Grid2>
                      </Grid2>}
      `</Grid2>
        </Grid2>
       
      </Grid2>
    </main>
  )
}

export default Snp;