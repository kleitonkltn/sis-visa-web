import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import * as $ from 'jquery'
import swal from 'sweetalert2'
import { Atividades } from '../../../../../models/atividade'
import { AtividadeService } from '../../../../services/atividade.service'

@Component({
  selector: 'app-cadastro-atividade',
  templateUrl: './cadastro-atividade.component.html',
  styleUrls: ['./cadastro-atividade.component.css']
})
export class CadastroAtividadeComponent implements OnInit {
  titulo = 'Cadastrar Atividade';
  atividadeForm: FormGroup
  public currentIdUpdate: number
  submitted
  loading: boolean[] = []; loadingCadastro = true;
  formSubmitted = false;

  constructor (private route: ActivatedRoute, private atividadeService: AtividadeService, private router: Router) {
  }
  ngOnInit () {
    this.createForm(new Atividades())
    this.pegaId()
  }

  createForm (atividades: Atividades) {
    this.atividadeForm = new FormGroup({
      id: new FormControl(atividades.id),
      atividade: new FormControl(atividades.atividade, Validators.required),
      descricao: new FormControl(atividades.descricao, Validators.required)
    })
  }
  salvar () {
    this.loadingCadastro = false
    if (this.atividadeForm.valid === false) {
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
      this.atividadeService.createAtividade(this.atividadeForm.value).subscribe((data: Atividades) => {
        this.loadingCadastro = true
        window.scrollTo(0, 0)
        swal.fire({
          icon: 'success',
          title: 'Atividade cadastrada com sucesso',
          showConfirmButton: false,
          timer: 2000
        })
        setTimeout(() => {
          this.router.navigate(['/lista-atividade/'])
        }, 3000)
      }, (error) => {
        window.scrollTo(0, 0)
        this.loadingCadastro = true
        swal.fire({
          icon: 'warning',
          title: 'Falha na criação da Atividade',
          showConfirmButton: false,
          timer: 2000
        })
      })
    }
  }
  atualizar () {
    this.loadingCadastro = false
    if (this.atividadeForm.valid === false) {
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
      this.atividadeService.updateAtividade(this.atividadeForm.value).subscribe(() => {
        this.loadingCadastro = true
        window.scrollTo(0, 0)
        swal.fire({
          icon: 'success',
          title: 'Atividade atualizada com sucesso',
          showConfirmButton: false,
          timer: 2000
        })
        setTimeout(() => {
          this.router.navigate(['/lista-atividade/'])
        }, 3000)
      }, (error) => {
        window.scrollTo(0, 0)
        this.loadingCadastro = true
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
    this.route.queryParams.subscribe(
      queryParams => {
        this.currentIdUpdate = queryParams.id
        if (this.currentIdUpdate != null) {
          window.scrollTo(0, 0)
          this.titulo = 'Atualizar Atividade'
          this.atividadeService.listAtividadeById(this.currentIdUpdate).subscribe((documento: Atividades) => {
            this.createForm(documento)
          })
        } else {
          window.scrollTo(0, 0)
          this.titulo = 'Cadastrar Atividade'
          this.createForm(new Atividades())
        }
      }
    )
  }
}
