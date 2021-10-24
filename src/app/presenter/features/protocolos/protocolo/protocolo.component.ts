import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProtocoloService } from '../../../../service/protocolo.service';
import { PdfService } from '../../../../service/pdf.service';
import { Protocolo } from '../../../../../models/protocolo';
import { Arquivos } from '../../../../../models/arquivos';
import { AnexoService } from '../../../../service/anexo.service';
import * as $ from 'jquery';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Email } from '../../../../../models/email';
import { EmailService } from '../../../../service/email.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-protocolo',
  templateUrl: './protocolo.component.html',
  styleUrls: ['./protocolo.component.css']
})
export class ProtocoloComponent implements OnInit {
  emailForm: FormGroup; email: Email;
  public idprotocolo;
  @Input() pdf; statusProt = false; loadingTable = false;
  @Input() protocolos: Protocolo = {} as Protocolo;
  arquivo: Arquivos[] = [];
  base64textString: string[] = [];
  titulo = 'Sem anexos cadastrado';
  item: Arquivos;
  loading = true;

  constructor (private route: ActivatedRoute, private protocoloService: ProtocoloService,
    private pdfservice: PdfService, private anexoService: AnexoService,
    private emailservice: EmailService) { }

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
        this.idprotocolo = queryParams.id;
        if (this.idprotocolo != null)
        {
          window.scrollTo(0, 0);
          this.protocoloService.ListarTodosProtocolosPorID(this.idprotocolo).subscribe((protocolo) => {
            this.protocolos = protocolo;
            this.statusProt = true;
          }, () => {
          });
        }
      }
    );

    this.anexoService.listFilesByModel('protocolo', this.idprotocolo).subscribe((arq: Arquivos[]) => {
      this.arquivo = arq;
      if (this.arquivo.length > 0)
      {
        this.titulo = 'Anexos do Protocolo';
      }
    }, () => {
    });
  }

  protocoloPdf () {
    this.loading = false;
    if (this.idprotocolo != null)
    {
      this.pdfservice.downloadFileProtocolo(this.idprotocolo).subscribe(response => {
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
    if (item.type === 'pdf' || item.type === 'docx')
    {
      window.open(item.url_location);
    }
  }

  EnviarEmail () {
    this.email = this.emailForm.value;
    if (this.emailForm.valid === false)
    {
      swal.fire({
        icon: 'warning',
        title: 'Campo destinatário é obrigatório',
        showConfirmButton: false,
        timer: 2000
      });
    } else
    {
      return new Promise((resolve, reject) => {
        const dataSend = {
          id: Number(this.idprotocolo),
          email: this.email.destinatario,
          texthtml: this.email.mensagem
        };
        this.emailservice.sendProtocoloByEmail(dataSend).subscribe((data) => {
          resolve(data);
          $('.modal-header .close').click();
          window.scrollTo(0, 0);
          if (data !== null && data['code'] === 'EENVELOPE')
          {
            swal.fire({
              icon: 'warning',
              title: 'Erro ao  enviar protocolo',
              showConfirmButton: false,
              timer: 4000
            });
          } else
          {
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
