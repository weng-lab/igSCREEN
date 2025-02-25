import { GenomicRange } from "types/globalTypes"

/**
 * @todo Merge with utility.ts
 */

export function getClassDisplayname(input: string) {
  switch (input) {
    case ("PLS"): return "Promoter"
    case ("pELS"): return "Proximal Enhancer"
    case ("dELS"): return "Distal Enhancer"
    case ("CA-H3K4me3"): return "Chromatin Accessible with H3K4me3"
    case ("CA-TF"): return "Chromatin Accessible with TF"
    case ("CA-CTCF"): return "Chromatin Accessible with CTCF"
    case ("CA"): return "Chromatin Accessible"
    case ("TF"): return "Transcription Factor"
    case ("InActive"): return "Inactive"
    default: return "No Class Found"
  }
}

export function parseGenomicRangeString(input: string): GenomicRange {
  if (input.includes("%3A")) {
    return {
      // %3A is URL encoding of ":"
      chromosome: input.split("%3A")[0],
      start: +input.split("%3A")[1].split("-")[0],
      end: +input.split("%3A")[1].split("-")[1],
    }
  } else return {
    chromosome: input.split(":")[0],
    start: +input.split(":")[1].split("-")[0],
    end: +input.split(":")[1].split("-")[1],
  }
}