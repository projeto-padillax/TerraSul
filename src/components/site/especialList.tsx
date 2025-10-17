'use client'

import { ImovelCard } from '@/components/site/imovelcard'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Destaque } from '@/lib/types/destaque'
import { findEspecial } from '@/lib/actions/especiais'

interface EspecialListProps {
  id: string
}

export default function EspecialList({ id }: EspecialListProps) {
  const [imoveis, setImoveis] = useState<Destaque[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchImoveis() {
      try {
        const especial = await findEspecial(id)
        if (!especial || !especial.codigosImoveis.length) {
          setImoveis([])
          return
        }

        const codigos = especial.codigosImoveis

        const promises = codigos.map((codigo) =>
          fetch(`/api/vista/imoveis/${codigo}`).then((res) =>
            res.ok ? res.json() : null
          )
        )

        const resultados = await Promise.all(promises)
        setImoveis(resultados.filter(Boolean) as Destaque[])
      } catch (err) {
        console.error('Erro ao buscar imóveis da especial:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchImoveis()
  }, [id])

  function toSlug(text: string): string {
    return (
      text
        // .normalize("NFD") // separa acentos das letras
        .trim() // remove espaços extras do começo/fim
        .replace(/\s+/g, "-") // troca espaços por -
        .replace(/-+/g, "-")
    ); // evita múltiplos hífens
    // .toLowerCase();
  }

  function gerarTitulo(imovel: Destaque) {
    const capitalizar = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

    const categoria = imovel.Categoria ? capitalizar(imovel.Categoria) : 'Imóvel'

    const area = imovel.AreaUtil || imovel.AreaTotal
      ? `${imovel.AreaUtil || imovel.AreaTotal}m²`
      : ''

    const quartos = imovel.Dormitorios && imovel.Dormitorios !== '0'
      ? `${imovel.Dormitorios} quarto${imovel.Dormitorios === '1' ? '' : 's'}`
      : ''

    const suites = imovel.Suites && imovel.Suites !== '0'
      ? `${imovel.Suites} suíte${imovel.Suites === '1' ? '' : 's'}`
      : ''

    const vagas = imovel.Vagas && imovel.Vagas !== '0'
      ? `${imovel.Vagas} vaga${imovel.Vagas === '1' ? '' : 's'}`
      : ''

    const bairro = imovel.Bairro ? `no bairro ${capitalizar(imovel.Bairro)}` : ''
    const cidade = imovel.Cidade ? `em ${capitalizar(imovel.Cidade)}` : ''

    const detalhes = [area && `com ${area}`, quartos, suites, vagas]
      .filter(Boolean)
      .join(', ')

    const localizacao = [bairro, cidade].filter(Boolean).join(' ')

    if (!detalhes) {
      return [categoria, localizacao].filter(Boolean).join(' ')
    }

    return [categoria, detalhes, localizacao].filter(Boolean).join(', ')
  }

  if (loading) {
    return <p className="text-center text-gray-500 py-8">Carregando imóveis...</p>
  }

  if (!imoveis.length) {
    return <p className="text-center text-gray-500 py-8">Nenhum imóvel encontrado.</p>
  }

  const paraComprar = imoveis.filter((i) => i.Status === 'VENDA')
  const paraAlugar = imoveis.filter((i) => i.Status === 'ALUGUEL')

  return (
    <div className="w-full py-8 space-y-10">
      {paraComprar.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#333] mb-6">
            Imóveis para Comprar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paraComprar.map((imovel) => (
              <Link
                key={imovel.id}
                href={`/imovel/${toSlug(gerarTitulo(imovel))}/${imovel.Codigo}`}
              >
                <ImovelCard imovel={imovel} activeTab="comprar" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {paraAlugar.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#333] mb-6">
            Imóveis para Alugar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paraAlugar.map((imovel) => (
              <Link
                key={imovel.id}
                href={`/imovel/${(toSlug(gerarTitulo(imovel)))}/${imovel.Codigo}`}
              >
                <ImovelCard imovel={imovel} activeTab="alugar" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
