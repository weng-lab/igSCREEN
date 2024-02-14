type BulkAtacTrackProps = {
  //tracks: BigRequest[];
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
};


const BulkAtacTracks: React.FC<BulkAtacTrackProps> = (props) => {
  const [cTracks, setTracks] = useState<[string, string][]>([
    [
      "Bulk B Stimulated",
      "https://downloads.wenglab.org/Bulk_B-S.bigWig",
    ],
    [
      "Bulk B Untimulated",
      "https://downloads.wenglab.org/Bulk_B-U.bigWig",
    ],
    [
      "CD8pos T Stimulated",
      "https://downloads.wenglab.org/CD8pos_T-S.bigWig",
    ],
    [
      "CD8pos T Unstimulated",
      "https://downloads.wenglab.org/CD8pos_T-U.bigWig",
    ],
  ]);
  const height = useMemo(() => cTracks.length * 80, [cTracks]);
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
  );
  const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, {
    variables: { bigRequests },
    client
  });
  useEffect(() => {
    props.onHeightChanged && props.onHeightChanged(height);
  }, [props.onHeightChanged, height, props]);

  const [settingsMousedOver, setSettingsMousedOver] = useState(false);
  const [settingsModalShown, setSettingsModalShown] = useState(false);

  return loading || (data?.bigRequests.length || 0) < 1 ? (
    <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." />
  ) : (
    <>
      <BulkAtacTrackModal
        open={settingsModalShown}
        onCancel={() => setSettingsModalShown(false)}
        onAccept={(x) => {
          setTracks(x);
          setSettingsModalShown(false);
        }}
        initialSelection={cTracks}
      />
      <g className="encode-fetal-brain">
        <rect y={10} height={55} fill="none" width={1400} />
      </g>
      {(data?.bigRequests || []).map((data, i) => (
        <TitledTrack
          key={i}
          height={40}
          url={cTracks[i][1]}
          domain={props.domain}
          title={cTracks[i][0]}
          svgRef={props.svgRef}
          data={data.data}
          transform={`translate(0,${i * 70})`}
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
        Bulk Atac Tracks
      </text>
    </>
  );
};
export default BulkAtacTracks;