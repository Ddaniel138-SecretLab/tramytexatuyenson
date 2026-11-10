import PublicLayout from "@/components/layout/PublicLayout";
import { AnnouncementDetailPage } from "@/components/public/PublicPages";
export default async function AnnouncementDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PublicLayout><AnnouncementDetailPage slug={slug} /></PublicLayout>;
}
