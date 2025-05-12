"use client";
import { Box, Divider, Stack } from "@mui/material";
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
    <Stack height={"100%"} width={"100%"} direction={"row"}>
      {/* Tabs, shown only on desktop */}
      <Box sx={{ display: { xs: "none", md: "initial" } }}>
        <ElementDetailsTabs elementType={elementType} elementID={elementID} orientation="vertical" />
      </Box>
      <Stack
        sx={{ flexGrow: 1, p: spaceBetween, overflow: "auto" }}
        spacing={spaceBetween}
        id={"main_content_container"}
      >
        <OpenElementsTabs elementID={elementID} elementType={elementType} />
        {/* <ElementDetailsBreadcrumbs /> */}
        {elementType === "region" ? (
          <RegionSearchHeader region={parseGenomicRangeString(elementID)} />
        ) : (
          <ElementDetailsHeader elementType={elementType} elementID={elementID} />
        )}
        {/* Tabs, shown only on mobile */}
        <Box sx={{ display: { xs: "initial", md: "none" }, borderBottom: 1, borderColor: "divider" }}>
          <ElementDetailsTabs elementType={elementType} elementID={elementID} orientation="horizontal" />
        </Box>
        {children}
      </Stack>
    </Stack>
  );
}
