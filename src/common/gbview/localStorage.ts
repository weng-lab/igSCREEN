import { Domain, Highlight, Track } from "@weng-lab/genomebrowser";
import { BigWig } from "./addTracksModal";

type LocalBrowserState = {
  domain: Domain;
  highlights: Highlight[];
};

export function getLocalBrowser(name: string): LocalBrowserState | null {
  const localBrowserState = sessionStorage.getItem(name + "-browser-state");
  if (!localBrowserState) return null;
  const localBrowserStateJson = JSON.parse(localBrowserState) as LocalBrowserState;
  return localBrowserStateJson;
}

export function setLocalBrowser(name: string, localBrowserState: LocalBrowserState) {
  sessionStorage.setItem(name + "-browser-state", JSON.stringify(localBrowserState));
}

export function setLocalTracks(tracks: Track[]) {
  sessionStorage.setItem("local-tracks", JSON.stringify(tracks));
}

export function getLocalTracks(): Track[] {
  const localTracks = sessionStorage.getItem("local-tracks");
  if (!localTracks) return [];
  const localTracksJson = JSON.parse(localTracks) as Track[];
  return localTracksJson;
}

// temporary until we rework track selection
export function setLocalBiosamples(biosamples: any[] | null) {
  if (biosamples === null || biosamples.length === 0) {
    sessionStorage.removeItem("selected-biosamples");
  } else {
    sessionStorage.setItem("selected-biosamples", JSON.stringify(biosamples));
  }
}

export function getLocalBiosamples(): any[] | null {
  const localBiosamples = sessionStorage.getItem("selected-biosamples");
  if (!localBiosamples) return null;
  const localBiosamplesJson = JSON.parse(localBiosamples);
  return localBiosamplesJson;
}

export function setLocalChromHmmTissues(tissues: string[] | null) {
  if (tissues === null || tissues.length === 0) {
    sessionStorage.removeItem("selected-chromhmm-tissues");
  } else {
    sessionStorage.setItem("selected-chromhmm-tissues", JSON.stringify(tissues));
  }
}

export function getLocalChromHmmTissues(): string[] {
  const localTissues = sessionStorage.getItem("selected-chromhmm-tissues");
  if (!localTissues) return [];
  const localTissuesJson = JSON.parse(localTissues) as string[];
  return localTissuesJson;
}

export function setLocalSelectedTracks(tracks: BigWig[] | null) {
  if (tracks === null || tracks.length === 0) {
    sessionStorage.removeItem("selected-tracks");
  } else {
    sessionStorage.setItem("selected-tracks", JSON.stringify(tracks));
  }
}

export function getLocalSelectedTracks(): BigWig[] {
  const localSelectedTracks = sessionStorage.getItem("selected-tracks");
  if (!localSelectedTracks) return [];
  const localSelectedTracksJson = JSON.parse(localSelectedTracks) as BigWig[];
  return localSelectedTracksJson;
}
