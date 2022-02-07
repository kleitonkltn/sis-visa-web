import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoTermo'
})
export class TipoTermoPipe implements PipeTransform {

  transform (value: string): string {
    switch (value) {
      case 'inspecao':
        return 'Inspeção';
      case 'orientacao':
        return 'Orientação';
      case 'constatacao':
        return 'Constatação';
      case 'inutilizacao':
        return 'Inutilização';
      case 'interdicao':
        return 'Interdição';
      case 'desinterdicao':
        return 'Desinterdição';
      case 'notificacao':
        return 'Notificação';
      case 'infracao':
        return 'Infração';
      case 'relatorio':
        return 'Relatório';
    }
  }
}
