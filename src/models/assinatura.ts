import { Usuario } from './usuario';

export class Assinatura {
    id!: string;
    id_estabelecimento!: number;
    id_licenca!: number;
    id_protocolo!: number;
    id_denuncia!: number;
    id_termo!: number;
    responsavel!: number;
    pendente!: boolean;
    createdAt!: string;
    updatedAt!: string;
    responsavel_data!: Usuario
}
