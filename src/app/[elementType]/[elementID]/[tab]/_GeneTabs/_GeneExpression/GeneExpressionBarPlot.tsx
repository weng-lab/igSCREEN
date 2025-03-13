import { Box } from "@mui/material"
import { GeneExpressionProps } from "./GeneExpression"
import { ParentSize } from "@visx/responsive"

export type GeneExpressionBarPlotProps = GeneExpressionProps

const GeneExpressionBarPlot = ({name, id}: GeneExpressionBarPlotProps) => {
  return(
    <Box border={"2px solid black"}>
      <ParentSize>
        {(parent) => {
          // console.log(parent.width)
          return (
            <>
            <p>Width: {parent.width}</p>
            <p>Height: {parent.height}</p>
            </>
          )
        }}
      </ParentSize>
    </Box>
  )
}

export default GeneExpressionBarPlot