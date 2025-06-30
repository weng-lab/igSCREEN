"use client";

import { Browser, InitialBrowserState, Vibrant, TrackType, Track, DisplayMode } from "track-logic";

export default function TestPage() {
  const initialState: InitialBrowserState = {
    domain: { chromosome: "chr6", start: 21592768, end: 21598619 },
    marginWidth: 150,
    trackWidth: 1350,
    multiplier: 3,
  };

  const initialTracks: Track[] = [
    {
      id: "1",
      title: "bigWig",
      titleSize: 12,
      height: 100,
      color: Vibrant[6],
      trackType: TrackType.BigWig,
      displayMode: DisplayMode.Full,
      url: "https://downloads.wenglab.org/DNAse_All_ENCODE_MAR20_2024_merged.bw",
    },
  ];

  return (
    <div>
      <Browser state={initialState} tracks={initialTracks} />
    </div>
  );
}
