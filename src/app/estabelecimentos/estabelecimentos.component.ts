import { Component, Input, OnInit } from '@angular/core'
import { Estabelecimento } from '../../models/estabelecimento'
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router'
import { EstabelecimentoService } from '../service/estabelecimento.service'
import { PdfService } from '../service/pdf.service'
import { Arquivos } from '../../models/arquivos'
import { AnexoService } from '../service/anexo.service'
import * as $ from 'jquery'
import { AutenticarService } from '../service/autenticar.service'
import { Usuario } from '../../models/usuario'
import { EmailService } from '../service/email.service'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Email } from '../../models/email'
import swal from 'sweetalert2'

@Component({
  selector: 'app-estabelecimentos',
  templateUrl: './estabelecimentos.component.html',
  styleUrls: ['./estabelecimentos.component.css']
})

export class EstabelecimentosComponent implements OnInit {
  emailForm: FormGroup
  estabelecimentos: Estabelecimento = {} as Estabelecimento;
  public idupdate: number; usuario: Usuario; user
  @Input() pdf; @Input() Atividade; @Input() CNAE
  loading = true; statusEst = false; loadingTable = false; loadingEmail = true;
  arquivo: Arquivos[] = []; base64textString: string[] = [];
  titulo = 'Sem Anexos Cadastrado'; formSubmitted = false;
  item: Arquivos; licencaValueMax
  mensagem; email: Email; destinario = {} as Email;

  constructor (private route: ActivatedRoute, private estabelecimentoservice: EstabelecimentoService,
    private pdfservice: PdfService, private anexoService: AnexoService,
    private router: Router, private authService: AutenticarService,
    private emailservice: EmailService) {
    this.usuario = this.authService._user['params']
  }
  ngOnInit () {
    this.pegaId()
    this.createForm(new Email())
  }


  toggleSidebar () {
    document.getElementById('btnprincipal').classList.toggle('active')

  }
  createForm (email: Email) {
    this.emailForm = new FormGroup({
      destinatario: new FormControl(email.destinatario, Validators.required),
      mensagem: new FormControl(email.mensagem)
    })
  }
  pegaId () {
    this.route.queryParams.toPromise().then(
      queryParams => {
        this.idupdate = queryParams.id
        if (this.idupdate != null) {
          window.scrollTo(0, 0)
          this.estabelecimentoservice.listarEstabelecimentoPorID(this.idupdate).toPromise().then((estabelecimentos) => {
            this.estabelecimentos = estabelecimentos
            this.retornaCampos()
            this.statusEst = true
          }, () => {
          })
        }
      }
    )
    this.anexoService.listFilesByModel('estabelecimento', this.idupdate).toPromise().then((arq: Arquivos[]) => {
      this.arquivo = arq
      if (this.arquivo.length > 0) {
        this.titulo = 'Anexos do Estabelecimento'
      }
    }, () => {
    })
  }
  verAnexo (item) {
    this.item = item
    if (item.type === 'pdf' || item.type === 'docx') {
      window.open(item.url_location)
    }
  }
  retornaCampos () {
    this.estabelecimentoservice.ListarAtividadesPorID(this.estabelecimentos.atividade)
      .toPromise().then((atividade) => {
        this.Atividade = atividade
        this.estabelecimentos.atividade = this.Atividade.atividade
      }, () => {
      })
    this.estabelecimentoservice.listarCnaePorID(this.estabelecimentos.cnae)
      .toPromise().then((cnae) => {
        this.CNAE = cnae
        this.estabelecimentos.cnae = this.CNAE.descricao
      }, () => {
      })

    if (Number(this.estabelecimentos.status) < 0) {
      this.estabelecimentos.status = 'Ativo'
    } else if (Number(this.estabelecimentos.status) === 1) {
      this.estabelecimentos.status = 'Documentação Pendente'
    } else {
      this.estabelecimentos.status = 'Inativo'
    }

    if (Number(this.estabelecimentos.pessoa) < 1) {
      this.estabelecimentos.pessoa = 'Pessoa Física'
    } else {
      this.estabelecimentos.pessoa = 'Pessoa Juridica'
    }
  }

  licencaPdf () {
    this.loading = false
    if (this.idupdate != null) {
      this.pdfservice.downloadFile(this.idupdate).toPromise().then(response => {
        const file = new Blob([response], { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(file)
        this.loading = true
        window.open(fileURL)
      }, (async (err) => {
        const file = new Blob([err.error], { type: 'application/json' })
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onloadend = () => {
          this.loading = true
          const errorMsg = reader.result.toString().replace(/"|"/gi, '').replace(',', '\n')
          alert('Estabelecimento Não Licenciado' + errorMsg)
        }

      }))
    }

  }
  get f () { return this.estabelecimentos }
  verificaLicenca () {
    if (this.estabelecimentos.licenca !== null) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id_est: this.estabelecimentos.id
        }
      }
      this.router.navigate(['/Cadastrolicenca/'], navigationExtras)
    } else {
      window.scrollTo(0, 0)
      swal.fire({
        icon: 'warning',
        title: 'Estabelecimento sem número de licença',
        showConfirmButton: false,
        timer: 2000
      })
    }

  }

  verificaUser () {
    if (this.usuario.nivel_acesso === 'gerente' || this.usuario.nivel_acesso === 'fiscal') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id_est: this.estabelecimentos.id
        }
      }
      this.router.navigate(['/CadastroRelatorio/'], navigationExtras)
    } else {
      window.scrollTo(0, 0)
      swal.fire({
        icon: 'warning',
        title: 'Somente usuário Fiscal e Gerente podem gerar relatório',
        showConfirmButton: false,
        timer: 2000
      })
    }

  }
  VerificaEmail () {
    if (this.estabelecimentos.email) {
      this.destinario.destinatario = this.estabelecimentos.email
      this.createForm(this.destinario)
    }
  }
  EnviarEmail () {
    this.loadingEmail = false
    this.email = this.emailForm.value
    if (this.emailForm.valid === false) {
      swal.fire({
        icon: 'warning',
        title: 'Campo destinatário é obrigatório',
        showConfirmButton: false,
        timer: 2000
      })
      this.loadingEmail = true
    } else {
      return new Promise((resolve, reject) => {
        const dataSend = {
          id: Number(this.idupdate),
          email: this.email.destinatario,
          texthtml: this.email.mensagem
        }
        this.emailservice.sendLicencaByEmail(dataSend).toPromise().then((data) => {
          resolve(data)
          $('.modal-header .close').click()
          window.scrollTo(0, 0)
          console.log(data)
          if (data !== null && data['code'] === 'EENVELOPE') {
            this.loadingEmail = true
            swal.fire({
              icon: 'warning',
              title: 'Erro ao  enviar licença',
              showConfirmButton: false,
              timer: 4000
            })
          } else {
            swal.fire({
              icon: 'success',
              title: 'Licença Enviada com Sucesso',
              showConfirmButton: false,
              timer: 4000
            })
            this.loadingEmail = true
          }
        }, (err) => {
          window.scrollTo(0, 0)
          $('.modal-header .close').click()
          this.loadingEmail = true
          swal.fire({
            icon: 'warning',
            title: 'Erro ao  enviar licença',
            showConfirmButton: false,
            timer: 4000
          })
          reject(err)
        })

      })
    }
  }
}
