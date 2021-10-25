import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { Arquivos } from '../../../../../models/arquivos';
import { Protocolo } from '../../../../../models/protocolo';
import { AnexoService } from '../../../../services/anexo.service';
import { ProtocoloService } from '../../../../services/protocolo.service';

@Component({
  selector: 'app-cadastro-protocolo',
  templateUrl: './cadastro-protocolo.component.html',
  styleUrls: ['./cadastro-protocolo.component.css']
})
export class CadastroProtocoloComponent implements OnInit {
  protocoloForm: FormGroup;
  protocolo: Protocolo; prot: Protocolo;
  titulo = 'Cadastrar Protocolo';
  public idupdate: number; item: Arquivos; itemCarregado = {} as Arquivos;
  base64textString = []; descricao = []; arq = []; nomeArquivo = [];
  arquivos: Arquivos = {} as Arquivos; listaArq: Arquivos[] = [];
  anexo: Arquivos; indice;
  loading: boolean[] = []; loadingRemove: boolean[] = []; loadingNumvem = true; loadingCadastro = true;
  status = 'abrir'; index; textContato = '';

  contatomask = (rawValue) => {
    const numbers = rawValue.match(/\d/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    if (numberLength <= 10) {
      return ['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
    } else {
      return ['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
    }
  }

  constructor (private protocoloservice: ProtocoloService, private route: ActivatedRoute,
    private anexoService: AnexoService, private router: Router) { }

  ngOnInit () {
    this.createForm(new Protocolo());
    this.pegaId();
  }

  createForm (protocolo: Protocolo) {
    this.protocoloForm = new FormGroup({
      id: new FormControl(protocolo.id),
      requerido: new FormControl(protocolo.requerido),
      data: new FormControl(protocolo.data),
      hora: new FormControl(protocolo.hora),
      descricao: new FormControl(protocolo.descricao),
      requerente: new FormControl(protocolo.requerente),
      endereco: new FormControl(protocolo.endereco),
      contato: new FormControl(protocolo.contato)
    });
  }
  salvar () {
    this.loadingCadastro = false;
    this.protocoloservice.cadastrarProtocolo(this.protocoloForm.value).subscribe((data: Protocolo) => {
      this.loadingCadastro = true;
      window.scrollTo(0, 0);
      swal.fire({
        icon: 'success',
        title: 'Protocolo cadastrado com sucesso',
        showConfirmButton: false,
        timer: 2000
      });
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: data.id
        }
      };
      setTimeout(() => {
        this.router.navigate(['/Protocolo/'], navigationExtras);
      }, 3000);
    }, (error) => {
      this.loadingCadastro = true;
      window.scrollTo(0, 0);
      swal.fire({
        icon: 'warning',
        title: 'Falha ao cadastrar protocolo',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }

  atualizar () {
    this.loadingCadastro = false;
    this.protocoloservice.atualizarProtocolo(this.protocoloForm.value, this.idupdate).subscribe(() => {
      this.loadingCadastro = true;
      window.scrollTo(0, 0);
      swal.fire({
        icon: 'success',
        title: 'Protocolo atualizado com sucesso',
        showConfirmButton: false,
        timer: 2000
      });
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: this.idupdate
        }
      };
      setTimeout(() => {
        this.router.navigate(['/Protocolo/'], navigationExtras);
      }, 3000);
    }, (error) => {
      this.loadingCadastro = true;
      window.scrollTo(0, 0);
      swal.fire({
        icon: 'warning',
        title: 'Falha na atualização do protocolo',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }
  pegaId () {
    this.route.queryParams.subscribe(
      queryParams => {
        this.idupdate = queryParams.id;
        if (this.idupdate != null) {
          this.titulo = 'Atualizar Protocolo';
          window.scrollTo(0, 0);
          this.protocoloservice.ListarTodosProtocolosPorID(this.idupdate).subscribe((proto) => {
            this.protocolo = proto;
            this.createForm(this.protocolo);
          });
        } else {
          this.titulo = 'Cadastrar Protocolo';
          window.scrollTo(0, 0);
          this.createForm(new Protocolo());
        }
      }
    );
  }

  dados (item, i) {
    this.anexo = item;
    this.indice = i;
  }
  ListaArq () {
    this.loadingNumvem = false;
    if (this.status === 'abrir') {
      this.status = 'fechar';
      this.anexoService.listFilesByModel('protocolo', this.idupdate).subscribe((arq: Arquivos[]) => {
        this.listaArq = arq;
        this.loadingNumvem = true;
        for (let i = 0; i < this.listaArq.length; i++) {
          this.loadingRemove[i] = true;
        }
      });
    } else {
      this.loadingNumvem = true;
      this.status = 'abrir';
      this.listaArq.splice(0);
    }
  }

  onUploadChange (evt) {
    const files = evt.target.files;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = ((theFile) => {
        return (e) => {
          this.arq.push(escape(theFile.type));
          this.nomeArquivo.push(theFile.stream.name);
          let url = e.target.result;
          const index = Number(url.toLowerCase().indexOf(',') + 1);
          url = url.slice(index);
          this.base64textString.push(url);
          this.inicializaLoding();
        };
      })
        (file);
      reader.readAsDataURL(file);
    });
  }
  inicializaLoding () {
    for (let i = 0; i < this.base64textString.length; i++) {
      this.loading[i] = true;
    }
  }
  removeTudoDaLista (i) {
    this.base64textString.splice(i, 1); this.arq.splice(i, 1); this.nomeArquivo.splice(i, 1);
    this.loading.splice(i, 1); this.descricao.splice(i, 1);
  }
  removerDaLista (i) {
    this.base64textString.splice(i, 1); this.arq.splice(i, 1); this.nomeArquivo.splice(i, 1);
    this.loading.splice(i, 1); this.descricao.splice(i, 1);
  }
  formatType (doc) {
    if (doc === 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'docx';
    } else if (doc === 'pdf') {
      return 'pdf';
    } else {
      return '';
    }
  }
  enviar (src, i) {
    if (this.protocoloForm.value.id != null) {
      this.arquivos.descricao = this.nomeArquivo[i];
      this.arquivos.descricao_completa = this.descricao[i];
      this.arquivos.id_protocolo = this.protocoloForm.value.id;
      this.arquivos.type = this.formatType(this.arq[i].slice(String(this.arq[i]).indexOf('/') + 1));
      console.log(this.arquivos.type);
      this.arquivos.path = src;
      this.loading[i] = false;
      this.anexoService.salvarAnexo(this.arquivos).subscribe((data: Arquivos) => {
        this.loading[i] = true;
        this.removerDaLista(i);
      }, (error) => {
        console.log(error);
        swal.fire({
          icon: 'warning',
          title: 'Falha na Criação do Anexo',
          showConfirmButton: false,
          timer: 2000
        });
      });
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Cadastre um protocolo, ou atualize um existente',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  enviarTodos () {
    if (this.protocoloForm.value.id != null) {
      for (let i = 0; i < this.base64textString.length; i++) {
        this.loading[i] = false;
        this.arquivos.descricao = this.nomeArquivo[i];
        this.arquivos.path = this.base64textString[i];
        this.arquivos.descricao_completa = this.descricao[i];
        this.arquivos.id_protocolo = this.protocoloForm.value.id;
        this.arquivos.type = this.formatType(this.arq[i].slice(String(this.arq[i]).indexOf('/') + 1));
        this.anexoService.salvarAnexo(this.arquivos).subscribe((data: Arquivos) => {
          this.removeTudoDaLista(this.index);
          this.loading[i] = true;
          // alert('Anexo  ' + data.descricao_completa + ' Cadastrado com Sucesso');
        }, (error) => {
          this.index += 1;
          swal.fire({
            icon: 'warning',
            title: 'Falha na Criação do Anexo',
            showConfirmButton: false,
            timer: 2000
          });
        });
      }
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Cadastre um protocolo, ou atualize um existente',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  apagarArquivo () {
    this.loadingRemove[this.indice] = false;
    this.anexoService.deleteFileByKey(this.anexo.key).subscribe(
      () => {
        for (let i = 0; i <= this.listaArq.length; i++) {
          if (this.listaArq[i].key === this.anexo.key) {
            this.listaArq.splice(i, 1);
            this.loadingRemove.splice(i, 1);
          }
        }
        this.loadingRemove[this.indice] = true;
      },
      error => {
        this.loadingRemove[this.indice] = true;

        return swal.fire({
          icon: 'warning',
          title: 'Falha ao remover Anexo',
          showConfirmButton: false,
          timer: 2000
        });
      }
    );
  }

  verAnexoCarregado (i) {
    this.itemCarregado.descricao = this.nomeArquivo[i];
    this.itemCarregado.url_location = 'data:image/png;base64,' + this.base64textString[i];
    this.itemCarregado.descricao_completa = this.descricao[i];
    this.item = this.itemCarregado;
  }
  verAnexo (item) {
    this.item = item;
  }

}
