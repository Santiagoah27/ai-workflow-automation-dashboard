import { RequestDetail } from "@/features/requests/RequestDetail";

type RequestDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RequestDetailPage({
  params,
}: RequestDetailPageProps) {
  const { id } = await params;

  return <RequestDetail requestId={id} />;
}
