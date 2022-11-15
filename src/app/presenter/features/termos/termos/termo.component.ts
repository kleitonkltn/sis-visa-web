import { Component, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Arquivos } from '../../../../../models/arquivos'
import { Email } from '../../../../../models/email'
import { Termos } from '../../../../../models/termos'
// import * as $ from 'jquery';
import { AnexoService } from '../../../../services/anexo.service'
import { EmailService } from '../../../../services/email.service'
import { TermoService } from '../../../../services/termo.service'
declare let $: any
import swal from 'sweetalert2'
import { PdfService } from '../../../../services/pdf.service'

@Component({
  selector: 'app-termo',
  templateUrl: './termo.component.html',
  styleUrls: ['./termo.component.css']
})
export class TermosComponent implements OnInit {
  public currentIdUpdate: number
  @Input() pdf: any
  @Input() Atividade: any
  @Input() CNAE: any
  emailForm!: FormGroup
  termos: Termos = {} as Termos;
  statusTer = false;
  loadingTable = false;
  loading = true;
  email!: Email
  destinatario: Email = {
    destinatario: '',
    mensagem: ''
  };
  arquivo: Arquivos[] = [];
  base64textString: string[] = [];
  titulo = 'Sem Anexos Cadastrado';
  item: Arquivos
  licencaValueMax: any

  constructor (private route: ActivatedRoute, private termosService: TermoService,
    private pdfService: PdfService,
    private anexoService: AnexoService,
    private emailService: EmailService,
  ) { }

  ngOnInit () {
    this.createForm(new Email())
    this.pegaId()
  }

  createForm (email: Email) {
    this.emailForm = new FormGroup({
      destinatario: new FormControl(email.destinatario, Validators.required),
      mensagem: new FormControl(email.mensagem)
    })
  }

  async pegaId () {
    this.route.queryParams.subscribe((data) => {
      this.currentIdUpdate = data['id']
      if (this.currentIdUpdate != null) {
        window.scrollTo(0, 0)
        this.termosService.ListarTermoPorID(this.currentIdUpdate).subscribe((termos) => {
          console.log(termos)
          this.termos = termos
          this.statusTer = true
        }).add(() => {
          this.anexoService.listFilesByModel('termo', this.currentIdUpdate.toString()).subscribe((arq: Arquivos[]) => {
            this.arquivo = arq
            if (this.arquivo.length > 0) {
              this.titulo = 'Anexos do Termo'
            }
          })
        })
      }
    })

  }
  verAnexo (item: Arquivos) {
    this.item = item
    if (item.type === 'pdf' || item.type === 'docx') {
      window.open(item.url_location)
    }
  }
  get f () { return this.termos }

  validateEmail () {
    if (this.termos.email) {
      this.destinatario.destinatario = this.termos.email
      this.createForm(this.destinatario)
    }
  }
  termoPDF () {
    this.loading = false
    if (this.currentIdUpdate != null) {
      this.pdfService.downloadFileTermo(this.currentIdUpdate.toString()).subscribe(response => {
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
          console.log(errorMsg)
          swal.fire({
            icon: 'error',
            title: 'Falha ao gerar termo' + errorMsg,
            showConfirmButton: false,
            timer: 2000
          })
        }

      }))
    }
  }
  sendEmail () {
    this.email = this.emailForm.value
    if (this.emailForm.valid === false) {
      swal.fire({
        icon: 'warning',
        title: 'Campo destinatário é obrigatório',
        showConfirmButton: false,
        timer: 2000
      })
    } else {
      new Promise((resolve, reject) => {
        const dataSend = {
          id: Number(this.currentIdUpdate),
          email: this.email.destinatario,
          texthtml: this.email.mensagem
        }
        this.emailService.sendTermoByEmail(dataSend).subscribe((data: any) => {
          resolve(data)
          $('.modal-header .close').click()
          window.scrollTo(0, 0)
          if (data !== null && data['code'] === 'EENVELOPE') {
            swal.fire({
              icon: 'warning',
              title: 'Erro ao  enviar termo',
              showConfirmButton: false,
              timer: 4000
            })
          } else {
            swal.fire({
              icon: 'success',
              title: 'Termo enviado com Sucesso',
              showConfirmButton: false,
              timer: 4000
            })
          }
        }, (err) => {
          window.scrollTo(0, 0)
          $('.modal-header .close').click()
          swal.fire({
            icon: 'warning',
            title: 'Erro ao  enviar termo',
            showConfirmButton: false,
            timer: 4000
          })
          reject(err)
        })

      })
    }
  }
}
