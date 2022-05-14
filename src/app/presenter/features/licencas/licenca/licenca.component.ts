import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Arquivos } from '../../../../../models/arquivos';
import { Licencas } from '../../../../../models/licencas';
import { AnexoService } from '../../../../services/anexo.service';
import { EstabelecimentoService } from '../../../../services/estabelecimento.service';
import { LicencaService } from '../../../../services/licenca.service';
import { PdfService } from '../../../../services/pdf.service';

@Component({
  selector: 'app-licenca',
  templateUrl: './licenca.component.html',
  styleUrls: ['./licenca.component.css']
})
export class LicencaComponent implements OnInit {

  public idLicenca;
  @Input() pdf; statusLi = false; loadingTable = false;
  @Input() licenca: Licencas = {} as Licencas;
  arquivo: Arquivos[] = [];
  base64textString: string[] = [];
  titulo = 'Sem anexos cadastrado';
  item: Arquivos;
  loadingPdf = true;
  loading = true;
  idEstabelecimento;
  dataEstabelecimento;

  constructor (private route: ActivatedRoute, private licencaService: LicencaService,
    private anexoService: AnexoService, private pdfService: PdfService,
    private estabelecimentoService: EstabelecimentoService) { }

  ngOnInit () {
    this.pegaId();
  }
  licencaPdf () {
    this.loadingPdf = false;
    if ((this.licenca.status_fiscal === 'autorizada'
      && this.licenca.status_gerente === 'autorizada')
      || (this.licenca.status_fiscal === 'autorizada'
        && this.licenca.status_segundo_fiscal === 'autorizada')) {
      if (this.licenca.estabelecimento != null) {
        this.pdfService.downloadFile(this.licenca.estabelecimento.toString()).subscribe(response => {
          const file = new Blob([response], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          this.loadingPdf = true;
          window.open(fileURL);
        }, (async (err) => {
          const file = new Blob([err.error], { type: 'application/json' });
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onloadend = () => {
            this.loadingPdf = true;
            const errorMsg = reader.result.toString().replace(/"|"/gi, '').replace(',', '\n');
            swal.fire({
              icon: 'error',
              title: 'Estabelecimento Não Licenciado',
              text: errorMsg,
              showConfirmButton: false,
              timer: 2000
            });

          };
        }));
      }
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Licença com Autorizações Pendente',
        showConfirmButton: false,
        timer: 2000
      });
      this.loadingPdf = true;
    }

  }
  pegaId () {
    this.route.queryParams.subscribe(
      queryParams => {
        this.idLicenca = queryParams.id;
        if (this.idLicenca != null) {
          window.scrollTo(0, 0);
          this.licencaService.ListarLicencaPorID(this.idLicenca).subscribe((licenca) => {
            this.licenca = licenca;
            this.idEstabelecimento = this.licenca.estabelecimento;
            this.statusLi = true;
            this.pegaAnexos();
            this.getDataEstabelecimentos();
          });
        }
      }
    );
  }
  getDataEstabelecimentos () {
    this.estabelecimentoService.listarEstabelecimentoPorID(this.idEstabelecimento).subscribe((arg) => {
      this.dataEstabelecimento = arg;
    });
  }
  pegaAnexos () {
    this.anexoService.listFilesByModel('estabelecimento', this.idEstabelecimento).subscribe((arg) => {
      if (arg.length > 0) {
        this.titulo = 'Anexos da Licença';
        this.arquivo = arg.filter((item) => {
          return (
            String(item.descricao).indexOf('Pedido:' + this.licenca.id) > -1
          );
        });
      }
    });
  }
  verAnexo (item: Arquivos) {
    this.item = item;
  }
}
