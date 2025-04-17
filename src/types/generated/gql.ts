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
    "\nquery getimmuneeQTLsQuery($genes: [String], $snps: [String]) {\n  immuneeQTLsQuery(genes: $genes, snps: $snps) {\n    rsid\n    genename\n    study\n    fdr\n    celltype\n    ref\n    chromosome\n    position\n    alt\n    variant_id    \n    pval_nominal\n    ccre\n  }\n} \n": typeof types.GetimmuneeQtLsQueryDocument,
    "\n  query nearbyGenomicFeatures($coordinates: [GenomicRangeInput!], $chromosome: String, $start: Int, $end: Int, $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: $version) {\n      name\n      strand\n      transcripts {\n        id\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n\n    snpQuery(coordinates: $coordinates, assembly: \"GRCh38\", common: true) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": typeof types.NearbyGenomicFeaturesDocument,
    "\n    query getimmuneeQTLsQuery($genes: [String], $snps: [String]) {\n      immuneeQTLsQuery(genes: $genes, snps: $snps) {\n        rsid\n        genename\n        study\n        fdr\n        celltype\n        ref\n        chromosome\n        position\n        alt\n        variant_id    \n        pval_nominal\n        ccre\n      }\n    } \n    ": typeof types.GetimmuneeQtLsQueryDocument,
    "\n  query GetIcreCounts(\n    $targetedcelltypes: [String!]!\n    $icreclasses: [String!]\n    $assay: AssayEnum!\n  ) {\n    upsetploticrecounts(\n      targetedcelltypes: $targetedcelltypes\n      icreclasses: $icreclasses\n      assay: $assay\n    ) {\n      count\n      includedCelltypes\n      excludedCelltypes\n    }\n  }\n": typeof types.GetIcreCountsDocument,
    "\n  query getSetFile(\n    $celltypes: [[String]]\n    $excludecelltypes: [[String]]\n    $dnasecelltypes: [[String]]\n    $dnaseexcludecelltypes: [[String]]\n    $uuid: String!\n    $group: [String!]\n  ) {\n    createicresFilesQuery(\n      uuid: $uuid\n      celltypes: $celltypes\n      excludecelltypes: $excludecelltypes\n      dnasecelltypes: $dnasecelltypes\n      dnaseexcludecelltypes: $dnaseexcludecelltypes\n      group: $group\n    )\n  }\n": typeof types.GetSetFileDocument,
    "\n  query getLDSCValues($study: [String]!) {\n    iCRELdscQuery(study: $study) {\n      study\n      expvalue\n      source\n      celltype\n      lineage\n      biosample\n      biosampleid\n      biosampleorder\n      stimulation\n\n      study_source\n      disease\n      category\n\n      snps\n      h2\n      h2_std_error\n      enrichment\n      enrichment_std_error\n      enrichment_p\n      coefficient\n      coefficient_std_error\n      coefficient_zscore\n    }\n  }\n": typeof types.GetLdscValuesDocument,
    "\n  query getLDSCBaselineValues($study: [String]!) {\n    iCRELdscBaselineQuery(study: $study) {\n      celltype\n      snps\n      h2\n      h2_std_error\n      study\n      enrichment\n      enrichment_std_error\n      enrichment_p\n      coefficient\n      coefficient_std_error\n      coefficient_zscore\n    }\n  }\n": typeof types.GetLdscBaselineValuesDocument,
    "\nquery getimmuneGWASLdr($icres: [String], $snps: [String]) {\n    immuneGWASLdrQuery(snps: $snps, icres: $icres) {\n      snp_chr\n      snp_end\n      snp_start\n      snpid\n      icre\n      ref_allele\n      effect_allele\n      zscore\n      study_source\n      disease\n      icre_chr\n      icre_start\n      icre_end\n      icre_class\n      study\n    }\n  }": typeof types.GetimmuneGwasLdrDocument,
    "\n  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String]) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: 29, name: $name) {\n      name\n      id\n      strand\n      coordinates {\n        chromosome\n        end\n        start\n      }\n    }\n  }\n": typeof types.GeneDocument,
    "\n  query GeneExpression($gene_id: String!) {\n    immuneRnaUmapQuery(gene_id: $gene_id) {\n      umap_1    \n      umap_2\n      celltype\n      study\n      source\n      link\n      lineage\n      biosample\n      biosampleid    \n      expid\n      name    \n      value\n      stimulation\n    }\n  }\n": typeof types.GeneExpressionDocument,
    "\n  query IcresZscores($accession: [String]!) {\n    immuneiCREsUmapQuery(accession: $accession) {\n      source\n      study\n      link\n      lineage\n      celltype\n      biosample\n      biosampleid\n      celltype_stim\n      stimulation\n      celltype_stim_order\n      biosample_order\n      name\n      expid\n      assay\n      value\n      umap_1\n      umap_2\n      umap_atac_1\n      umap_atac_2\n      umap_dnase_1\n      umap_dnase_2\n      accession\n    }\n  }\n": typeof types.IcresZscoresDocument,
    "\n  query Icre($coordinates: [GenomicRangeInput!], $accession: [String!]) {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      accession\n      group\n      ataccelltypes: celltypes\n      dnasecelltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n": typeof types.IcreDocument,
    "\n  query nearbyAndLinkedGenes(\n    $accessions: [String!]!\n    $assembly: String!\n  ) {\n    linkedGenes: linkedGenesQuery(assembly: $assembly, accession: $accessions) {\n      accession  \n      p_val\n      gene\n      geneid\n      genetype\n      method\n      grnaid\n      effectsize\n      assay\n      celltype\n      experiment_accession\n      tissue\n      variantid\n      source\n      slope\n      score\n      displayname\n    }\n  }\n": typeof types.NearbyAndLinkedGenesDocument,
    "query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession\n    isiCRE\n  }\n}": typeof types.CCreAutocompleteQueryDocument,
    "\nquery LinkedcCREs($geneid: [String!]!, $assembly: String!) {\n  linkedcCREs: linkedcCREsQuery(assembly: $assembly, geneid: $geneid) {\n    accession\n    p_val\n    gene\n    geneid\n    genetype\n    method\n    grnaid\n    effectsize\n    assay\n    celltype\n    experiment_accession\n    tissue\n    variantid\n    source\n    slope\n    score\n    displayname\n    __typename\n  }\n}\n  ": typeof types.LinkedcCrEsDocument,
    "\n  query Snp($snpids: [String], $coordinates: [GenomicRangeInput]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids, coordinates: $coordinates) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": typeof types.SnpDocument,
};
const documents: Documents = {
    "\nquery getimmuneeQTLsQuery($genes: [String], $snps: [String]) {\n  immuneeQTLsQuery(genes: $genes, snps: $snps) {\n    rsid\n    genename\n    study\n    fdr\n    celltype\n    ref\n    chromosome\n    position\n    alt\n    variant_id    \n    pval_nominal\n    ccre\n  }\n} \n": types.GetimmuneeQtLsQueryDocument,
    "\n  query nearbyGenomicFeatures($coordinates: [GenomicRangeInput!], $chromosome: String, $start: Int, $end: Int, $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: $version) {\n      name\n      strand\n      transcripts {\n        id\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n\n    snpQuery(coordinates: $coordinates, assembly: \"GRCh38\", common: true) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": types.NearbyGenomicFeaturesDocument,
    "\n    query getimmuneeQTLsQuery($genes: [String], $snps: [String]) {\n      immuneeQTLsQuery(genes: $genes, snps: $snps) {\n        rsid\n        genename\n        study\n        fdr\n        celltype\n        ref\n        chromosome\n        position\n        alt\n        variant_id    \n        pval_nominal\n        ccre\n      }\n    } \n    ": types.GetimmuneeQtLsQueryDocument,
    "\n  query GetIcreCounts(\n    $targetedcelltypes: [String!]!\n    $icreclasses: [String!]\n    $assay: AssayEnum!\n  ) {\n    upsetploticrecounts(\n      targetedcelltypes: $targetedcelltypes\n      icreclasses: $icreclasses\n      assay: $assay\n    ) {\n      count\n      includedCelltypes\n      excludedCelltypes\n    }\n  }\n": types.GetIcreCountsDocument,
    "\n  query getSetFile(\n    $celltypes: [[String]]\n    $excludecelltypes: [[String]]\n    $dnasecelltypes: [[String]]\n    $dnaseexcludecelltypes: [[String]]\n    $uuid: String!\n    $group: [String!]\n  ) {\n    createicresFilesQuery(\n      uuid: $uuid\n      celltypes: $celltypes\n      excludecelltypes: $excludecelltypes\n      dnasecelltypes: $dnasecelltypes\n      dnaseexcludecelltypes: $dnaseexcludecelltypes\n      group: $group\n    )\n  }\n": types.GetSetFileDocument,
    "\n  query getLDSCValues($study: [String]!) {\n    iCRELdscQuery(study: $study) {\n      study\n      expvalue\n      source\n      celltype\n      lineage\n      biosample\n      biosampleid\n      biosampleorder\n      stimulation\n\n      study_source\n      disease\n      category\n\n      snps\n      h2\n      h2_std_error\n      enrichment\n      enrichment_std_error\n      enrichment_p\n      coefficient\n      coefficient_std_error\n      coefficient_zscore\n    }\n  }\n": types.GetLdscValuesDocument,
    "\n  query getLDSCBaselineValues($study: [String]!) {\n    iCRELdscBaselineQuery(study: $study) {\n      celltype\n      snps\n      h2\n      h2_std_error\n      study\n      enrichment\n      enrichment_std_error\n      enrichment_p\n      coefficient\n      coefficient_std_error\n      coefficient_zscore\n    }\n  }\n": types.GetLdscBaselineValuesDocument,
    "\nquery getimmuneGWASLdr($icres: [String], $snps: [String]) {\n    immuneGWASLdrQuery(snps: $snps, icres: $icres) {\n      snp_chr\n      snp_end\n      snp_start\n      snpid\n      icre\n      ref_allele\n      effect_allele\n      zscore\n      study_source\n      disease\n      icre_chr\n      icre_start\n      icre_end\n      icre_class\n      study\n    }\n  }": types.GetimmuneGwasLdrDocument,
    "\n  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String]) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: 29, name: $name) {\n      name\n      id\n      strand\n      coordinates {\n        chromosome\n        end\n        start\n      }\n    }\n  }\n": types.GeneDocument,
    "\n  query GeneExpression($gene_id: String!) {\n    immuneRnaUmapQuery(gene_id: $gene_id) {\n      umap_1    \n      umap_2\n      celltype\n      study\n      source\n      link\n      lineage\n      biosample\n      biosampleid    \n      expid\n      name    \n      value\n      stimulation\n    }\n  }\n": types.GeneExpressionDocument,
    "\n  query IcresZscores($accession: [String]!) {\n    immuneiCREsUmapQuery(accession: $accession) {\n      source\n      study\n      link\n      lineage\n      celltype\n      biosample\n      biosampleid\n      celltype_stim\n      stimulation\n      celltype_stim_order\n      biosample_order\n      name\n      expid\n      assay\n      value\n      umap_1\n      umap_2\n      umap_atac_1\n      umap_atac_2\n      umap_dnase_1\n      umap_dnase_2\n      accession\n    }\n  }\n": types.IcresZscoresDocument,
    "\n  query Icre($coordinates: [GenomicRangeInput!], $accession: [String!]) {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      accession\n      group\n      ataccelltypes: celltypes\n      dnasecelltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n": types.IcreDocument,
    "\n  query nearbyAndLinkedGenes(\n    $accessions: [String!]!\n    $assembly: String!\n  ) {\n    linkedGenes: linkedGenesQuery(assembly: $assembly, accession: $accessions) {\n      accession  \n      p_val\n      gene\n      geneid\n      genetype\n      method\n      grnaid\n      effectsize\n      assay\n      celltype\n      experiment_accession\n      tissue\n      variantid\n      source\n      slope\n      score\n      displayname\n    }\n  }\n": types.NearbyAndLinkedGenesDocument,
    "query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession\n    isiCRE\n  }\n}": types.CCreAutocompleteQueryDocument,
    "\nquery LinkedcCREs($geneid: [String!]!, $assembly: String!) {\n  linkedcCREs: linkedcCREsQuery(assembly: $assembly, geneid: $geneid) {\n    accession\n    p_val\n    gene\n    geneid\n    genetype\n    method\n    grnaid\n    effectsize\n    assay\n    celltype\n    experiment_accession\n    tissue\n    variantid\n    source\n    slope\n    score\n    displayname\n    __typename\n  }\n}\n  ": types.LinkedcCrEsDocument,
    "\n  query Snp($snpids: [String], $coordinates: [GenomicRangeInput]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids, coordinates: $coordinates) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": types.SnpDocument,
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
export function gql(source: "\nquery getimmuneeQTLsQuery($genes: [String], $snps: [String]) {\n  immuneeQTLsQuery(genes: $genes, snps: $snps) {\n    rsid\n    genename\n    study\n    fdr\n    celltype\n    ref\n    chromosome\n    position\n    alt\n    variant_id    \n    pval_nominal\n    ccre\n  }\n} \n"): (typeof documents)["\nquery getimmuneeQTLsQuery($genes: [String], $snps: [String]) {\n  immuneeQTLsQuery(genes: $genes, snps: $snps) {\n    rsid\n    genename\n    study\n    fdr\n    celltype\n    ref\n    chromosome\n    position\n    alt\n    variant_id    \n    pval_nominal\n    ccre\n  }\n} \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query nearbyGenomicFeatures($coordinates: [GenomicRangeInput!], $chromosome: String, $start: Int, $end: Int, $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: $version) {\n      name\n      strand\n      transcripts {\n        id\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n\n    snpQuery(coordinates: $coordinates, assembly: \"GRCh38\", common: true) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"): (typeof documents)["\n  query nearbyGenomicFeatures($coordinates: [GenomicRangeInput!], $chromosome: String, $start: Int, $end: Int, $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: $version) {\n      name\n      strand\n      transcripts {\n        id\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n\n    snpQuery(coordinates: $coordinates, assembly: \"GRCh38\", common: true) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query getimmuneeQTLsQuery($genes: [String], $snps: [String]) {\n      immuneeQTLsQuery(genes: $genes, snps: $snps) {\n        rsid\n        genename\n        study\n        fdr\n        celltype\n        ref\n        chromosome\n        position\n        alt\n        variant_id    \n        pval_nominal\n        ccre\n      }\n    } \n    "): (typeof documents)["\n    query getimmuneeQTLsQuery($genes: [String], $snps: [String]) {\n      immuneeQTLsQuery(genes: $genes, snps: $snps) {\n        rsid\n        genename\n        study\n        fdr\n        celltype\n        ref\n        chromosome\n        position\n        alt\n        variant_id    \n        pval_nominal\n        ccre\n      }\n    } \n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetIcreCounts(\n    $targetedcelltypes: [String!]!\n    $icreclasses: [String!]\n    $assay: AssayEnum!\n  ) {\n    upsetploticrecounts(\n      targetedcelltypes: $targetedcelltypes\n      icreclasses: $icreclasses\n      assay: $assay\n    ) {\n      count\n      includedCelltypes\n      excludedCelltypes\n    }\n  }\n"): (typeof documents)["\n  query GetIcreCounts(\n    $targetedcelltypes: [String!]!\n    $icreclasses: [String!]\n    $assay: AssayEnum!\n  ) {\n    upsetploticrecounts(\n      targetedcelltypes: $targetedcelltypes\n      icreclasses: $icreclasses\n      assay: $assay\n    ) {\n      count\n      includedCelltypes\n      excludedCelltypes\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getSetFile(\n    $celltypes: [[String]]\n    $excludecelltypes: [[String]]\n    $dnasecelltypes: [[String]]\n    $dnaseexcludecelltypes: [[String]]\n    $uuid: String!\n    $group: [String!]\n  ) {\n    createicresFilesQuery(\n      uuid: $uuid\n      celltypes: $celltypes\n      excludecelltypes: $excludecelltypes\n      dnasecelltypes: $dnasecelltypes\n      dnaseexcludecelltypes: $dnaseexcludecelltypes\n      group: $group\n    )\n  }\n"): (typeof documents)["\n  query getSetFile(\n    $celltypes: [[String]]\n    $excludecelltypes: [[String]]\n    $dnasecelltypes: [[String]]\n    $dnaseexcludecelltypes: [[String]]\n    $uuid: String!\n    $group: [String!]\n  ) {\n    createicresFilesQuery(\n      uuid: $uuid\n      celltypes: $celltypes\n      excludecelltypes: $excludecelltypes\n      dnasecelltypes: $dnasecelltypes\n      dnaseexcludecelltypes: $dnaseexcludecelltypes\n      group: $group\n    )\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getLDSCValues($study: [String]!) {\n    iCRELdscQuery(study: $study) {\n      study\n      expvalue\n      source\n      celltype\n      lineage\n      biosample\n      biosampleid\n      biosampleorder\n      stimulation\n\n      study_source\n      disease\n      category\n\n      snps\n      h2\n      h2_std_error\n      enrichment\n      enrichment_std_error\n      enrichment_p\n      coefficient\n      coefficient_std_error\n      coefficient_zscore\n    }\n  }\n"): (typeof documents)["\n  query getLDSCValues($study: [String]!) {\n    iCRELdscQuery(study: $study) {\n      study\n      expvalue\n      source\n      celltype\n      lineage\n      biosample\n      biosampleid\n      biosampleorder\n      stimulation\n\n      study_source\n      disease\n      category\n\n      snps\n      h2\n      h2_std_error\n      enrichment\n      enrichment_std_error\n      enrichment_p\n      coefficient\n      coefficient_std_error\n      coefficient_zscore\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query getLDSCBaselineValues($study: [String]!) {\n    iCRELdscBaselineQuery(study: $study) {\n      celltype\n      snps\n      h2\n      h2_std_error\n      study\n      enrichment\n      enrichment_std_error\n      enrichment_p\n      coefficient\n      coefficient_std_error\n      coefficient_zscore\n    }\n  }\n"): (typeof documents)["\n  query getLDSCBaselineValues($study: [String]!) {\n    iCRELdscBaselineQuery(study: $study) {\n      celltype\n      snps\n      h2\n      h2_std_error\n      study\n      enrichment\n      enrichment_std_error\n      enrichment_p\n      coefficient\n      coefficient_std_error\n      coefficient_zscore\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery getimmuneGWASLdr($icres: [String], $snps: [String]) {\n    immuneGWASLdrQuery(snps: $snps, icres: $icres) {\n      snp_chr\n      snp_end\n      snp_start\n      snpid\n      icre\n      ref_allele\n      effect_allele\n      zscore\n      study_source\n      disease\n      icre_chr\n      icre_start\n      icre_end\n      icre_class\n      study\n    }\n  }"): (typeof documents)["\nquery getimmuneGWASLdr($icres: [String], $snps: [String]) {\n    immuneGWASLdrQuery(snps: $snps, icres: $icres) {\n      snp_chr\n      snp_end\n      snp_start\n      snpid\n      icre\n      ref_allele\n      effect_allele\n      zscore\n      study_source\n      disease\n      icre_chr\n      icre_start\n      icre_end\n      icre_class\n      study\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String]) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: 29, name: $name) {\n      name\n      id\n      strand\n      coordinates {\n        chromosome\n        end\n        start\n      }\n    }\n  }\n"): (typeof documents)["\n  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String]) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: 29, name: $name) {\n      name\n      id\n      strand\n      coordinates {\n        chromosome\n        end\n        start\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GeneExpression($gene_id: String!) {\n    immuneRnaUmapQuery(gene_id: $gene_id) {\n      umap_1    \n      umap_2\n      celltype\n      study\n      source\n      link\n      lineage\n      biosample\n      biosampleid    \n      expid\n      name    \n      value\n      stimulation\n    }\n  }\n"): (typeof documents)["\n  query GeneExpression($gene_id: String!) {\n    immuneRnaUmapQuery(gene_id: $gene_id) {\n      umap_1    \n      umap_2\n      celltype\n      study\n      source\n      link\n      lineage\n      biosample\n      biosampleid    \n      expid\n      name    \n      value\n      stimulation\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query IcresZscores($accession: [String]!) {\n    immuneiCREsUmapQuery(accession: $accession) {\n      source\n      study\n      link\n      lineage\n      celltype\n      biosample\n      biosampleid\n      celltype_stim\n      stimulation\n      celltype_stim_order\n      biosample_order\n      name\n      expid\n      assay\n      value\n      umap_1\n      umap_2\n      umap_atac_1\n      umap_atac_2\n      umap_dnase_1\n      umap_dnase_2\n      accession\n    }\n  }\n"): (typeof documents)["\n  query IcresZscores($accession: [String]!) {\n    immuneiCREsUmapQuery(accession: $accession) {\n      source\n      study\n      link\n      lineage\n      celltype\n      biosample\n      biosampleid\n      celltype_stim\n      stimulation\n      celltype_stim_order\n      biosample_order\n      name\n      expid\n      assay\n      value\n      umap_1\n      umap_2\n      umap_atac_1\n      umap_atac_2\n      umap_dnase_1\n      umap_dnase_2\n      accession\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Icre($coordinates: [GenomicRangeInput!], $accession: [String!]) {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      accession\n      group\n      ataccelltypes: celltypes\n      dnasecelltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n"): (typeof documents)["\n  query Icre($coordinates: [GenomicRangeInput!], $accession: [String!]) {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      accession\n      group\n      ataccelltypes: celltypes\n      dnasecelltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query nearbyAndLinkedGenes(\n    $accessions: [String!]!\n    $assembly: String!\n  ) {\n    linkedGenes: linkedGenesQuery(assembly: $assembly, accession: $accessions) {\n      accession  \n      p_val\n      gene\n      geneid\n      genetype\n      method\n      grnaid\n      effectsize\n      assay\n      celltype\n      experiment_accession\n      tissue\n      variantid\n      source\n      slope\n      score\n      displayname\n    }\n  }\n"): (typeof documents)["\n  query nearbyAndLinkedGenes(\n    $accessions: [String!]!\n    $assembly: String!\n  ) {\n    linkedGenes: linkedGenesQuery(assembly: $assembly, accession: $accessions) {\n      accession  \n      p_val\n      gene\n      geneid\n      genetype\n      method\n      grnaid\n      effectsize\n      assay\n      celltype\n      experiment_accession\n      tissue\n      variantid\n      source\n      slope\n      score\n      displayname\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession\n    isiCRE\n  }\n}"): (typeof documents)["query cCREAutocompleteQuery(\n  $accession: [String!]\n  $assembly: String!\n  $includeiCREs: Boolean  \n) {\n  cCREAutocompleteQuery(\n    includeiCREs: $includeiCREs\n    assembly: $assembly    \n    accession: $accession\n  ) {    \n    accession\n    isiCRE\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\nquery LinkedcCREs($geneid: [String!]!, $assembly: String!) {\n  linkedcCREs: linkedcCREsQuery(assembly: $assembly, geneid: $geneid) {\n    accession\n    p_val\n    gene\n    geneid\n    genetype\n    method\n    grnaid\n    effectsize\n    assay\n    celltype\n    experiment_accession\n    tissue\n    variantid\n    source\n    slope\n    score\n    displayname\n    __typename\n  }\n}\n  "): (typeof documents)["\nquery LinkedcCREs($geneid: [String!]!, $assembly: String!) {\n  linkedcCREs: linkedcCREsQuery(assembly: $assembly, geneid: $geneid) {\n    accession\n    p_val\n    gene\n    geneid\n    genetype\n    method\n    grnaid\n    effectsize\n    assay\n    celltype\n    experiment_accession\n    tissue\n    variantid\n    source\n    slope\n    score\n    displayname\n    __typename\n  }\n}\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Snp($snpids: [String], $coordinates: [GenomicRangeInput]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids, coordinates: $coordinates) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"): (typeof documents)["\n  query Snp($snpids: [String], $coordinates: [GenomicRangeInput]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids, coordinates: $coordinates) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;