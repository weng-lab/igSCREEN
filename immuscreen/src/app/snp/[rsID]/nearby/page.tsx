'use client'
import NearbyGenomicFeatures from "common/components/NearbyGenomicFeatures"
import { useSnpData } from "common/hooks/useSnpData";

export default function SnpNearby({
  params
}: {
  params: { rsID: string }
}) {

  const {data: SnpData} = useSnpData(params.rsID)

  return (
    <NearbyGenomicFeatures coordinates={SnpData.coordinates} />
  );
}