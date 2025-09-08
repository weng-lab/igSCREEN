package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
)

// This script is used to generate a json file containing the RNA-seq bigwigs
// leaving here for reference, just in case they are broken and need to be regenerated
func main() {
	f, err := os.ReadFile("experiment_metadata.tsv")
	if err != nil {
		log.Fatal(err)
	}
	lines := strings.Split(string(f), "\n")

	// Define the structure for each bigwig entry
	type BigwigEntry struct {
		Name        string `json:"name"`
		Lineage     string `json:"lineage"`
		Assay       string `json:"assay"`
		DisplayName string `json:"displayName"`
		FileID      string `json:"fileID"`
		URL         string `json:"url"`
	}

	// Map to store bigwig entries organized by lineage
	bigwigsByLineage := make(map[string][]BigwigEntry)

	// Process each line (skip header)
	for _, line := range lines[1:] {
		if strings.TrimSpace(line) == "" {
			continue
		}
		
		fields := strings.Split(line, "\t")
		if len(fields) < 5 {
			continue
		}

		lineage := fields[2]
		
		// Create bigwig entry for this line
		entry := BigwigEntry{
			Name:        fields[0],
			Lineage:     lineage,
			Assay:       "RNA",
			DisplayName: fields[4],
			FileID:      "",
			URL:         "https://users.wenglab.org/sheddn/igSCREEN_RNA/" + fields[0] + ".bw",
		}

		// Add to the appropriate lineage list
		bigwigsByLineage[lineage] = append(bigwigsByLineage[lineage], entry)
	}

	// Print summary
	for lineage, entries := range bigwigsByLineage {
		fmt.Printf("%s: %d entries\n", lineage, len(entries))
	}

	// Convert to JSON
	jsonData, err := json.MarshalIndent(bigwigsByLineage, "", "  ")
	if err != nil {
		log.Fatal(err)
	}
	
	// Write to file
	err = os.WriteFile("test.json", jsonData, 0644)
	if err != nil {
		log.Fatal(err)
	}
	
	fmt.Println("JSON file created successfully: test.json")
}

// Expected output format:
// {
//   "CD4_Tcells": [
//     {
//       "name": "DNase CD4_Tcells-merged",
//       "lineage": "CD4_Tcells",
//       "assay": "DNase",
//       "displayName": "CD4 T cells merged",
//       "fileID": "",
//       "url": "https://downloads.wenglab.org/igscreen/DNase_CD4_Tcells_merged_signal.bigWig"
//     }
//   ],
//   "CD8_Tcells": [
//     {
//       "name": "DNase CD8_Tcells-merged",
//       "lineage": "CD8_Tcells",
//       "assay": "DNase",
//       "displayName": "CD8 T cells merged",
//       "fileID": "",
//       "url": "https://downloads.wenglab.org/igscreen/DNase_CD8_Tcells_merged_signal.bigWig"
//     }
//   ]
// }