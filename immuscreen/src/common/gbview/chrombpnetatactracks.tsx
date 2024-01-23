import React, {
    RefObject,
    useCallback,
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  
  import TitledImportanceTrack from "./titledimportancetrack";
  import { BigBedData } from "bigwig-reader";
  
  export type GenomicRange = {
    chromosome?: string;
    start: number;
    end: number;
  };

  type ChromBPNetBulkAtacTrackProps = {
    trait?: string;
    domain: GenomicRange;
    onHeightChanged?: (i: number) => void;
    svgRef?: RefObject<SVGSVGElement>;
    onSettingsClicked?: () => void;
    onImportantRegionsLoaded?: (regions: BigBedData[]) => void;
    defaultTrackset?: string;
  };
  
  const TRACKSETS:[string, string][] = 
    [
      
      [
        "1010-Monocytes-S",
        "https://downloads.wenglab.org/chrombpnetbulkatac/1010-Monocytes-S.bigWig",
      ],
      [
          "1010-Naive_Tregs-S",
          "https://downloads.wenglab.org/chrombpnetbulkatac/1010-Naive_Tregs-S.bigWig",
        ],
        [
          "1010-Plasmablasts-U",
          "https://downloads.wenglab.org/chrombpnetbulkatac/1010-Plasmablasts-U.bigWig",
        ],
        [
          "1011-Naive_Teffs-S",
          "https://downloads.wenglab.org/chrombpnetbulkatac/1011-Naive_Teffs-S.bigWig",
        ]
        
    ];
  
  
  const ChromBPNetAtacTracks: React.FC<ChromBPNetBulkAtacTrackProps> = ({
    domain,
    onHeightChanged,
    onSettingsClicked,
    onImportantRegionsLoaded,
    defaultTrackset,
  }) => {
    // manage displayed tracks, compute height, and pass height back to parent
    const [displayedTracks, setDisplayedTracks] = useState<[string, string][]>(TRACKSETS);
    const height = useMemo(
      () =>
        130 +
        (displayedTracks.length * 130) - 130,
      [displayedTracks, domain]
    );
    //console.log(domain, "domain")
    useEffect(() => {
      onHeightChanged && onHeightChanged(height);
    }, [onHeightChanged, height]);
  
    // manage settings modal
    const [settingsMousedOver, setSettingsMousedOver] = useState(false);
    const [settingsModalShown, setSettingsModalShown] = useState(false);
  
    //console.log("displayedTracks",displayedTracks)
  
    return (
      <>
        {displayedTracks
          .map((x, i) => (
              <TitledImportanceTrack            
              key={`${i}_${domain.start}`}
              transform={`translate(0,${130 * i})`}
              title={x[0]}
              height={130}
              width={1400}
              signalURL={`https://downloads.wenglab.org/chrombpnetbulkatac/${x[0]}.profile_scores.bw`}
              imputedSignalURL={x[1]}
              domain={domain}            
              neutralRegions={[]}
            />
          ))}
        {settingsMousedOver && (
          <rect
            width={1400}
            height={height}
            transform="translate(0,-0)"
            fill="#ab3f00"
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
          fill="#ab3f00"
          stroke="#000000"
          fillOpacity={settingsMousedOver ? 1 : 0.6}
          onMouseOver={() => setSettingsMousedOver(true)}
          onMouseOut={() => setSettingsMousedOver(false)}
          strokeWidth={1}
          transform="translate(20,0)"
          onClick={() => {
            onSettingsClicked && onSettingsClicked();
            setSettingsModalShown(true);
          }}
        />
        <text
          transform={`rotate(270) translate(-${height / 2},12)`}
          textAnchor="middle"
          fill="#ab3f00"
        >
          ChromBPNet ATAC Tracks
        </text>
      </>
    );
  };
  export default ChromBPNetAtacTracks;