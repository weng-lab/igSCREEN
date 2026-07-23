'use client'

import { DetailsTabs, TabItem } from "@weng-lab/ui-components";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { ElementDetailsTab, GeneDetailsTab, GenomicElementType, IcreDetailsTab, RegionDetailsTab, VariantDetailsTab } from "types/globalTypes";
import { geneDetailsTabs, icreDetailsTabs, regionDetailsTabs, sharedTabs, variantDetailsTabs } from "./tabsConfig";

export type ElementDetailsTabsProps = {
  elementType: GenomicElementType
  elementID: string
  orientation: "horizontal" | "vertical"
}

const ElementDetailsTabs = ({ elementType, elementID, orientation }: ElementDetailsTabsProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const currentTab = pathname.substring(pathname.lastIndexOf('/') + 1) === elementID ? "" : pathname.substring(pathname.lastIndexOf('/') + 1)

  const [value, setValue] = React.useState(currentTab);

  //If we ever use parallel routes to nest multiple elements in the same view, this will probably break
  useEffect(() => {
    if (currentTab !== value) {
      setValue(currentTab)
    }
  }, [currentTab, value])

  const tabs: TabItem[] = useMemo(() => {
    let elementSpecificTabs: VariantDetailsTab[] | GeneDetailsTab[] | IcreDetailsTab[] | RegionDetailsTab[];
    switch (elementType) {
      case ("gene"):
        elementSpecificTabs = geneDetailsTabs
        break
      case ("variant"):
        elementSpecificTabs = variantDetailsTabs
        break
      case ("icre"):
        elementSpecificTabs = icreDetailsTabs
        break
      case ("region"):
        elementSpecificTabs = regionDetailsTabs
    }
    const queryStr = searchParams.toString()
    return [...elementSpecificTabs, ...sharedTabs].map((tab: ElementDetailsTab) => ({
      value: tab.href,
      label: tab.label,
      icon: tab.iconPath,
      href: `/${elementType}/${elementID}/${tab.href}` + (queryStr ? '?' + queryStr : ''),
    }))
  }, [elementType, elementID, searchParams])

  const verticalTabs = orientation === "vertical"

  return (
    <DetailsTabs
      tabs={tabs}
      value={value}
      onChange={setValue}
      orientation={orientation}
      LinkComponent={Link}
      selectedBackgroundColor="rgba(73, 77, 107, .15)"
      iconWidth={verticalTabs ? 50 : 40}
      iconHeight={verticalTabs ? 50 : 40}
      sx={{
        position: "sticky",
        top: "calc(var(--header-height, 64px) + var(--open-elements-tabs, 48px))",
        width: verticalTabs ? 100 : "100%",
        maxHeight: "100%",
      }}
    />
  );
}

export default ElementDetailsTabs