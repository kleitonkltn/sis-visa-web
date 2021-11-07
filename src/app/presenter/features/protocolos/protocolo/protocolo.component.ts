import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { Arquivos } from '../../../../../models/arquivos';
import { Email } from '../../../../../models/email';
import { Protocolo } from '../../../../../models/protocolo';
import { AnexoService } from '../../../../services/anexo.service';
import { EmailService } from '../../../../services/email.service';
import { PdfService } from '../../../../services/pdf.service';
import { ProtocoloService } from '../../../../services/protocolo.service';

@Component({
  selector: 'app-protocolo',
  templateUrl: './protocolo.component.html',
  styleUrls: ['./protocolo.component.css']
})
export class ProtocoloComponent implements OnInit {
  emailForm: FormGroup; email: Email;
  public idProtocolo;
  @Input() pdf;
  statusProt = false;
  loadingTable = false;
  @Input() protocolos: Protocolo = {} as Protocolo;
  arquivo: Arquivos[] = [];
  base64textString: string[] = [];
  titulo = 'Sem anexos cadastrado';
  item: Arquivos;
  loading = true;

  constructor (private route: ActivatedRoute, private protocoloService: ProtocoloService,
    private pdfService: PdfService, private anexoService: AnexoService,
    private emailService: EmailService) { }

  ngOnInit () {
    this.createForm(new Email());
    this.pegaId();
  }
  createForm (email: Email) {
    this.emailForm = new FormGroup({
      destinatario: new FormControl(email.destinatario, Validators.required),
      mensagem: new FormControl(email.mensagem)
    });
  }
  pegaId () {
    this.route.queryParams.subscribe(
      queryParams => {
        this.idProtocolo = queryParams.id;
        if (this.idProtocolo != null) {
          window.scrollTo(0, 0);
          this.protocoloService.ListarTodosProtocolosPorID(this.idProtocolo).subscribe((protocolo) => {
            this.protocolos = protocolo;
            this.statusProt = true;
          });
        }
      }
    );

    this.anexoService.listFilesByModel('protocolo', this.idProtocolo).subscribe((arq: Arquivos[]) => {
      this.arquivo = arq;
      if (this.arquivo.length > 0) {
        this.titulo = 'Anexos do Protocolo';
      }
    });
  }

  protocoloPdf () {
    this.loading = false;
    if (this.idProtocolo != null) {
      this.pdfService.downloadFileProtocolo(this.idProtocolo).subscribe(response => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.loading = true;
        window.open(fileURL);
      }, (async (err) => {
        const file = new Blob([err.error], { type: 'application/text' });
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = () => {
          this.loading = true;
          const errorMsg = reader.result.toString().replace(/"|"/gi, '').replace(',', '\n');
          alert('Erro ao gerar Protocolo\n' + errorMsg);
        };
      }));
    }
  }
  verAnexo (item) {
    this.item = item;
    if (item.type === 'pdf' || item.type === 'docx') {
      window.open(item.url_location);
    }
  }

  didTapSendEmail () {
    this.email = this.emailForm.value;
    if (this.emailForm.valid === false) {
      swal.fire({
        icon: 'warning',
        title: 'Campo destinatário é obrigatório',
        showConfirmButton: false,
        timer: 2000
      });
    } else {
      return new Promise((resolve, reject) => {
        const dataSend = {
          id: Number(this.idProtocolo),
          email: this.email.destinatario,
          texthtml: this.email.mensagem
        };
        this.emailService.sendProtocoloByEmail(dataSend).subscribe((data) => {
          resolve(data);
          $('.modal-header .close').click();
          window.scrollTo(0, 0);
          if (data !== null && data['code'] === 'EENVELOPE') {
            swal.fire({
              icon: 'warning',
              title: 'Erro ao  enviar protocolo',
              showConfirmButton: false,
              timer: 4000
            });
          } else {
            swal.fire({
              icon: 'success',
              title: 'Protocolo enviado com Sucesso',
              showConfirmButton: false,
              timer: 4000
            });
          }
        }, (err) => {
          window.scrollTo(0, 0);
          $('.modal-header .close').click();
          swal.fire({
            icon: 'warning',
            title: 'Erro ao  enviar protocolo',
            showConfirmButton: false,
            timer: 4000
          });
          reject(err);
        });
      });
    }
  }

}
