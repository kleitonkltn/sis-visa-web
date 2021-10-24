import { Component, OnInit } from '@angular/core';
import { DenunciaService } from '../../../../service/denuncia.service';
import { ActivatedRoute } from '@angular/router';
import { Denuncias } from '../../../../../models/denuncias';
import { AnexoService } from '../../../../service/anexo.service';
import { Arquivos } from '../../../../../models/arquivos';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-denuncias',
  templateUrl: './denuncias.component.html',
  styleUrls: ['./denuncias.component.css']
})
export class DenunciasComponent implements OnInit {

  constructor (private route: ActivatedRoute, private denunciaService: DenunciaService, private anexoService: AnexoService) { }
  denuncia: Denuncias = {} as Denuncias;
  arquivo: Arquivos[] = []; statusDen = false; loadingTable = false;
  base64textString: string[] = [];
  public idupdate: number;
  titoProcedimento = 'Sem Procedimentos Cadastrados';
  titulo = 'Sem anexos cadastrados';
  item: Arquivos;

  ngOnInit () {
    this.pegaId();
  }

  pegaId () {
    this.route.queryParams.subscribe(
      queryParams => {
        this.idupdate = queryParams.id;
        if (this.idupdate != null)
        {
          this.denunciaService.ListarDenunciasPorID(this.idupdate).subscribe((denuncia) => {
            window.scrollTo(0, 0);
            this.denuncia = denuncia;
            this.denuncia.status = this.formatarStatusDenuncia(denuncia.status);
            this.denuncia.origem = this.formatarOrigemDenuncia(denuncia.origem);
            this.statusDen = true;
            if (this.denuncia.procedimentos != null)
            {
              this.titoProcedimento = 'Procedimento da denúncia';
            }
          }, () => {
          });
        }
      }
    );

    this.anexoService.listFilesByModel('denuncia', this.idupdate).subscribe((arq: Arquivos[]) => {
      this.arquivo = arq;
      if (this.arquivo.length > 0)
      {
        this.titulo = 'Anexos do Denúncia';
      }
    }, () => {
    });
  }

  verAnexo (item) {
    this.item = item;
    if (item.type === 'pdf' || item.type === 'docx')
    {
      window.open(item.url_location);
    }
  }
  formatarStatusDenuncia (tipoTermo) {
    switch (tipoTermo)
    {
      case 'notificada':
        return 'Notificada';
      case 'providenciasDiversas':
        return 'Providencia Diversas';
      case 'arquivada':
        return 'Arquivada';
      case 'aguardandoConstatacao':
        return 'Aguardado Constatação';
      case 'plubicadaEmEdital':
        return 'Plubicada em Edital';
      case 'infracionada':
        return 'Infracionada';
    }
  }
  formatarOrigemDenuncia (tipoTermo) {
    switch (tipoTermo)
    {
      case 'pagina_facebook':
        return 'Página do Facebook';
      case 'facebook':
        return 'Facebook';
      case 'whatsapp':
        return 'Whatsapp';
      case 'telefone':
        return 'Telefone';
      case 'pessoalmente':
        return 'Pessoalmente';
    }
  }


}
