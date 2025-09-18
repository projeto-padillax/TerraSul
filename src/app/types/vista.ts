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
  AreaUtil?: string
  AreaPrivativa?: string;
  ValorIptu?: string;
  ValorCondominio?: string;
  ObservacoesVenda?: string;
  GMapsLatitude?: string;
  GMapsLongitude?: string;
  Lancamento?: string;
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
  FotoDestaqueEmpreendimento?: string;
  VideoDestaque?: string;
  EstudaDacao?: string;
  Exclusivo?: string;

  Foto?: Record<
    string,
    {
      Codigo: string;
      Foto: string;
      FotoPequena?: string;
      Destaque?: string;
    }
  >;

  Video?: Record<
    string,
    {
      Destaque?: string;
      Video?: string;
    }
  >;

  Caracteristicas?: Record<string, string>;
};
