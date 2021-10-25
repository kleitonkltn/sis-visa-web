import { Estabelecimento } from './estabelecimento';
import { Usuario } from './usuario';

export class Licencas {
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
}
