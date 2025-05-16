"use client";
import { Box, Stack } from "@mui/material";
import ElementDetailsBreadcrumbs from "./ElementDetailsBreadcrumbs";
import ElementDetailsTabs from "./ElementDetailsTabs";
import ElementDetailsHeader, { ElementDetailsHeaderProps } from "./ElementDetailsHeader";
import RegionSearchHeader from "./RegionSearchHeader";
import { parseGenomicRangeString } from "common/utility";
import { OpenElementsTabs } from "./OpenElementsTabs";

export type ElementDetailsLayoutProps = ElementDetailsHeaderProps & { children: React.ReactNode };

export default function ElementDetailsLayout({ elementID, elementType, children }: ElementDetailsLayoutProps) {
  const spaceBetween = 2;

  return (
    <OpenElementsTabs>
      {/* Everything below the open elements tabs */}
      <Stack height={"100%"} width={"100%"} direction={"row"}>
        {/* View tabs, shown only on desktop */}
        <Box sx={{ display: { xs: "none", md: "initial" }}}>
          <ElementDetailsTabs elementType={elementType} elementID={elementID} orientation="vertical" />
        </Box>
        {/* Content is child of OpenElementTabs due to ARIA accessibility guidelines: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/. Children wrapped in <TabPanel> */}
        <Stack width={'100%'} overflow={"auto"} spacing={2} m={2}>
          {elementType === "region" ? (
            <RegionSearchHeader region={parseGenomicRangeString(elementID)} />
          ) : (
            <ElementDetailsHeader elementType={elementType} elementID={elementID} />
          )}
          {/* View tabs, shown only on mobile */}
          <Box sx={{ display: { xs: "initial", md: "none" }, borderBottom: 1, borderColor: "divider" }}>
            <ElementDetailsTabs elementType={elementType} elementID={elementID} orientation="horizontal" />
          </Box>
          {children}
        </Stack>
      </Stack>
    </OpenElementsTabs>
  );
}
