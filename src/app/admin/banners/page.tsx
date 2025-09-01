import { getAllBanners } from "@/lib/actions/banner"
import BannersListClient from "@/components/admin/banners"

export default async function BannersListPage() {
  const banners = await getAllBanners();

  return <BannersListClient initialBanners={banners} />
}
