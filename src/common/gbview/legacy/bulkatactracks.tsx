import { gql, useQuery } from "@apollo/client";
import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";
import React, { RefObject, useEffect, useMemo, useState } from "react";
import { DenseBigBed, EmptyTrack, FullBigWig } from "umms-gb";
import { RequestError, } from "umms-gb/dist/components/tracks/trackset/types";
import { ValuedPoint } from "umms-gb/dist/utils/types";
import { client } from "../../utils"
import { CellQueryValue } from "../../../app/celllineage/types";
import { getCellColor, getCellDisplayName } from "../../../app/celllineage/utils";
import BulkAtacModal from "../bulkAtacSelector";

export const BIG_QUERY = gql`
  query BigRequests($bigRequests: [BigRequest!]!) {
    bigRequests(requests: $bigRequests) {
      data
      error {
        errortype
        message
      }
    }
  }
`;

type GenomicRange = {
  chromosome?: string;
  start: number;
  end: number;
};

export type BigResponseData =
  | BigWigData[]
  | BigBedData[]
  | BigZoomData[]
  | ValuedPoint[];

export type BigResponse = {
  data: BigResponseData;
  error: RequestError;
};

export type BigQueryResponse = {
  bigRequests: BigResponse[];
};

type BulkAtacTrackProps = {
  domain: GenomicRange;
  onHeightChanged?: (i: number) => void;
  cCREHighlight?: GenomicRange;
  cCREHighlights?: Set<string>;
  svgRef?: RefObject<SVGSVGElement>;
  assembly: string;
  oncCREClicked?: (accession: string) => void;
  oncCREMousedOver?: (coordinates?: GenomicRange) => void;
  oncCREMousedOut?: () => void;
  onSettingsClick?: () => void;
  defaultcelltypes?: string[]
};

export const TitledTrack: React.FC<{
  data: BigResponseData;
  url: string;
  title: string;
  color?: string;
  height: number;
  transform?: string;
  onHeightChanged?: (height: number) => void;
  domain: GenomicRange;
  svgRef?: React.RefObject<SVGSVGElement>;
}> = ({
  data,
  url,
  title,
  height,
  domain,
  transform,
  onHeightChanged,
  svgRef,
  color,
}) => {
    useEffect(
      () => onHeightChanged && onHeightChanged(height + 40),
      [height, onHeightChanged]
    );
    return (
      (<g transform={transform}>
        <EmptyTrack
          height={40}
          width={1400}
          transform="translate(0,8)"
          id=""
          text={title}
        />
        {url.endsWith(".bigBed") ? (
          <DenseBigBed
            width={1400}
            height={height}
            domain={domain}
            id="adult-bCREs"
            transform="translate(0,40)"
            data={data as BigBedData[]}
            svgRef={svgRef}
          //tooltipContent={(rect) => <CCRETooltip {...rect} assembly="grch38" />}
          />
        ) : (
          // This is the bulk atac
          (<FullBigWig
            transform="translate(0,40)"
            width={1400}
            height={height}
            domain={domain}
            id="NeuN+"
            color={color}
            data={data as BigWigData[]}
            noTransparency
          />)
        )}
      </g>)
    );
  };

const BulkAtacTracks: React.FC<BulkAtacTrackProps> = (props: BulkAtacTrackProps) => {
  const [selectedCells, setSelectedCells] = useState<CellQueryValue[]>(props.defaultcelltypes as CellQueryValue[] || [])

  // tracks -> [track name, track URL, track color]
  const tracks: [string, string, string][] = useMemo(() => {
    const x: [string, string, string][] = selectedCells.map(cell => {
      return (
        [
          getCellDisplayName(cell, true, true) + (["HSC", "CD34_Cord_Blood", "CD34_Bone_Marrow"].find(x => x === cell) ? ` (${cell})` : ''),
          `https://downloads.wenglab.org/${cell}.bigWig`,
          getCellColor(cell)
        ]
      )
    }) || []
    x.sort()
    x.unshift(["All Immune Cells (Aggregate Signal)", "https://downloads.wenglab.org/all_immune.bigWig", "#000000"])
    return x
  }, [selectedCells])


  const [settingsMousedOver, setSettingsMousedOver] = useState(false);
  const [settingsModalShown, setSettingsModalShown] = useState(false);

  const height = useMemo(() => tracks.length * 80, [tracks]);
  const bigRequests = useMemo(
    () =>
      tracks.map((x) => ({
        chr1: props.domain.chromosome!,
        start: props.domain.start,
        end: props.domain.end,
        preRenderedWidth: 1400,
        url: x[1],
      })),
    [tracks, props]
  );

  const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, {
    variables: { bigRequests },
    client
  });

  useEffect(() => {
    props.onHeightChanged && props.onHeightChanged(height);
  }, [props.onHeightChanged, height, props]);

  return loading || (data?.bigRequests.length || 0) < 1 ? (
    <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." />
  ) : (
    <>
      <BulkAtacModal
        open={settingsModalShown}
        onCancel={() => setSettingsModalShown(false)}
        onAccept={(cells: CellQueryValue[]) => setSelectedCells(cells)}
        selected={selectedCells}
      />
      <g className="encode-fetal-brain">
        <rect y={10} height={55} fill="none" width={1400} />
      </g>
      {(data?.bigRequests || []).map((data, i) => (
        <TitledTrack
          key={i}
          height={40}
          url={tracks[i][1]}
          domain={props.domain}
          title={tracks[i][0]}
          svgRef={props.svgRef}
          data={data.data}
          transform={`translate(0,${i * 70})`}
          color={tracks[i][2]}
        />
      ))}
      <g className="tf-motifs">
        <rect y={110} height={55} fill="none" width={1400} />
      </g>
      {settingsMousedOver && (
        <rect
          width={1400}
          height={height}
          transform="translate(0,-0)"
          fill="#194023"
          fillOpacity={0.1}
        />
      )}
      <rect
        transform="translate(0,0)"
        height={height}
        width={40}
        fill="#ffffff"
      />
      <rect
        height={height}
        width={15}
        fill="#194023"
        stroke="#000000"
        fillOpacity={settingsMousedOver ? 1 : 0.6}
        onMouseOver={() => setSettingsMousedOver(true)}
        onMouseOut={() => setSettingsMousedOver(false)}
        strokeWidth={1}
        transform="translate(20,0)"
        onClick={() => {
          props.onSettingsClick && props.onSettingsClick();
          setSettingsModalShown(true);
        }}
      />
      <text
        transform={`rotate(270) translate(-${height / 2},12)`}
        textAnchor="middle"
        fill="#194023"
      >
        Bulk ATAC
      </text>
    </>
  );
};
export default BulkAtacTracks;
