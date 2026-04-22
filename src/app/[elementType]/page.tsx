import { PortalClientPage } from "./PortalClientPage";

export default async function PortalPage({ params }: { params: Promise<{ elementType: string }> }) {
  const { elementType } = await params;
  return <PortalClientPage elementType={elementType} />;
}
