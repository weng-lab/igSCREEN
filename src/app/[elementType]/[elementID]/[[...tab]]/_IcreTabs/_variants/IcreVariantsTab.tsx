import { Stack } from "@mui/material"
import IntersectingSNPs from "app/region/[region]/variants/IntersectingSNPs"
import { useElementMetadataReturn } from "common/hooks/useElementMetadata"
import GWASLdr from "./GWASLdr"
import IcreEQTLs from "./IcreEQTLs"

const IcreVariantsTab = ({icreData}: {icreData: useElementMetadataReturn<"icre">["data"]}) => {

  
  return (
    <Stack spacing={2}>
      <IntersectingSNPs region={icreData.coordinates} />
      <GWASLdr accession={icreData.accession} />
      <IcreEQTLs accession={icreData.accession} />
    </Stack>
  );
}

export default IcreVariantsTab