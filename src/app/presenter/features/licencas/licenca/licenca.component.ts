import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import * as moment from 'moment'
import { Usuario } from 'src/models/usuario'
import swal from 'sweetalert2'
import { Arquivos } from '../../../../../models/arquivos'
import Licencas from '../../../../../models/licencas'
import { AnexoService } from '../../../../services/anexo.service'
import { AutenticarService } from '../../../../services/autenticar.service'
import { EstabelecimentoService } from '../../../../services/estabelecimento.service'
import { LicencaService } from '../../../../services/licenca.service'
import { PdfService } from '../../../../services/pdf.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-licenca',
  templateUrl: './licenca.component.html',
  styleUrls: ['./licenca.component.css']
})
export class LicencaComponent implements OnInit {

  public idLicenca
  @Input() pdf; statusLi = false; loadingTable = false;
  @Input() licenca: Licencas = {} as Licencas;
  currentUser: Usuario
  arquivo: Arquivos[] = [];
  base64textString: string[] = [];
  titulo = 'Sem anexos cadastrado';
  item: Arquivos
  loadingPdf = true;
  loading = true;
  hasSigned = false;
  isAfterNewSignatureMode = false;
  idEstabelecimento
  dataEstabelecimento

  constructor(private route: ActivatedRoute, private licencaService: LicencaService,
    private anexoService: AnexoService, private pdfService: PdfService, private authService: AutenticarService,
    private estabelecimentoService: EstabelecimentoService) { }

  ngOnInit() {
    this.currentUser = this.authService._user['params']
    this.loadDataById()
  }
  licencaPdf() {
    this.loadingPdf = false
    if ((this.licenca.assinaturas_data.length >= 2 &&
      this.licenca.assinaturas_data.filter((e) => e.responsavel_data.nivel_acesso === 'gerente'
        || e.responsavel_data.nivel_acesso === 'fiscal').length >= 2)
      || (this.licenca.status_fiscal === 'autorizada' && this.licenca.status_gerente === 'autorizada')
      || (this.licenca.status_fiscal === 'autorizada' && this.licenca.status_segundo_fiscal === 'autorizada')) {
      if (this.licenca.estabelecimento != null) {
        this.pdfService.downloadFile(this.licenca.estabelecimento.toString()).subscribe(response => {
          const file = new Blob([response], { type: 'application/pdf' })
          const fileURL = URL.createObjectURL(file)
          this.loadingPdf = true
          window.open(fileURL)
        }, (async (err) => {
          const file = new Blob([err.error], { type: 'application/json' })
          const reader = new FileReader()
          reader.readAsText(file)
          reader.onloadend = () => {
            this.loadingPdf = true
            const errorMsg = reader.result.toString().replace(/"|"/gi, '').replace(',', '\n')
            swal.fire({
              icon: 'error',
              title: 'Estabelecimento Não Licenciado',
              text: errorMsg,
              showConfirmButton: false,
              timer: 2000
            })

          }
        }))
      }
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Licença com Autorizações Pendente',
        showConfirmButton: false,
        timer: 2000
      })
      this.loadingPdf = true
    }

  }
  loadDataById() {
    this.route.queryParams.subscribe(
      queryParams => {
        this.idLicenca = queryParams.id
        if (this.idLicenca != null) {
          window.scrollTo(0, 0)
          this.licencaService.ListarLicencaPorID(this.idLicenca).subscribe((licenca) => {
            this.licenca = licenca
            this.idEstabelecimento = this.licenca.estabelecimento
            this.statusLi = true
            this.hasSigned = (licenca.assinaturas_data.findIndex((item) => item.responsavel === this.currentUser.matricula) > -1)
            this.isAfterNewSignatureMode = moment(licenca.data_emissao).isAfter(moment('2023-04-23'))
            this.getAnexos()
            this.getDataEstabelecimentos()
          })
        }
      }
    )
  }
  getDataEstabelecimentos() {
    this.estabelecimentoService.listarEstabelecimentoPorID(this.idEstabelecimento).subscribe((arg) => {
      this.dataEstabelecimento = arg
    })
  }
  getAnexos() {
    this.anexoService.listFilesByModel('estabelecimento', this.idEstabelecimento).subscribe((arg) => {
      if (arg.length > 0) {
        this.titulo = 'Anexos da Licença'
        this.arquivo = arg.filter((item) => {
          return (
            String(item.descricao).indexOf('Pedido:' + this.licenca.id) > -1
          )
        })
      }
    })
  }
  verAnexo(item: Arquivos) {
    this.item = item
  }
  assinarLicenca() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-warning'

      },
      buttonsStyling: true,
    });
    swalWithBootstrapButtons.fire(
      {
        showCloseButton: true,
        title: 'Confirmar Assinatura',
        text: 'Deseja prosseguir com a assinatura desta Licença?',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: true
      }
    ).then((result) => {
      if (result.value) {
        this.licencaService.assinarLicenca(this.licenca).subscribe((data) => {
          this.loadDataById()
          swal.fire({
            icon: 'success',
            title: 'Licença assinada com sucesso',
            showConfirmButton: false,
            timer: 2000
          })
        }, (err) => {
          console.log(err);
          swal.fire({
            icon: 'error',
            title: 'Falha ao assinar licença',
            text: err.error.msg || '',
            showConfirmButton: false,
            timer: 2000
          })
        })
      }
    });

  }
}
