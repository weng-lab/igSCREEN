"use client";
import { Box, Divider, Stack } from "@mui/material";
import ElementDetailsTabs from "./ElementDetailsTabs";
import ElementDetailsHeader, { ElementDetailsHeaderProps } from "./ElementDetailsHeader";
import RegionSearchHeader from "./RegionSearchHeader";
import { parseGenomicRangeString } from "common/utility";
import { OpenElementsTabs } from "./OpenElementsTabs/OpenElementsTabs";

export type ElementDetailsLayoutProps = ElementDetailsHeaderProps & { children: React.ReactNode };

export default function ElementDetailsLayout({ elementID, elementType, children }: ElementDetailsLayoutProps) {
  return (
    // Content is child of OpenElementTabs due to ARIA accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/. Children wrapped in <TabPanel>
    <OpenElementsTabs>
      <Box
        id="split-pane-container"
        display={"grid"}
        height={"100%"}
        gridTemplateColumns={{ xs: "minmax(0, 1fr)", md: "auto minmax(0, 1fr)" }}
      >
        <Box
          id="vertical-view-tabs-container"
          gridColumn={1}
          gridRow={1}
          bgcolor={"#F2F2F2"}
          position={"sticky"}
          top={"calc(var(--header-height, 64px) + var(--open-elements-tabs, 48px))"}
          maxHeight={"calc(100vh - var(--header-height, 64px) - var(--open-elements-tabs, 48px))"}
          display={{ xs: "none", md: "block" }}
        >
          <ElementDetailsTabs elementType={elementType} elementID={elementID} orientation="vertical" />
        </Box>
        <Stack id="element-details-main-content" spacing={2} m={2} gridColumn={{ xs: 1, md: 2 }} gridRow={1}>
          {elementType === "region" ? (
            <RegionSearchHeader region={parseGenomicRangeString(elementID)} />
          ) : (
            <ElementDetailsHeader elementType={elementType} elementID={elementID} />
          )}
          <Box id="horizontal-view-tabs-container" display={{ xs: "block", md: "none" }}>
            <ElementDetailsTabs elementType={elementType} elementID={elementID} orientation="horizontal" />
            <Divider />
          </Box>
          {children}
        </Stack>
      </Box>
    </OpenElementsTabs>
  );
}
