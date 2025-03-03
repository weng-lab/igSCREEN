export default function DetailsPage({
  params,
}: {
  params: { accession: string, detail: string }
}){
  return(
    <p>Viewing detail {params.detail} for {params.accession}</p>
  )
}