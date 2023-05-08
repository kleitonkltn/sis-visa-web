import { Assinatura } from './assinatura'
import { Estabelecimento } from './estabelecimento'
import { Usuario } from './usuario'

export interface ILicenca {
  id: number;
  licenca: number;
  estabelecimento: number;
  data_validade: string;
  data_emissao: string;
  fiscal: number;
  segundo_fiscal: number;
  gerente: number;
  solicitado_por: number;
  status_gerente: string;
  status_fiscal: string;
  status_segundo_fiscal: string;
  observacao_pedido: string;
  observacao_fiscal: string;
  observacao_segundo_fiscal: string;
  observacao_gerente: string;
  estabelecimento_data: Estabelecimento;
  fiscal_data: Usuario;
  segundo_fiscal_data: Usuario;
  gerente_data: Usuario;
  solicitado_por_data: Usuario;
  assinaturas_data: [Assinatura];

  readonly statusLicence: string;
}

export default class Licencas implements ILicenca {

  id!: number
  licenca!: number
  estabelecimento!: number
  data_validade!: string
  data_emissao!: string
  fiscal!: number
  segundo_fiscal!: number
  gerente!: number
  solicitado_por!: number
  status_gerente!: string
  status_fiscal!: string
  status_segundo_fiscal!: string
  observacao_pedido!: string
  observacao_fiscal!: string
  observacao_segundo_fiscal!: string
  observacao_gerente!: string
  estabelecimento_data!: Estabelecimento
  fiscal_data!: Usuario
  segundo_fiscal_data!: Usuario
  gerente_data!: Usuario
  solicitado_por_data!: Usuario
  assinaturas_data!: [Assinatura]

  get statusLicence(): string {
    return (this.status_fiscal === 'autorizada' && this.status_gerente ===
      'autorizada') || (this.status_fiscal === 'autorizada' && this.status_segundo_fiscal === 'autorizada') ?
      'Autorizada' : 'Pendente'
  }
}
