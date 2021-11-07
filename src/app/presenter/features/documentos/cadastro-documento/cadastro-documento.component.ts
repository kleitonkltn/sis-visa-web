import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { Documentos } from '../../../../../models/documento';
import { DocumentoService } from '../../../../services/documento.service';

@Component({
  selector: 'app-cadastro-documento',
  templateUrl: './cadastro-documento.component.html',
  styleUrls: ['./cadastro-documento.component.css']
})
export class CadastroDocumentoComponent implements OnInit {
  titulo = 'Cadastrar Documento';
  documentoForm: FormGroup;
  public currentIdUpdate: number;
  submitted;
  loading: boolean[] = []; loadingCadastro = true;
  formSubmitted = false;

  constructor (private route: ActivatedRoute, private documentoService: DocumentoService, private router: Router) {
  }
  ngOnInit () {
    this.createForm(new Documentos());
    this.pegaId();
  }

  createForm (documento: Documentos) {
    this.documentoForm = new FormGroup({
      id: new FormControl(documento.id),
      descricao_completa: new FormControl(documento.descricao_completa, Validators.required),
      descricao: new FormControl(documento.descricao, Validators.required)
    });
  }
  salvar () {
    this.loadingCadastro = false;
    if (this.documentoForm.valid === false) {
      window.scrollTo(0, 0);
      swal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos obrigatórios',
        showConfirmButton: false,
        timer: 2000
      });
      this.formSubmitted = true;
      this.loadingCadastro = true;
    } else {
      this.documentoService.createDocumentos(this.documentoForm.value).subscribe((data: Documentos) => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'success',
          title: 'Documento cadastrado com sucesso',
          showConfirmButton: false,
          timer: 2000
        });
        setTimeout(() => {
          this.router.navigate(['/ListaDocumento/']);
        }, 3000);
      }, (error) => {
        window.scrollTo(0, 0);
        this.loadingCadastro = true;
        swal.fire({
          icon: 'warning',
          title: 'Falha na criação do document',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }
  atualizar () {
    this.loadingCadastro = false;
    if (this.documentoForm.valid === false) {
      window.scrollTo(0, 0);
      swal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos obrigatórios',
        showConfirmButton: false,
        timer: 2000
      });
      this.formSubmitted = true;
      this.loadingCadastro = true;
    } else {
      this.documentoService.updateDocumentos(this.documentoForm.value).subscribe(() => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'success',
          title: 'Documento atualizado com sucesso',
          showConfirmButton: false,
          timer: 2000
        });
        setTimeout(() => {
          this.router.navigate(['/ListaDocumento/']);
        }, 3000);
      }, (error) => {
        window.scrollTo(0, 0);
        this.loadingCadastro = true;
        swal.fire({
          icon: 'warning',
          title: 'Preencha todos os campos obrigatórios',
          showConfirmButton: false,
          timer: 2000
        });
        swal.fire({
          icon: 'warning',
          title: 'Falha na atualização da documento',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }

  pegaId () {
    this.route.queryParams.subscribe(
      queryParams => {
        this.currentIdUpdate = queryParams.id;
        if (this.currentIdUpdate != null) {
          window.scrollTo(0, 0);
          this.titulo = 'Atualizar Documento';
          this.documentoService.listDocumentosById(this.currentIdUpdate.toString()).subscribe((documento: Documentos) => {
            this.createForm(documento);
          });
        } else {
          window.scrollTo(0, 0);
          this.titulo = 'Cadastrar Documento';
          this.createForm(new Documentos());
        }
      }
    );
  }

}
