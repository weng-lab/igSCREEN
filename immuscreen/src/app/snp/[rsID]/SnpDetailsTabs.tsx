'use client'

import { Box, Tabs, Tab } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

const SnpDetailsTabs = () => {
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
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handleChange} aria-label="SNP Details Tabs">
        <Tab label="eQTLs" value="eQTLs" LinkComponent={Link} href={basepath + '/' + 'eQTLs'} />
        <Tab label="Nearby Genomic Features" value="nearby" LinkComponent={Link} href={basepath + '/' + 'nearby'} />
      </Tabs>
    </Box>
  )
}

export default SnpDetailsTabs