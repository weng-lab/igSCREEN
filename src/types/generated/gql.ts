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
    "\n  query CombinedEqtl($geneid: String) {\n    GTEX: icreeQTLQuery(study: \"GTEX\", geneid: $geneid) {\n      variant_id\n      qvalue\n      geneid\n      pval_nominal\n      phenotype_id\n      celltype\n      study\n      rsid\n      pval_beta\n    }\n      SoskicTrynka: icreeQTLQuery(study: \"Soskic.Trynka\", phenotype_id: $geneid) {\n      variant_id\n      pvalue\n      qvalue\n      geneid\n      pval_nominal\n      phenotype_id\n      celltype\n      study\n      rsid\n      pval_beta\n    }\n      YazarPowell: icreeQTLQuery(study: \"Yazar.Powell\", geneid: $geneid) {\n      variant_id\n      pvalue\n      qvalue\n      geneid\n      pval_nominal\n      phenotype_id\n      celltype\n      study\n      rsid\n      pval_beta\n    }\n  } \n": typeof types.CombinedEqtlDocument,
    "\nquery atacUmapQuery($accession: String!) \n{\n    calderonAtacUmapQuery(accession: $accession){\n      name\n      donor\n      stimulation\n      end\n      celltype\n      class\n      umap_1\n      umap_2\n      value\n      \n    }\n  }\n\n": typeof types.AtacUmapQueryDocument,
    "\nquery calderoncorceszscoreAtacQuery1($accession: [String], $study: [String]) {\n  calderoncorcesAtacQuery(accession: $accession,study: $study) {\n    class\n    celltype\n    subclass\n    study\n    grouping\n    description\n    ct_description\n    order\n    stimulation    \n    value\n    pmid    \n    name\n    group\n  }\n}\n": typeof types.CalderoncorceszscoreAtacQuery1Document,
    "\nquery calderoncorcebyctszscoreAtacQuery($accession: [String], $study: [String]) {\n  calderoncorcesByCtAtacQuery(accession: $accession,study: $study) {\n    class\n    celltype\n    subclass\n    study\n    description\n    order\n    stimulation    \n    value    \n    name\n    group\n  }\n}\n": typeof types.CalderoncorcebyctszscoreAtacQueryDocument,
    "\nquery iCREQuery($coordinates: [GenomicRangeInput!],$accession: [String!]) \n  {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      rdhs\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n      }\n  }\n": typeof types.ICreQueryDocument,
    "\nquery ebiAssoc($accession: String, $snpid: String) \n  {\n    ebiAssociationsQuery(accession: $accession, snpid: $snpid) {\n      ccre\n      class\n      strongest_snp_risk_allele\n      snpid\n      risk_allele_frequency\n      region\n      chromosome\n      immu_screen_trait\n      mapped_trait\n      position\n      link\n      p_value\n      study\n      pubmedid\n      }\n  }\n\n": typeof types.EbiAssocDocument,
    "\n  query calderoncorceszscoreAtacQuery($accession: [String]) {\n    calderoncorcesAtacQuery(accession: $accession) {\n      grouping\n      description\n      name\n      start\n      value\n    }\n  }\n": typeof types.CalderoncorceszscoreAtacQueryDocument,
    "\n  query nearbyGenomicFeatures($coordinates: [GenomicRangeInput!], $chromosome: String, $start: Int, $end: Int, $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: $version) {\n      name\n      strand\n      transcripts {\n        id\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n\n    snpQuery(coordinates: $coordinates, assembly: \"GRCh38\", common: true) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": typeof types.NearbyGenomicFeaturesDocument,
    "\n    query SNPeQTLQuery($study: String!, $rsid: String) {\n      icreeQTLQuery(study:$study, rsid:$rsid) {\n        variant_id\n        pvalue\n        qvalue\n        geneid          \n        celltype\n        study\n        rsid\n        pval_beta\n      }\n    }\n  ": typeof types.SnPeQtlQueryDocument,
    "\n    query getFile(\n      $celltypes: [[String]]\n      $excludecelltypes: [[String]]\n      $uuid: String!\n      $group: [String!]\n    ) {\n      createicresFilesQuery(\n        uuid: $uuid\n        celltypes: $celltypes\n        excludecelltypes: $excludecelltypes\n        group: $group\n      )\n    }\n  ": typeof types.GetFileDocument,
    "\n        query count{\n          iCREsCountQuery(\n            celltypes: [[]]\n          )\n        }\n        ": typeof types.CountDocument,
    "\n    query LDSC(\n      $study: [String]\n    ){\n      iCRELdrQuery(study: $study) {\n        snps\n        study\n        h2\n        enrichment\n        enrichment_p\n        enrichment_std_error\n        coefficient\n        coefficient_zscore\n        coefficient_std_error\n        celltype\n      }\n    }\n  ": typeof types.LdscDocument,
    "\n  query IntersectingIcres($coordinates: [GenomicRangeInput!]) {\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n": typeof types.IntersectingIcresDocument,
    "\n  query IcresActiveExperiments($accession: [String]) {\n    calderoncorcesAtacQuery(accession: $accession) {\n      grouping\n      description\n      name\n      value\n      icre\n    }\n  }\n": typeof types.IcresActiveExperimentsDocument,
    "\n  query BigRequests($bigRequests: [BigRequest!]!) {\n    bigRequests(requests: $bigRequests) {\n      data\n      error {\n        errortype\n        message\n      }\n    }\n  }\n": typeof types.BigRequestsDocument,
    "\n  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String]) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: 29, name: $name) {\n      name\n      id\n      strand\n      coordinates {\n        chromosome\n        end\n        start\n      }\n    }\n  }\n": typeof types.GeneDocument,
    "\n  query GeneExpression($gene_id: String!) {\n    immuneRnaUmapQuery(gene_id: $gene_id) {\n      umap_1    \n      umap_2\n      celltype\n      study\n      source\n      link\n      lineage\n      biosample\n      biosampleid    \n      expid\n      name    \n      value\n      stimulation\n    }\n  }\n": typeof types.GeneExpressionDocument,
    "\n  query Icre($coordinates: [GenomicRangeInput!], $accession: [String!]) {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n": typeof types.IcreDocument,
    "\n  query Snp($snpids: [String], $coordinates: [GenomicRangeInput]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids, coordinates: $coordinates) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": typeof types.SnpDocument,
};
const documents: Documents = {
    "\n  query CombinedEqtl($geneid: String) {\n    GTEX: icreeQTLQuery(study: \"GTEX\", geneid: $geneid) {\n      variant_id\n      qvalue\n      geneid\n      pval_nominal\n      phenotype_id\n      celltype\n      study\n      rsid\n      pval_beta\n    }\n      SoskicTrynka: icreeQTLQuery(study: \"Soskic.Trynka\", phenotype_id: $geneid) {\n      variant_id\n      pvalue\n      qvalue\n      geneid\n      pval_nominal\n      phenotype_id\n      celltype\n      study\n      rsid\n      pval_beta\n    }\n      YazarPowell: icreeQTLQuery(study: \"Yazar.Powell\", geneid: $geneid) {\n      variant_id\n      pvalue\n      qvalue\n      geneid\n      pval_nominal\n      phenotype_id\n      celltype\n      study\n      rsid\n      pval_beta\n    }\n  } \n": types.CombinedEqtlDocument,
    "\nquery atacUmapQuery($accession: String!) \n{\n    calderonAtacUmapQuery(accession: $accession){\n      name\n      donor\n      stimulation\n      end\n      celltype\n      class\n      umap_1\n      umap_2\n      value\n      \n    }\n  }\n\n": types.AtacUmapQueryDocument,
    "\nquery calderoncorceszscoreAtacQuery1($accession: [String], $study: [String]) {\n  calderoncorcesAtacQuery(accession: $accession,study: $study) {\n    class\n    celltype\n    subclass\n    study\n    grouping\n    description\n    ct_description\n    order\n    stimulation    \n    value\n    pmid    \n    name\n    group\n  }\n}\n": types.CalderoncorceszscoreAtacQuery1Document,
    "\nquery calderoncorcebyctszscoreAtacQuery($accession: [String], $study: [String]) {\n  calderoncorcesByCtAtacQuery(accession: $accession,study: $study) {\n    class\n    celltype\n    subclass\n    study\n    description\n    order\n    stimulation    \n    value    \n    name\n    group\n  }\n}\n": types.CalderoncorcebyctszscoreAtacQueryDocument,
    "\nquery iCREQuery($coordinates: [GenomicRangeInput!],$accession: [String!]) \n  {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      rdhs\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n      }\n  }\n": types.ICreQueryDocument,
    "\nquery ebiAssoc($accession: String, $snpid: String) \n  {\n    ebiAssociationsQuery(accession: $accession, snpid: $snpid) {\n      ccre\n      class\n      strongest_snp_risk_allele\n      snpid\n      risk_allele_frequency\n      region\n      chromosome\n      immu_screen_trait\n      mapped_trait\n      position\n      link\n      p_value\n      study\n      pubmedid\n      }\n  }\n\n": types.EbiAssocDocument,
    "\n  query calderoncorceszscoreAtacQuery($accession: [String]) {\n    calderoncorcesAtacQuery(accession: $accession) {\n      grouping\n      description\n      name\n      start\n      value\n    }\n  }\n": types.CalderoncorceszscoreAtacQueryDocument,
    "\n  query nearbyGenomicFeatures($coordinates: [GenomicRangeInput!], $chromosome: String, $start: Int, $end: Int, $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: $version) {\n      name\n      strand\n      transcripts {\n        id\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n\n    snpQuery(coordinates: $coordinates, assembly: \"GRCh38\", common: true) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n": types.NearbyGenomicFeaturesDocument,
    "\n    query SNPeQTLQuery($study: String!, $rsid: String) {\n      icreeQTLQuery(study:$study, rsid:$rsid) {\n        variant_id\n        pvalue\n        qvalue\n        geneid          \n        celltype\n        study\n        rsid\n        pval_beta\n      }\n    }\n  ": types.SnPeQtlQueryDocument,
    "\n    query getFile(\n      $celltypes: [[String]]\n      $excludecelltypes: [[String]]\n      $uuid: String!\n      $group: [String!]\n    ) {\n      createicresFilesQuery(\n        uuid: $uuid\n        celltypes: $celltypes\n        excludecelltypes: $excludecelltypes\n        group: $group\n      )\n    }\n  ": types.GetFileDocument,
    "\n        query count{\n          iCREsCountQuery(\n            celltypes: [[]]\n          )\n        }\n        ": types.CountDocument,
    "\n    query LDSC(\n      $study: [String]\n    ){\n      iCRELdrQuery(study: $study) {\n        snps\n        study\n        h2\n        enrichment\n        enrichment_p\n        enrichment_std_error\n        coefficient\n        coefficient_zscore\n        coefficient_std_error\n        celltype\n      }\n    }\n  ": types.LdscDocument,
    "\n  query IntersectingIcres($coordinates: [GenomicRangeInput!]) {\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n": types.IntersectingIcresDocument,
    "\n  query IcresActiveExperiments($accession: [String]) {\n    calderoncorcesAtacQuery(accession: $accession) {\n      grouping\n      description\n      name\n      value\n      icre\n    }\n  }\n": types.IcresActiveExperimentsDocument,
    "\n  query BigRequests($bigRequests: [BigRequest!]!) {\n    bigRequests(requests: $bigRequests) {\n      data\n      error {\n        errortype\n        message\n      }\n    }\n  }\n": types.BigRequestsDocument,
    "\n  query Gene($chromosome: String, $start: Int, $end: Int, $name: [String]) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: 29, name: $name) {\n      name\n      id\n      strand\n      coordinates {\n        chromosome\n        end\n        start\n      }\n    }\n  }\n": types.GeneDocument,
    "\n  query GeneExpression($gene_id: String!) {\n    immuneRnaUmapQuery(gene_id: $gene_id) {\n      umap_1    \n      umap_2\n      celltype\n      study\n      source\n      link\n      lineage\n      biosample\n      biosampleid    \n      expid\n      name    \n      value\n      stimulation\n    }\n  }\n": types.GeneExpressionDocument,
    "\n  query Icre($coordinates: [GenomicRangeInput!], $accession: [String!]) {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n": types.IcreDocument,
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
export function gql(source: "\n  query CombinedEqtl($geneid: String) {\n    GTEX: icreeQTLQuery(study: \"GTEX\", geneid: $geneid) {\n      variant_id\n      qvalue\n      geneid\n      pval_nominal\n      phenotype_id\n      celltype\n      study\n      rsid\n      pval_beta\n    }\n      SoskicTrynka: icreeQTLQuery(study: \"Soskic.Trynka\", phenotype_id: $geneid) {\n      variant_id\n      pvalue\n      qvalue\n      geneid\n      pval_nominal\n      phenotype_id\n      celltype\n      study\n      rsid\n      pval_beta\n    }\n      YazarPowell: icreeQTLQuery(study: \"Yazar.Powell\", geneid: $geneid) {\n      variant_id\n      pvalue\n      qvalue\n      geneid\n      pval_nominal\n      phenotype_id\n      celltype\n      study\n      rsid\n      pval_beta\n    }\n  } \n"): (typeof documents)["\n  query CombinedEqtl($geneid: String) {\n    GTEX: icreeQTLQuery(study: \"GTEX\", geneid: $geneid) {\n      variant_id\n      qvalue\n      geneid\n      pval_nominal\n      phenotype_id\n      celltype\n      study\n      rsid\n      pval_beta\n    }\n      SoskicTrynka: icreeQTLQuery(study: \"Soskic.Trynka\", phenotype_id: $geneid) {\n      variant_id\n      pvalue\n      qvalue\n      geneid\n      pval_nominal\n      phenotype_id\n      celltype\n      study\n      rsid\n      pval_beta\n    }\n      YazarPowell: icreeQTLQuery(study: \"Yazar.Powell\", geneid: $geneid) {\n      variant_id\n      pvalue\n      qvalue\n      geneid\n      pval_nominal\n      phenotype_id\n      celltype\n      study\n      rsid\n      pval_beta\n    }\n  } \n"];
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
export function gql(source: "\n  query nearbyGenomicFeatures($coordinates: [GenomicRangeInput!], $chromosome: String, $start: Int, $end: Int, $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: $version) {\n      name\n      strand\n      transcripts {\n        id\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n\n    snpQuery(coordinates: $coordinates, assembly: \"GRCh38\", common: true) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"): (typeof documents)["\n  query nearbyGenomicFeatures($coordinates: [GenomicRangeInput!], $chromosome: String, $start: Int, $end: Int, $version: Int) {\n    gene(chromosome: $chromosome, start: $start, end: $end, assembly: \"GRCh38\", version: $version) {\n      name\n      strand\n      transcripts {\n        id\n        coordinates {\n          chromosome\n          start\n          end\n        }\n      }\n    }\n\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n\n    snpQuery(coordinates: $coordinates, assembly: \"GRCh38\", common: true) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query SNPeQTLQuery($study: String!, $rsid: String) {\n      icreeQTLQuery(study:$study, rsid:$rsid) {\n        variant_id\n        pvalue\n        qvalue\n        geneid          \n        celltype\n        study\n        rsid\n        pval_beta\n      }\n    }\n  "): (typeof documents)["\n    query SNPeQTLQuery($study: String!, $rsid: String) {\n      icreeQTLQuery(study:$study, rsid:$rsid) {\n        variant_id\n        pvalue\n        qvalue\n        geneid          \n        celltype\n        study\n        rsid\n        pval_beta\n      }\n    }\n  "];
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
export function gql(source: "\n    query LDSC(\n      $study: [String]\n    ){\n      iCRELdrQuery(study: $study) {\n        snps\n        study\n        h2\n        enrichment\n        enrichment_p\n        enrichment_std_error\n        coefficient\n        coefficient_zscore\n        coefficient_std_error\n        celltype\n      }\n    }\n  "): (typeof documents)["\n    query LDSC(\n      $study: [String]\n    ){\n      iCRELdrQuery(study: $study) {\n        snps\n        study\n        h2\n        enrichment\n        enrichment_p\n        enrichment_std_error\n        coefficient\n        coefficient_zscore\n        coefficient_std_error\n        celltype\n      }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query IntersectingIcres($coordinates: [GenomicRangeInput!]) {\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n"): (typeof documents)["\n  query IntersectingIcres($coordinates: [GenomicRangeInput!]) {\n    iCREQuery(coordinates: $coordinates) {\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query IcresActiveExperiments($accession: [String]) {\n    calderoncorcesAtacQuery(accession: $accession) {\n      grouping\n      description\n      name\n      value\n      icre\n    }\n  }\n"): (typeof documents)["\n  query IcresActiveExperiments($accession: [String]) {\n    calderoncorcesAtacQuery(accession: $accession) {\n      grouping\n      description\n      name\n      value\n      icre\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query BigRequests($bigRequests: [BigRequest!]!) {\n    bigRequests(requests: $bigRequests) {\n      data\n      error {\n        errortype\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  query BigRequests($bigRequests: [BigRequest!]!) {\n    bigRequests(requests: $bigRequests) {\n      data\n      error {\n        errortype\n        message\n      }\n    }\n  }\n"];
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
export function gql(source: "\n  query Icre($coordinates: [GenomicRangeInput!], $accession: [String!]) {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n"): (typeof documents)["\n  query Icre($coordinates: [GenomicRangeInput!], $accession: [String!]) {\n    iCREQuery(coordinates: $coordinates, accession: $accession) {\n      accession\n      group\n      celltypes\n      coordinates {\n        start\n        end\n        chromosome\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Snp($snpids: [String], $coordinates: [GenomicRangeInput]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids, coordinates: $coordinates) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"): (typeof documents)["\n  query Snp($snpids: [String], $coordinates: [GenomicRangeInput]) {\n    snpQuery(assembly: \"GRCh38\", snpids: $snpids, coordinates: $coordinates) {\n      id\n      coordinates {\n        chromosome\n        start\n        end\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;