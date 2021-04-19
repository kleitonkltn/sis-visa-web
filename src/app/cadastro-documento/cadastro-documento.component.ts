import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router'
import * as $ from 'jquery'
import { Documentos } from '../../models/documento'
import { DocumentoService } from '../service/documento.service'
import swal from 'sweetalert2'


@Component({
  selector: 'app-cadastro-documento',
  templateUrl: './cadastro-documento.component.html',
  styleUrls: ['./cadastro-documento.component.css']
})
export class CadastroDocumentoComponent implements OnInit {
  titulo = 'Cadastrar Documento';
  documentoForm: FormGroup
  public idupdate: number
  submitted
  loading: boolean[] = []; loadingCadastro = true;
  formSubmitted = false;



  constructor (private route: ActivatedRoute, private documentoservice: DocumentoService, private router: Router) {
  }
  ngOnInit () {
    this.createForm(new Documentos())
    this.pegaId()
  }


  createForm (documento: Documentos) {
    this.documentoForm = new FormGroup({
      id: new FormControl(documento.id),
      descricao_completa: new FormControl(documento.descricao_completa, Validators.required),
      descricao: new FormControl(documento.descricao, Validators.required)
    })
  }
  salvar () {
    this.loadingCadastro = false
    if (this.documentoForm.valid === false) {
      window.scrollTo(0, 0)
      swal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos obrigatórios',
        showConfirmButton: false,
        timer: 2000
      })
      this.formSubmitted = true
      this.loadingCadastro = true
    } else {
      this.documentoservice.createDocumentos(this.documentoForm.value).toPromise().then((data: Documentos) => {
        this.loadingCadastro = true
        window.scrollTo(0, 0)
        swal.fire({
          icon: 'success',
          title: 'Documento cadastrado com sucesso',
          showConfirmButton: false,
          timer: 2000
        })
        setTimeout(() => {
          this.router.navigate(['/ListaDocumento/'])
        }, 3000)
      }, (error) => {
        window.scrollTo(0, 0)
        this.loadingCadastro = true
        swal.fire({
          icon: 'warning',
          title: 'Falha na criação do document',
          showConfirmButton: false,
          timer: 2000
        })
      })
    }
  }
  atualizar () {
    this.loadingCadastro = false
    if (this.documentoForm.valid === false) {
      window.scrollTo(0, 0)
      swal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos obrigatórios',
        showConfirmButton: false,
        timer: 2000
      })
      this.formSubmitted = true
      this.loadingCadastro = true
    } else {
      this.documentoservice.updateDocumentos(this.documentoForm.value).toPromise().then(() => {
        this.loadingCadastro = true
        window.scrollTo(0, 0)
        swal.fire({
          icon: 'success',
          title: 'Documento atualizado com sucesso',
          showConfirmButton: false,
          timer: 2000
        })
        setTimeout(() => {
          this.router.navigate(['/ListaDocumento/'])
        }, 3000)
      }, (error) => {
        window.scrollTo(0, 0)
        this.loadingCadastro = true
        swal.fire({
          icon: 'warning',
          title: 'Preencha todos os campos obrigatórios',
          showConfirmButton: false,
          timer: 2000
        })
        swal.fire({
          icon: 'warning',
          title: 'Falha na atualização da documento',
          showConfirmButton: false,
          timer: 2000
        })
      })
    }
  }

  pegaId () {
    this.route.queryParams.toPromise().then(
      queryParams => {
        this.idupdate = queryParams.id
        if (this.idupdate != null) {
          window.scrollTo(0, 0)
          this.titulo = 'Atualizar Documento'
          this.documentoservice.listDocumentosById(this.idupdate).toPromise().then((documento: Documentos) => {
            this.createForm(documento)
          }, () => {
          })
        } else {
          window.scrollTo(0, 0)
          this.titulo = 'Cadastrar Documento'
          this.createForm(new Documentos())
        }
      }
    )
  }

}
