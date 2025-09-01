export type VistaImovel = {
  Codigo: string;
  Categoria?: string;
  Bairro?: string;
  Cidade?: string;
  ValorVenda?: string;
  ValorLocacao?: string;
  Dormitorios?: string;
  Suites?: string;
  Vagas?: string;
  AreaTotal?: string;
  AreaPrivativa?: string;
  DescricaoWeb?: string;
  ValorIptu?: string;
  ValorCondominio?: string;
  InformacaoVenda?: string;
  ObservacoesVenda?: string;
  GMapsLatitude?: string;
  GMapsLongitude?: string;
  Lancamento?: string;
  Finalidade?: string;
  Status?: string;
  Empreendimento?: string;
  Endereco?: string;
  Numero?: string;
  Complemento?: string;
  UF?: string;
  CEP?: string;
  DestaqueWeb?: string;
  FotoDestaque?: string;
  Latitude?: string;
  Longitude?: string;
  TituloSite?: string;
  FotoDestaqueEmpreendimento?: string;
  VideoDestaque?: string;
  Mobiliado?: string;

  Foto?: Record<
    string,
    {
      Codigo: string;
      Foto: string;
      FotoPequena?: string;
      Destaque?: string;
    }
  >;

  Caracteristicas?: Record<string, string>;
};
