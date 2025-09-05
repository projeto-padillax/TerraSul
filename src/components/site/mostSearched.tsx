import { getAllMaisAcessados } from "@/lib/actions/links";
import Link from "next/link";
export async function MostSearched() {
  const links = await getAllMaisAcessados();

  if (links.length == 0) return null;
  return (
    <section className="py-8 justify-items-center">
      <div className="px-8 sm:px-10 md:px-12 w-full max-w-7xl">
        <h1 className="text-center md:text-start text-4xl mb-8 font-semibold text-[#303030]">
          Mais buscados
        </h1>

        <div className="text-center md:text-start grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {links.map((item) => (
            <Link
              href={item.url}
              key={item.id}
              className="hover:text-site-primary text-[#303030] cursor-pointer hover:underline text-sm w-fit justify-self-center md:justify-self-start"
            >
              {item.titulo}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
