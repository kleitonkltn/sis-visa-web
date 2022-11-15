import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'tipoUsuario'
})
export class TipoUsuarioPipe implements PipeTransform {

  transform (value: string): string {
    switch (value) {
      case 'gerente':
        return 'Gerente de Vigilância Sanitária'
      case 'fiscal':
        return 'Técnico em Vigilância Sanitária'
      case 'administrativo':
        return 'Assistente Administrativo'
    }
  }
}
