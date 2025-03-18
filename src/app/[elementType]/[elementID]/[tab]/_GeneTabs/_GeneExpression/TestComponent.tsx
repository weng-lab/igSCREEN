import { Box } from "@mui/material";
import { ParentSize } from "@visx/responsive";

export default function TestComponenet(){
  return(
    <Box border={'2px solid black'}>
      <ParentSize>
        {(parent) => {
          return(
            <>
              <p>width: {parent.width}</p>
              <p>height: {parent.height}</p>
            </>
          )
        }}
      </ParentSize>
    </Box>
  )
}