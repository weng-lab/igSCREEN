import { Table, TableColDef } from "@weng-lab/ui-components";
import { useSnpFrequencies } from "common/hooks/useSnpFrequencies";

type Frequency = {
  population: string;
  frequency: number;
};

const populations: Record<string, string> = {
  SAS: "South Asian",
  EUR: "European",
  EAS: "East Asian",
  AMR: "American",
  AFR: "African",
};

const frequencyColumns: TableColDef<Frequency>[] = [
  {
    field: "population",
    headerName: "Population",
    valueGetter: (value: string) => populations[value] ?? "",
  },
  {
    field: "frequency",
    headerName: "Frequency",
    type: "number",
    valueFormatter: (value?: number) => (value ? value.toFixed(2) : ""),
  },
];

export default function SnpFrequencies({ snpid }: { snpid: string }) {
  const SnpAlleleFrequencies = useSnpFrequencies([snpid], "variant");
  const loading = SnpAlleleFrequencies.loading;
  const frequencies = SnpAlleleFrequencies.data?.[snpid]?.frequencies ?? [];

  return (
    <Table
      columns={frequencyColumns}
      rows={frequencies}
      loading={loading}
      label="Population Frequencies"
      pageSizeOptions={[5]}
      initialState={{
        sorting: {
          sortModel: [{ field: "population", sort: "asc" }],
        },
      }}
    />
  );
}
