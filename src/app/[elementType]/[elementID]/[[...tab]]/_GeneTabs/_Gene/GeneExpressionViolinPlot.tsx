import { GeneExpressionProps, PointMetadata, SharedGeneExpressionPlotProps } from "./GeneExpression"
import VerticalBarPlot, { BarData, BarPlotProps } from "common/components/VerticalBarPlot"
import { useMemo } from "react"
import { getCellCategoryColor, getCellCategoryDisplayname } from "common/utility"
import { Box } from "@mui/material"
import { Distribution, ViolinPlot, ViolinPlotProps, ViolinPoint } from "@weng-lab/psychscreen-ui-components"

export type GeneExpressionViolinPlotProps = 
  GeneExpressionProps & 
  SharedGeneExpressionPlotProps &
  Partial<ViolinPlotProps<PointMetadata>>

const GeneExpressionBarPlot = ({geneData, selected, sortedFilteredData, ...rest}: GeneExpressionViolinPlotProps) => {

    const violinData: Distribution<PointMetadata>[] = useMemo(() => {
        if (!sortedFilteredData) return [];

        const grouped = sortedFilteredData.reduce((acc, item) => {
            const key = item.lineage;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {} as Record<string, PointMetadata[]>);

        return Object.entries(grouped).map(([lineage, group]) => {
            const values = group.map(d => d.value);
            const label = getCellCategoryDisplayname(lineage);
            const violinColor = getCellCategoryColor(lineage);

            const data: ViolinPoint<PointMetadata>[] = values.map((value, i) =>
                values.length < 3
                    ? { value, radius: 4, tissue: lineage, metadata: group[i] }
                    : { value, tissue: lineage, metadata: group[i] }
            );

            return { label, data, violinColor };
        });
    }, [sortedFilteredData]);      

  return(
    <Box width={"100%"} height={"100%"} overflow={"auto"} padding={1} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, position: "relative"}}>
      <ViolinPlot
        {...rest}
        distributions={violinData}
        axisLabel={`${geneData?.data.name} Expression - TPM`}
        loading={geneData.loading}
        labelOrientation="leftDiagonal"
        violinProps={{
            bandwidth: "scott"
        }}
      />
    </Box>
  )
}

export default GeneExpressionBarPlot