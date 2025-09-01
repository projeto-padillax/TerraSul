import { getAllSlides } from "@/lib/actions/slide"
import SlidesListClient from "@/components/admin/slides"

export default async function SlidesListPage() {
  const slides = await getAllSlides();

  return <SlidesListClient initialSlides={slides} />
}
