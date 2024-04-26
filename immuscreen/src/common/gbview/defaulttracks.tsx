import { useQuery } from "@apollo/client"
import { associateBy } from "queryz"
import { BigWigData, BigBedData } from "bigwig-reader"
import React, { RefObject, useEffect, useMemo, useState } from "react"
import { DenseBigBed, EmptyTrack, FullBigWig } from "umms-gb"
import { client } from "../utils"
import { BIG_QUERY } from "./queries"
import { GenomicRange, BigQueryResponse, BigResponseData } from "./types"


type DefaultTracksProps = {
  domain: GenomicRange
  onHeightChanged?: (i: number) => void
  cCREHighlight?: GenomicRange
  cCREHighlights?: Set<string>
  svgRef?: RefObject<SVGSVGElement>
  assembly: string
  oncCREClicked?: (accession: string) => void
  oncCREMousedOver?: (coordinates?: GenomicRange) => void
  oncCREMousedOut?: () => void
  onSettingsClick?: () => void
}

const CCRETooltip = (props) => {
  console.log(props, "icretoltip")
  return (<>
  </>)
}

export const TitledTrack: React.FC<{
  data: BigResponseData
  assembly: string
  url: string
  title: string
  color?: string
  height: number
  transform?: string
  onHeightChanged?: (height: number) => void
  domain: GenomicRange
  svgRef?: React.RefObject<SVGSVGElement>
  oncCREMousedOver?: (coordinates?: GenomicRange) => void
  oncCREMousedOut?: () => void
  cCRECoordinateMap?: any
  biosample?: string
}> = ({
  data,
  assembly,
  url,
  title,
  height,
  domain,
  transform,
  onHeightChanged,
  svgRef,
  color,
  oncCREMousedOver,
  oncCREMousedOut,
  cCRECoordinateMap,
  biosample,
}) => {
    useEffect(() => onHeightChanged && onHeightChanged(height + 40), [height, onHeightChanged])

    return (
      <g transform={transform}>
        <EmptyTrack height={40} width={1400} transform="translate(0,8)" id="" text={title} />
        {url.endsWith(".bigBed") || url.endsWith(".bigbed") ? (
          //This is the cCRE track
          <DenseBigBed
            width={1400}
            height={height}
            domain={domain}
            id={url}
            transform="translate(0,40)"
            data={data as BigBedData[]}
            svgRef={svgRef}
            onMouseOver={(x) => oncCREMousedOver && x.name && oncCREMousedOver(cCRECoordinateMap.get(x.name))}
            onMouseOut={oncCREMousedOut}
            
          />
        ) : (
          <FullBigWig
            transform="translate(0,40)"
            width={1400}
            height={height}
            domain={domain}
            id={url}
            color={color}
            data={data as BigWigData[]}
            noTransparency
          />
        )}
      </g>
    )
  }

const DefaultTracks: React.FC<DefaultTracksProps> = (props) => {
  const [cTracks, setTracks] = useState<[string, string][]>(
    [
      ["All iCREs", "https://downloads.wenglab.org/Calderon-Corces_activeCREs_iSCREEN_withcolors.bigBed"],
    ]
  )
  const height = useMemo(() => cTracks.length * 80, [cTracks])
  const bigRequests = useMemo(
    () =>
      cTracks.map((x) => ({
        chr1: props.domain.chromosome!,
        start: props.domain.start,
        end: props.domain.end,
        preRenderedWidth: 1400,
        url: x[1],
      })),
    [cTracks, props]
  )
  const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, {
    variables: { bigRequests },
    client,
  })
  const cCRECoordinateMap = useMemo(
    () =>
      associateBy(
        (data && data.bigRequests && data.bigRequests[0].data) || [],
        (x: { name: string }) => x.name,
        (x: any) => ({ chromosome: x.chr, start: x.start, end: x.end })
      ),
    [data]
  )
  useEffect(() => {
    props.onHeightChanged && props.onHeightChanged(height)
  }, [props.onHeightChanged, height, props])

  const [settingsMousedOver, setSettingsMousedOver] = useState(false)

  return loading || (data?.bigRequests.length || 0) < 1 ? (
    <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." />
  ) : (
    <>
      <g className="default-tracks">
        <rect y={10} height={55} fill="none" width={1400} />
      </g>
      {(data?.bigRequests || []).map((data, i) => (
        <TitledTrack
          key={i}
          assembly={props.assembly}
          oncCREMousedOut={props.oncCREMousedOut}
          oncCREMousedOver={props.oncCREMousedOver}
          height={40}
          biosample={undefined}
          url={cTracks[i][1]}
          domain={props.domain}
          title={cTracks[i][0]}
          svgRef={props.svgRef}
          data={data.data}
          color={'#FF0000'}
          transform={`translate(0,${i * 70})`}
          cCRECoordinateMap={cCRECoordinateMap}
        />
      ))}
      <g className="df-tracks">
        <rect y={110} height={55} fill="none" width={1400} />
      </g>
      {settingsMousedOver && <rect width={1400} height={height} transform="translate(0,-0)" fill="#4c1f8f" fillOpacity={0.1} />}
      <rect transform="translate(0,0)" height={height} width={40} fill="#ffffff" />
      <rect
        height={height}
        width={15}
        fill="#4c1f8f"
        stroke="#000000"
        fillOpacity={settingsMousedOver ? 1 : 0.6}
        onMouseOver={() => setSettingsMousedOver(true)}
        onMouseOut={() => setSettingsMousedOver(false)}
        strokeWidth={1}
        transform="translate(20,0)"
      />
      <text transform={`rotate(270) translate(-${height / 2},12)`} textAnchor="middle" fill="#4c1f8f">
        iCREs
      </text>
    </>
  )
}
export default DefaultTracks
