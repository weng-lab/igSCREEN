'use client'

import { Box, Typography, Tabs, Tab } from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { GenomicRange } from "types/globalTypes";

const RegionSearchTabs = (props: { region: GenomicRange }) => {
  const pathname = usePathname();
  const currentTab = pathname.substring(pathname.lastIndexOf('/') + 1);
  const basepath = pathname.substring(0, pathname.lastIndexOf('/'))

  const [value, setValue] = React.useState(currentTab);
  
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  //keep tab value in sync with forward/backward navigation
  useEffect(() => {
    if (currentTab !== value) {
      setValue(currentTab)
    }
  }, [currentTab, value])

  return (
    <Box>
      <Typography variant='h4' sx={{mb: 2}}>
        {`Searching ${props.region.chromosome}:${props.region.start.toLocaleString()}-${props.region.end.toLocaleString()}`}
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="iCREs" value="icres" LinkComponent={Link} href={basepath + '/' + 'icres'} />
          <Tab label="Genes" value="genes" LinkComponent={Link} href={basepath + '/' + 'genes'} />
          <Tab label="SNPs" value="snps" LinkComponent={Link} href={basepath + '/' + 'snps'} />
        </Tabs>
      </Box>
    </Box>
  )
}

export default RegionSearchTabs