export default function DetailsPage({
  params: { elementType, elementID, tab },
}: {
  params: { elementType: string, elementID: string, tab: string } 
}){
  return(
    <p>Viewing {tab} for {elementID} in {elementType} Portal</p>
  )
}