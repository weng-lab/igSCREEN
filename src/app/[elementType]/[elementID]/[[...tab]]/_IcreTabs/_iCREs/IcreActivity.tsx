import { TwoPaneLayout, useTablePlotSync } from "@weng-lab/ui-components";
import IcreActivityTable from "./IcreActivityTable";
import { useIcreActivity, UseIcreActivityReturn } from "common/hooks/useIcreActivity";
import IcreActivityBarPlot from "./IcreActivityBarPlot";
import IcreActivityUMAP from "./IcreActivityUMAP";
import { BarChart, CandlestickChart, ScatterPlot, SchemaRounded } from "@mui/icons-material";
import IcreActivityTree from "./IcreActivityTree";
import IcreActivityViolinPlot from "./IcreActivityViolinPlot";

export type IcreActivityProps = {
  accession: string;
};

export type PointMetadata = UseIcreActivityReturn["data"][number];

const IcreActivity = ({ accession }: IcreActivityProps) => {
  const iCREActivitydata = useIcreActivity({ accession });

  const { selected, setSelected, sortedFilteredData, tableProps, toggleSelection, getRowId } = useTablePlotSync({
    rows: iCREActivitydata.data ?? [],
    getRowId: (r) => r.name,
  });

  return (
    <TwoPaneLayout
      direction={{ xs: "column", lg: "row" }}
      TableComponent={
        <IcreActivityTable
          accession={accession}
          tableProps={tableProps}
          iCREActivitydata={iCREActivitydata}
        />
      }
      plots={[
        {
          tabTitle: "Bar Plot",
          icon: <BarChart />,
          plotComponent: (
            <IcreActivityBarPlot
              accession={accession}
              selected={selected}
              sortedFilteredData={sortedFilteredData}
              iCREActivitydata={iCREActivitydata}
              toggleSelection={toggleSelection}
              getRowId={getRowId}
            />
          ),
        },
        {
          tabTitle: "UMAP",
          icon: <ScatterPlot />,
          plotComponent: (
            <IcreActivityUMAP
              accession={accession}
              selected={selected}
              setSelected={setSelected}
              iCREActivitydata={iCREActivitydata}
            />
          ),
        },
        {
          tabTitle: "Violin Plot",
          icon: <CandlestickChart />,
          plotComponent: (
            <IcreActivityViolinPlot
              accession={accession}
              selected={selected}
              setSelected={setSelected}
              sortedFilteredData={sortedFilteredData}
              iCREActivitydata={iCREActivitydata}
              toggleSelection={toggleSelection}
              getRowId={getRowId}
            />
          ),
        },
        {
          tabTitle: "Activity in Cell Lineage",
          icon: <SchemaRounded sx={{ transform: "rotate(270deg)" }} />,
          plotComponent: (
            <IcreActivityTree
              accession={accession}
              selected={selected}
            />
          ),
        },
      ]}
    />
  );
};

export default IcreActivity;
