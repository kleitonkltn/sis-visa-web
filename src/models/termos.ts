export class Termos {
  id: number;
  estabelecimento: number;
  denuncia: number;
  tipo_termo: string;
  razao: string;
  fantasia?: string;
  ramo: string;
  cnpj: string;
  insc: string;
  endereco: string;
  telefone: string;
  bairro: string;
  municipio: string;
  proprietario_nome: string;
  proprietario_rg: string;
  proprietario_classe: string;
  responsavel_nome: string;
  responsavel_rg: string;
  responsavel_classe: string;
  embasamento_legal: string;
  descricao: string;
  data: string;
  hora: string;
  fiscal_responsavel: number;
  fiscais_presentes: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  doc_solicitados: [];
}

export class CountTermos {
  tipo_termo: string;
  count: number;
}
