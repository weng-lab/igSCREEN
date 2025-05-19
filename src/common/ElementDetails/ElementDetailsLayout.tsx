"use client";
import { Box, Stack } from "@mui/material";
import ElementDetailsTabs from "./ElementDetailsTabs";
import ElementDetailsHeader, { ElementDetailsHeaderProps } from "./ElementDetailsHeader";
import RegionSearchHeader from "./RegionSearchHeader";
import { parseGenomicRangeString } from "common/utility";
import { OpenElementsTabs } from "./OpenElementsTabs";

export type ElementDetailsLayoutProps = ElementDetailsHeaderProps & { children: React.ReactNode };

export default function ElementDetailsLayout({ elementID, elementType, children }: ElementDetailsLayoutProps) {
  return (
        // Content is child of OpenElementTabs due to ARIA accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/. Children wrapped in <TabPanel>
    <OpenElementsTabs>
      {/* Everything below the open elements tabs */}
      <Stack height={"100%"} width={"100%"} sx={{overflowY: 'auto'}} direction={"row"} id="element-details-wrapper">
        {/* View tabs, shown only on desktop */}
        <Box sx={{ display: { xs: "none", md: "initial", position: 'sticky', top: 0 }}} id="element-details-desktop-tabs">
          <ElementDetailsTabs elementType={elementType} elementID={elementID} orientation="vertical" />
        </Box>
        {/* I want this to be the scrolling container, which means that it needs to have height of 100% and overflow auto with all ancestors setting height 100% */}
        {/* minWidth of 0 needed to properly constrain children when resizing. Not exactly sure... */}
        <Stack width={'100%'} height={'100%'} overflow={"auto"} minWidth={0} boxSizing={"border-box"} spacing={2} p={2} id="element-details-main-content">
          {elementType === "region" ? (
            <RegionSearchHeader region={parseGenomicRangeString(elementID)} />
          ) : (
            <ElementDetailsHeader elementType={elementType} elementID={elementID} />
          )}
          {/* View tabs, shown only on mobile */}
          <Box sx={{ display: { xs: "initial", md: "none" }, borderBottom: 1, borderColor: "divider" }} id="element-details-desktop-tabs">
            <ElementDetailsTabs elementType={elementType} elementID={elementID} orientation="horizontal" />
          </Box>
          {children}
        </Stack>
      </Stack>
    </OpenElementsTabs>
  );
}
