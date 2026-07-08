import { RequestDetailPlaceholder } from "@/features/requests/RequestDetailPlaceholder";

type RequestDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RequestDetailPage({
  params,
}: RequestDetailPageProps) {
  const { id } = await params;

  return <RequestDetailPlaceholder requestId={id} />;
}
