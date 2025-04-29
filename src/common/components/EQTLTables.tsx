import { useQuery } from "@apollo/client";
import { Grid2, Link, Skeleton, Stack, Box, Typography } from "@mui/material";
import { DataGridPro, GridColDef } from "@mui/x-data-grid-pro";
import { toScientificNotationElement } from "common/utility";
import { gql } from "types/generated";
import DataGridToolbar from "common/components/dataGridToolbar";
import { useElementMetadataReturn } from "common/hooks/useElementMetadata";
import { GenomicElementType } from "types/globalTypes";

const EQTL_QUERY = gql(`
query getimmuneeQTLsQuery($genes: [String], $snps: [String],$ccre: [String]) {
  immuneeQTLsQuery(genes: $genes, snps: $snps, ccre: $ccre) {
    rsid
    genename
    study
    fdr
    celltype
    ref
    chromosome
    position
    alt
    variant_id    
    pval_nominal
    ccre
    slope
    spearmans_rho
  }
} 
`);

export default function EQTLs<T extends GenomicElementType>({ data, elementType }: { elementType: T, data: useElementMetadataReturn<T>["data"] }) {

    let variables: Record<string, any> = {};
    let gtexTitle: string;
    let onekTitle: string;

    //Change query variables and table title based on element type
    if (elementType === "gene") {
        const geneData = data as useElementMetadataReturn<"gene">["data"];
        variables = { genes: [geneData.name] };
        gtexTitle = `GTEX whole-blood eQTLs for ${geneData.name}`;
        onekTitle = `OneK1K eQTLs for ${geneData.name}`;
    } else if (elementType === "icre") {
        const icreData = data as useElementMetadataReturn<"icre">["data"];
        variables = { ccre: [icreData.accession] };
        gtexTitle = `GTEX whole-blood eQTLs for ${icreData.accession}`;
        onekTitle = `OneK1K eQTLs for ${icreData.accession}`;
    } else {
        const snpData = data as useElementMetadataReturn<"variant">["data"];
        variables = { snps: [snpData.id] };
        gtexTitle = `GTEX whole-blood eQTLs for ${snpData.id}`;
        onekTitle = `OneK1K eQTLs for ${snpData.id}`;
    }

    const { loading, error, data: eqtlData } = useQuery(EQTL_QUERY, {
        variables,
        skip: !data,
    });

    const gtexRows = eqtlData?.immuneeQTLsQuery.filter((i) => i.study === "GTEX");
    const oneK1KRows = eqtlData?.immuneeQTLsQuery.filter((i) => i.study === "OneK1K");

    const gtexColumns: GridColDef[] = [
        {
            field: "variant_id",
            headerName: "Variant Name",
            flex: 2,
        },
        ...(elementType === "gene" || elementType === "icre"
            ? [
                {
                    field: "rsid",
                    headerName: "rs ID",
                    flex: 2,
                    renderCell: (params) =>
                        params.value === "." ? (
                            <>{params.value}</>
                        ) : (
                            <Link href={`/variant/${params.value}`}>{params.value}</Link>
                        ),
                },
            ]
            : []),
        ...(elementType === "variant" || elementType === "icre"
            ? [
                {
                    field: "genename",
                    headerName: "Gene",
                    flex: 2,
                    renderCell: (params) =>
                        params.value === "." ? (
                            <>{params.value}</>
                        ) : (
                            <Link href={`/gene/${params.value}`}>{params.value}</Link>
                        ),
                },
            ]
            : []),
        ...(elementType === "gene" || elementType === "icre"
            ? [
                { field: "chromosome", headerName: "Chromosome", flex: 2 },
                { field: "position", headerName: "Position", flex: 2 },
                { field: "ref", headerName: "Ref", flex: 2 },
                { field: "alt", headerName: "Alt", flex: 2 },
            ]
            : []),
        {
            field: "slope",
            headerName: "Slope",
            flex: 1,
            display: "flex",
            renderCell: (params) =>
                toScientificNotationElement(params.value, 2, { variant: "body2" }),
        },
        {
            field: "pval_nominal",
            headerName: "Nominal P",
            flex: 1.5,
            display: "flex",
            renderCell: (params) =>
                toScientificNotationElement(params.value, 2, { variant: "body2" }),
        },
        ...(elementType === "gene" || elementType === "variant"
            ? [
                {
                    field: "ccre",
                    headerName: "iCRE",
                    flex: 2,
                    renderCell: (params) =>
                        params.value === "." ? (
                            <>{params.value}</>
                        ) : (
                            <Link href={`/icre/${params.value}`}>{params.value}</Link>
                        ),
                },
            ]
            : []),
    ];


    const oneK1KColumns: GridColDef[] = [
        ...(elementType === "gene" || elementType === "icre"
            ? [
                {
                    field: "rsid",
                    headerName: "rs ID",
                    flex: 2,
                    renderCell: (params) => (
                        <Link href={`/variant/${params.value}`}>{params.value}</Link>
                    ),
                },
                {
                    field: "chromosome",
                    headerName: "Chromosome",
                    flex: 2,
                },
                {
                    field: "position",
                    headerName: "Position",
                    flex: 2,
                },
            ]
            : []),
        ...(elementType === "variant" || elementType === "icre"
            ? [
                {
                    field: "genename",
                    headerName: "Gene",
                    flex: 2,
                    renderCell: (params) => (
                        <Link href={`/gene/${params.value}`}>{params.value}</Link>
                    ),
                },
            ]
            : []),
        ...(elementType === "gene" || elementType === "icre"
            ? [
                {
                    field: "ref",
                    headerName: "A1",
                    flex: 2,
                },
                {
                    field: "alt",
                    headerName: "A2",
                    flex: 2,
                },
            ]
            : []),
        {
            field: "fdr",
            headerName: "FDR",
            flex: 1.5,
            display: "flex",
            renderCell: (params) =>
                toScientificNotationElement(params.value, 2, { variant: "body2" }),
        },
        {
            field: "spearmans_rho",
            headerName: "Spearman's rho",
            flex: 1,
            display: "flex",
            renderCell: (params) =>
                toScientificNotationElement(params.value, 2, { variant: "body2" }),
        },
        {
            field: "celltype",
            headerName: "Celltype",
            flex: 2,
        },
        ...(elementType === "gene" || elementType === "variant"
            ? [
                {
                    field: "ccre",
                    headerName: "iCRE",
                    flex: 2,
                    renderCell: (params) =>
                        params.value === "." ? (
                            <>{params.value}</>
                        ) : (
                            <Link href={`/icre/${params.value}`}>{params.value}</Link>
                        ),
                },
            ]
            : []),
    ];

    if (loading) {
        return (
            <Grid2 container spacing={2}>
                <Grid2 size={12}>
                    <Skeleton variant="rounded" width={"100%"} height={500} />
                </Grid2>
                <Grid2 size={12}>
                    <Skeleton variant="rounded" width={"100%"} height={500} />
                </Grid2>
            </Grid2>
        );
    }

    if (error) {
        throw new Error(JSON.stringify(error));
    }

    return (
        <Stack spacing={2}>
            <Box sx={{ flex: "1 1 auto" }}>
                {gtexRows.length > 0 ? (
                    <DataGridPro
                        columns={gtexColumns}
                        rows={gtexRows}
                        getRowId={(row) => row.variant_id + row.rsid + row.genename + row.pval_nominal}
                        slots={{ toolbar: DataGridToolbar }}
                        slotProps={{ toolbar: { title: gtexTitle } }}
                        pagination
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "pval_nominal", sort: "asc" }],
                            },
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                    page: 0,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        density="compact"
                        sx={{
                            borderRadius: 1,
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                        }}
                    />
                ) : (
                    <Typography
                        variant="h6"
                        pl={1}
                        sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            p: 2,
                        }}
                    >
                        No GTEX whole-blood eQTLs found
                    </Typography>
                )}
            </Box>
            <Box sx={{ flex: "1 1 auto" }}>
                {oneK1KRows.length > 0 ? (
                    <DataGridPro
                        columns={oneK1KColumns}
                        rows={oneK1KRows}
                        getRowId={(row) => row.variant_id + row.genename + row.fdr}
                        slots={{ toolbar: DataGridToolbar }}
                        slotProps={{ toolbar: { title: onekTitle } }}
                        pagination
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "fdr", sort: "asc" }],
                            },
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                    page: 0,
                                },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        density="compact"
                        sx={{
                            borderRadius: 1,
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                        }}
                    />
                ) : (
                    <Typography
                        variant="h6"
                        pl={1}
                        sx={{
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            p: 2,
                        }}
                    >
                        No OneK1K eQTLs found
                    </Typography>
                )}

            </Box>
        </Stack>
    );
}
