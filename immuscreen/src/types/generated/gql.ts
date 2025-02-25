/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query getFile(\n      $celltypes: [[String]]\n      $excludecelltypes: [[String]]\n      $uuid: String!\n      $group: [String!]\n    ) {\n      createicresFilesQuery(\n        uuid: $uuid\n        celltypes: $celltypes\n        excludecelltypes: $excludecelltypes\n        group: $group\n      )\n    }\n  ": typeof types.GetFileDocument,
    "\n        query count{\n          iCREsCountQuery(\n            celltypes: [[]]\n          )\n        }\n        ": typeof types.CountDocument,
    "\nquery rnaUmapQuery($gene_id: String!) \n{\n    calderonRnaUmapQuery(gene_id: $gene_id){\n      name\n      donor\n      stimulation      \n      celltype\n      class\n      umap_1\n      umap_2\n      value\n    }\n  }\n\n": typeof types.RnaUmapQueryDocument,
    "\n  query GeneeQTLQuery($study: String!, $geneid: String) \n    {\n        icreeQTLQuery(study:$study, geneid:$geneid) {\n          variant_id\n          pvalue\n          qvalue\n          geneid\n          pval_nominal\n          phenotype_id\n          celltype\n          study\n          rsid\n          pval_beta\n        \n        }\n    }\n  \n": typeof types.GeneeQtlQueryDocument,
    "\nquery atacUmapQuery($accession: String!) \n{\n    calderonAtacUmapQuery(accession: $accession){\n      name\n      donor\n      stimulation\n      end\n      celltype\n      class\n      umap_1\n      umap_2\n      value\n      \n    }\n  }\n\n": typeof types.AtacUmapQueryDocument,
    "\nquery calderoncorceszscoreAtacQuery1($accession: [String], $study: [String]) {\n  calderoncorcesAtacQuery(accession: $accession,study: $study) {\n    class\n    celltype\n    subclass\n    study\n    grouping\n    description\n    ct_description\n    order\n    stimulation    \n    value\n    pmid    \n    name\n    group\n  }\n}\n": typeof types.CalderoncorceszscoreAtacQuery1Document,
    "\nquery calderoncorcebyctszscoreAtacQuery($accession: [String], $study: [String]) {\n  calderoncorcesByCtAtacQuery(accession: $accession,study: $study) {\n    class\n    celltype\n    subclass\n    study\n    description\n    order\n    stimulation    \n    value    \n    name\n    group\n  }\n}\n": typeof types.CalderoncorcebyctszscoreAtacQueryDocument,
    "\nquery iCREQuery($coordinates: [GenomicRangeInput!],$accession: [String!]) \n  {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      rdhs\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n      }\n  }\n": typeof types.ICreQueryDocument,
    "\nquery ebiAssoc($accession: String, $snpid: String) \n  {\n    ebiAssociationsQuery(accession: $accession, snpid: $snpid) {\n      ccre\n      class\n      strongest_snp_risk_allele\n      snpid\n      risk_allele_frequency\n      region\n      chromosome\n      immu_screen_trait\n      mapped_trait\n      position\n      link\n      p_value\n      study\n      pubmedid\n      }\n  }\n\n": typeof types.EbiAssocDocument,
    "\n  query calderoncorceszscoreAtacQuery($accession: [String]) {\n    calderoncorcesAtacQuery(accession: $accession) {\n      grouping\n      description\n      name\n      start\n      value\n    }\n  }\n": typeof types.CalderoncorceszscoreAtacQueryDocument,
    "\n    query LDSC(\n      $study: [String]\n    ){\n      iCRELdrQuery(study: $study) {\n        snps\n        study\n        h2\n        enrichment\n        enrichment_p\n        enrichment_std_error\n        coefficient\n        coefficient_zscore\n        coefficient_std_error\n        celltype\n      }\n    }\n  ": typeof types.LdscDocument,
    "\n  query IntersectingIcres($coordinates: [GenomicRangeInput!]) {\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n": typeof types.IntersectingIcresDocument,
    "\n  query SNPeQTLQuery($study: String!, $rsid: String) {\n    icreeQTLQuery(study:$study, rsid:$rsid) {\n      variant_id\n      pvalue\n      qvalue\n      geneid          \n      celltype\n      study\n      rsid\n      pval_beta\n    }\n  }\n": typeof types.SnPeQtlQueryDocument,
    "\n  query SNP($snpids: [String]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": typeof types.SnpDocument,
    "\n  query BigRequests($bigRequests: [BigRequest!]!) {\n    bigRequests(requests: $bigRequests) {\n      data\n      error {\n        errortype\n        message\n      }\n    }\n  }\n": typeof types.BigRequestsDocument,
    "\n  query cytobands($assembly: String!, $chromosome: String) {\n    cytoband(assembly: $assembly, chromosome: $chromosome) {\n      stain\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": typeof types.CytobandsDocument,
    "\n  query s($chromosome: String, $start: Int, $end: Int, $assembly: String!,  $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: $assembly, version :$version) {\n      name\n      strand\n      transcripts {\n        name\n        strand\n        exons {\n          coordinates {\n            chromosome\n            start\n            end\n          }\n        }\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n  }\n": typeof types.SDocument,
    "\n  query bioampleQuery($assembly: String!) {\n    ccREBiosampleQuery(assembly: $assembly) {\n      biosamples {\n        name\n        dnase: experimentAccession(assay: \"DNase\")\n        h3k4me3: experimentAccession(assay: \"H3K4me3\")\n        h3k27ac: experimentAccession(assay: \"H3K27ac\")\n        ctcf: experimentAccession(assay: \"CTCF\")\n        dnase_signal: fileAccession(assay: \"DNase\")\n        h3k4me3_signal: fileAccession(assay: \"H3K4me3\")\n        h3k27ac_signal: fileAccession(assay: \"H3K27ac\")\n        ctcf_signal: fileAccession(assay: \"CTCF\")\n      }\n    }\n  }\n": typeof types.BioampleQueryDocument,
};
const documents: Documents = {
    "\n    query getFile(\n      $celltypes: [[String]]\n      $excludecelltypes: [[String]]\n      $uuid: String!\n      $group: [String!]\n    ) {\n      createicresFilesQuery(\n        uuid: $uuid\n        celltypes: $celltypes\n        excludecelltypes: $excludecelltypes\n        group: $group\n      )\n    }\n  ": types.GetFileDocument,
    "\n        query count{\n          iCREsCountQuery(\n            celltypes: [[]]\n          )\n        }\n        ": types.CountDocument,
    "\nquery rnaUmapQuery($gene_id: String!) \n{\n    calderonRnaUmapQuery(gene_id: $gene_id){\n      name\n      donor\n      stimulation      \n      celltype\n      class\n      umap_1\n      umap_2\n      value\n    }\n  }\n\n": types.RnaUmapQueryDocument,
    "\n  query GeneeQTLQuery($study: String!, $geneid: String) \n    {\n        icreeQTLQuery(study:$study, geneid:$geneid) {\n          variant_id\n          pvalue\n          qvalue\n          geneid\n          pval_nominal\n          phenotype_id\n          celltype\n          study\n          rsid\n          pval_beta\n        \n        }\n    }\n  \n": types.GeneeQtlQueryDocument,
    "\nquery atacUmapQuery($accession: String!) \n{\n    calderonAtacUmapQuery(accession: $accession){\n      name\n      donor\n      stimulation\n      end\n      celltype\n      class\n      umap_1\n      umap_2\n      value\n      \n    }\n  }\n\n": types.AtacUmapQueryDocument,
    "\nquery calderoncorceszscoreAtacQuery1($accession: [String], $study: [String]) {\n  calderoncorcesAtacQuery(accession: $accession,study: $study) {\n    class\n    celltype\n    subclass\n    study\n    grouping\n    description\n    ct_description\n    order\n    stimulation    \n    value\n    pmid    \n    name\n    group\n  }\n}\n": types.CalderoncorceszscoreAtacQuery1Document,
    "\nquery calderoncorcebyctszscoreAtacQuery($accession: [String], $study: [String]) {\n  calderoncorcesByCtAtacQuery(accession: $accession,study: $study) {\n    class\n    celltype\n    subclass\n    study\n    description\n    order\n    stimulation    \n    value    \n    name\n    group\n  }\n}\n": types.CalderoncorcebyctszscoreAtacQueryDocument,
    "\nquery iCREQuery($coordinates: [GenomicRangeInput!],$accession: [String!]) \n  {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      rdhs\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n      }\n  }\n": types.ICreQueryDocument,
    "\nquery ebiAssoc($accession: String, $snpid: String) \n  {\n    ebiAssociationsQuery(accession: $accession, snpid: $snpid) {\n      ccre\n      class\n      strongest_snp_risk_allele\n      snpid\n      risk_allele_frequency\n      region\n      chromosome\n      immu_screen_trait\n      mapped_trait\n      position\n      link\n      p_value\n      study\n      pubmedid\n      }\n  }\n\n": types.EbiAssocDocument,
    "\n  query calderoncorceszscoreAtacQuery($accession: [String]) {\n    calderoncorcesAtacQuery(accession: $accession) {\n      grouping\n      description\n      name\n      start\n      value\n    }\n  }\n": types.CalderoncorceszscoreAtacQueryDocument,
    "\n    query LDSC(\n      $study: [String]\n    ){\n      iCRELdrQuery(study: $study) {\n        snps\n        study\n        h2\n        enrichment\n        enrichment_p\n        enrichment_std_error\n        coefficient\n        coefficient_zscore\n        coefficient_std_error\n        celltype\n      }\n    }\n  ": types.LdscDocument,
    "\n  query IntersectingIcres($coordinates: [GenomicRangeInput!]) {\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n": types.IntersectingIcresDocument,
    "\n  query SNPeQTLQuery($study: String!, $rsid: String) {\n    icreeQTLQuery(study:$study, rsid:$rsid) {\n      variant_id\n      pvalue\n      qvalue\n      geneid          \n      celltype\n      study\n      rsid\n      pval_beta\n    }\n  }\n": types.SnPeQtlQueryDocument,
    "\n  query SNP($snpids: [String]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": types.SnpDocument,
    "\n  query BigRequests($bigRequests: [BigRequest!]!) {\n    bigRequests(requests: $bigRequests) {\n      data\n      error {\n        errortype\n        message\n      }\n    }\n  }\n": types.BigRequestsDocument,
    "\n  query cytobands($assembly: String!, $chromosome: String) {\n    cytoband(assembly: $assembly, chromosome: $chromosome) {\n      stain\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": types.CytobandsDocument,
    "\n  query s($chromosome: String, $start: Int, $end: Int, $assembly: String!,  $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: $assembly, version :$version) {\n      name\n      strand\n      transcripts {\n        name\n        strand\n        exons {\n          coordinates {\n            chromosome\n            start\n            end\n          }\n        }\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n  }\n": types.SDocument,
    "\n  query bioampleQuery($assembly: String!) {\n    ccREBiosampleQuery(assembly: $assembly) {\n      biosamples {\n        name\n        dnase: experimentAccession(assay: \"DNase\")\n        h3k4me3: experimentAccession(assay: \"H3K4me3\")\n        h3k27ac: experimentAccession(assay: \"H3K27ac\")\n        ctcf: experimentAccession(assay: \"CTCF\")\n        dnase_signal: fileAccession(assay: \"DNase\")\n        h3k4me3_signal: fileAccession(assay: \"H3K4me3\")\n        h3k27ac_signal: fileAccession(assay: \"H3K27ac\")\n        ctcf_signal: fileAccession(assay: \"CTCF\")\n      }\n    }\n  }\n": types.BioampleQueryDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query getFile(\n      $celltypes: [[String]]\n      $excludecelltypes: [[String]]\n      $uuid: String!\n      $group: [String!]\n    ) {\n      createicresFilesQuery(\n        uuid: $uuid\n        celltypes: $celltypes\n        excludecelltypes: $excludecelltypes\n        group: $group\n      )\n    }\n  "): (typeof documents)["\n    query getFile(\n      $celltypes: [[String]]\n      $excludecelltypes: [[String]]\n      $uuid: String!\n      $group: [String!]\n    ) {\n      createicresFilesQuery(\n        uuid: $uuid\n        celltypes: $celltypes\n        excludecelltypes: $excludecelltypes\n        group: $group\n      )\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n        query count{\n          iCREsCountQuery(\n            celltypes: [[]]\n          )\n        }\n        "): (typeof documents)["\n        query count{\n          iCREsCountQuery(\n            celltypes: [[]]\n          )\n        }\n        "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery rnaUmapQuery($gene_id: String!) \n{\n    calderonRnaUmapQuery(gene_id: $gene_id){\n      name\n      donor\n      stimulation      \n      celltype\n      class\n      umap_1\n      umap_2\n      value\n    }\n  }\n\n"): (typeof documents)["\nquery rnaUmapQuery($gene_id: String!) \n{\n    calderonRnaUmapQuery(gene_id: $gene_id){\n      name\n      donor\n      stimulation      \n      celltype\n      class\n      umap_1\n      umap_2\n      value\n    }\n  }\n\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GeneeQTLQuery($study: String!, $geneid: String) \n    {\n        icreeQTLQuery(study:$study, geneid:$geneid) {\n          variant_id\n          pvalue\n          qvalue\n          geneid\n          pval_nominal\n          phenotype_id\n          celltype\n          study\n          rsid\n          pval_beta\n        \n        }\n    }\n  \n"): (typeof documents)["\n  query GeneeQTLQuery($study: String!, $geneid: String) \n    {\n        icreeQTLQuery(study:$study, geneid:$geneid) {\n          variant_id\n          pvalue\n          qvalue\n          geneid\n          pval_nominal\n          phenotype_id\n          celltype\n          study\n          rsid\n          pval_beta\n        \n        }\n    }\n  \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery atacUmapQuery($accession: String!) \n{\n    calderonAtacUmapQuery(accession: $accession){\n      name\n      donor\n      stimulation\n      end\n      celltype\n      class\n      umap_1\n      umap_2\n      value\n      \n    }\n  }\n\n"): (typeof documents)["\nquery atacUmapQuery($accession: String!) \n{\n    calderonAtacUmapQuery(accession: $accession){\n      name\n      donor\n      stimulation\n      end\n      celltype\n      class\n      umap_1\n      umap_2\n      value\n      \n    }\n  }\n\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery calderoncorceszscoreAtacQuery1($accession: [String], $study: [String]) {\n  calderoncorcesAtacQuery(accession: $accession,study: $study) {\n    class\n    celltype\n    subclass\n    study\n    grouping\n    description\n    ct_description\n    order\n    stimulation    \n    value\n    pmid    \n    name\n    group\n  }\n}\n"): (typeof documents)["\nquery calderoncorceszscoreAtacQuery1($accession: [String], $study: [String]) {\n  calderoncorcesAtacQuery(accession: $accession,study: $study) {\n    class\n    celltype\n    subclass\n    study\n    grouping\n    description\n    ct_description\n    order\n    stimulation    \n    value\n    pmid    \n    name\n    group\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery calderoncorcebyctszscoreAtacQuery($accession: [String], $study: [String]) {\n  calderoncorcesByCtAtacQuery(accession: $accession,study: $study) {\n    class\n    celltype\n    subclass\n    study\n    description\n    order\n    stimulation    \n    value    \n    name\n    group\n  }\n}\n"): (typeof documents)["\nquery calderoncorcebyctszscoreAtacQuery($accession: [String], $study: [String]) {\n  calderoncorcesByCtAtacQuery(accession: $accession,study: $study) {\n    class\n    celltype\n    subclass\n    study\n    description\n    order\n    stimulation    \n    value    \n    name\n    group\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery iCREQuery($coordinates: [GenomicRangeInput!],$accession: [String!]) \n  {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      rdhs\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n      }\n  }\n"): (typeof documents)["\nquery iCREQuery($coordinates: [GenomicRangeInput!],$accession: [String!]) \n  {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      rdhs\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n      }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery ebiAssoc($accession: String, $snpid: String) \n  {\n    ebiAssociationsQuery(accession: $accession, snpid: $snpid) {\n      ccre\n      class\n      strongest_snp_risk_allele\n      snpid\n      risk_allele_frequency\n      region\n      chromosome\n      immu_screen_trait\n      mapped_trait\n      position\n      link\n      p_value\n      study\n      pubmedid\n      }\n  }\n\n"): (typeof documents)["\nquery ebiAssoc($accession: String, $snpid: String) \n  {\n    ebiAssociationsQuery(accession: $accession, snpid: $snpid) {\n      ccre\n      class\n      strongest_snp_risk_allele\n      snpid\n      risk_allele_frequency\n      region\n      chromosome\n      immu_screen_trait\n      mapped_trait\n      position\n      link\n      p_value\n      study\n      pubmedid\n      }\n  }\n\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query calderoncorceszscoreAtacQuery($accession: [String]) {\n    calderoncorcesAtacQuery(accession: $accession) {\n      grouping\n      description\n      name\n      start\n      value\n    }\n  }\n"): (typeof documents)["\n  query calderoncorceszscoreAtacQuery($accession: [String]) {\n    calderoncorcesAtacQuery(accession: $accession) {\n      grouping\n      description\n      name\n      start\n      value\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query LDSC(\n      $study: [String]\n    ){\n      iCRELdrQuery(study: $study) {\n        snps\n        study\n        h2\n        enrichment\n        enrichment_p\n        enrichment_std_error\n        coefficient\n        coefficient_zscore\n        coefficient_std_error\n        celltype\n      }\n    }\n  "): (typeof documents)["\n    query LDSC(\n      $study: [String]\n    ){\n      iCRELdrQuery(study: $study) {\n        snps\n        study\n        h2\n        enrichment\n        enrichment_p\n        enrichment_std_error\n        coefficient\n        coefficient_zscore\n        coefficient_std_error\n        celltype\n      }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query IntersectingIcres($coordinates: [GenomicRangeInput!]) {\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n"): (typeof documents)["\n  query IntersectingIcres($coordinates: [GenomicRangeInput!]) {\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SNPeQTLQuery($study: String!, $rsid: String) {\n    icreeQTLQuery(study:$study, rsid:$rsid) {\n      variant_id\n      pvalue\n      qvalue\n      geneid          \n      celltype\n      study\n      rsid\n      pval_beta\n    }\n  }\n"): (typeof documents)["\n  query SNPeQTLQuery($study: String!, $rsid: String) {\n    icreeQTLQuery(study:$study, rsid:$rsid) {\n      variant_id\n      pvalue\n      qvalue\n      geneid          \n      celltype\n      study\n      rsid\n      pval_beta\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query SNP($snpids: [String]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"): (typeof documents)["\n  query SNP($snpids: [String]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query BigRequests($bigRequests: [BigRequest!]!) {\n    bigRequests(requests: $bigRequests) {\n      data\n      error {\n        errortype\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  query BigRequests($bigRequests: [BigRequest!]!) {\n    bigRequests(requests: $bigRequests) {\n      data\n      error {\n        errortype\n        message\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query cytobands($assembly: String!, $chromosome: String) {\n    cytoband(assembly: $assembly, chromosome: $chromosome) {\n      stain\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"): (typeof documents)["\n  query cytobands($assembly: String!, $chromosome: String) {\n    cytoband(assembly: $assembly, chromosome: $chromosome) {\n      stain\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query s($chromosome: String, $start: Int, $end: Int, $assembly: String!,  $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: $assembly, version :$version) {\n      name\n      strand\n      transcripts {\n        name\n        strand\n        exons {\n          coordinates {\n            chromosome\n            start\n            end\n          }\n        }\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query s($chromosome: String, $start: Int, $end: Int, $assembly: String!,  $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: $assembly, version :$version) {\n      name\n      strand\n      transcripts {\n        name\n        strand\n        exons {\n          coordinates {\n            chromosome\n            start\n            end\n          }\n        }\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query bioampleQuery($assembly: String!) {\n    ccREBiosampleQuery(assembly: $assembly) {\n      biosamples {\n        name\n        dnase: experimentAccession(assay: \"DNase\")\n        h3k4me3: experimentAccession(assay: \"H3K4me3\")\n        h3k27ac: experimentAccession(assay: \"H3K27ac\")\n        ctcf: experimentAccession(assay: \"CTCF\")\n        dnase_signal: fileAccession(assay: \"DNase\")\n        h3k4me3_signal: fileAccession(assay: \"H3K4me3\")\n        h3k27ac_signal: fileAccession(assay: \"H3K27ac\")\n        ctcf_signal: fileAccession(assay: \"CTCF\")\n      }\n    }\n  }\n"): (typeof documents)["\n  query bioampleQuery($assembly: String!) {\n    ccREBiosampleQuery(assembly: $assembly) {\n      biosamples {\n        name\n        dnase: experimentAccession(assay: \"DNase\")\n        h3k4me3: experimentAccession(assay: \"H3K4me3\")\n        h3k27ac: experimentAccession(assay: \"H3K27ac\")\n        ctcf: experimentAccession(assay: \"CTCF\")\n        dnase_signal: fileAccession(assay: \"DNase\")\n        h3k4me3_signal: fileAccession(assay: \"H3K4me3\")\n        h3k27ac_signal: fileAccession(assay: \"H3K27ac\")\n        ctcf_signal: fileAccession(assay: \"CTCF\")\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;