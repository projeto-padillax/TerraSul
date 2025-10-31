import { Phone } from "lucide-react";
import Link from "next/link";
// import  { useSidebar } from './sidebar';
import SidebarWrapper from "./sideBarWrapper";
import Image from "next/image";
import FavoriteIcon from "./favoritosIcon";
import { FaWhatsapp } from "react-icons/fa";
import { getLogo } from "@/lib/actions/config";

export default async function Header() {
  // const { isOpen, openSidebar, closeSidebar } = useSidebar();
  const logo = await getLogo();
  return (
    <>
      <header className="bg-white h-full py-2 sm:py-0 sm:h-28 content-center justify-items-center">
        <div className="px-8 sm:px-10 md:px-0 w-full max-w-7xl">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex-shrink-0">
              <Link href="/">
                {logo && (
                  <Image
                    src={logo}
                    alt={"Logo do Site"}
                    width={200}
                    height={69}
                  ></Image>
                )}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="inline-block sm:hidden">
                <Link href={"/favoritos"}>
                  <FavoriteIcon />
                </Link>
              </div>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-site-secondary">
                <Link href={"/favoritos"}>
                  <FavoriteIcon />
                </Link>
                <Link
                  href="tel:+555132577777"
                  className="flex items-center text-[#303030] hover:text-site-secondary-hover"
                  aria-label="Ligar para o número (51) 3257-7777"
                >
                  <Phone className="h-8 w-8 mr-1" />
                </Link>
                <Link
                  href="https://wa.me/5551981214507"
                  className="flex items-center text-[#303030] hover:text-site-secondary-hover"
                  aria-label="Conversar via WhatsApp"
                >
                  <FaWhatsapp className="h-8 w-8"></FaWhatsapp>
                </Link>
              </div>
              <SidebarWrapper />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
