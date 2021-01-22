import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmbasamentoService } from '../service/embasamento.service';
import * as $ from 'jquery';
import { Embasamentos } from '../Embasamentos';
import swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-embasamento',
  templateUrl: './cadastro-embasamento.component.html',
  styleUrls: ['./cadastro-embasamento.component.css']
})

export class CadastroEmbasamentoComponent implements OnInit {
  titulo = 'Cadastrar Embasamento';
  embasamentoForm: FormGroup;
  public idupdate: number;
  submitted;
  loading: boolean[] = []; loadingCadastro = true;
  formSubmitted = false;



  constructor(private route: ActivatedRoute, private embasamentoservice: EmbasamentoService,  private router: Router) {
  }
  ngOnInit() {
    this.createForm(new Embasamentos());
    this.pegaId();
  }


  createForm(embasamento) {
    this.embasamentoForm = new FormGroup({
      id: new FormControl(embasamento.id),
      descricao_completa: new FormControl(embasamento.descricao_completa, Validators.required),
      descricao: new FormControl(embasamento.descricao, Validators.required)
    });
  }
  salvar() {
    this.loadingCadastro = false;
    if (this.embasamentoForm.valid === false) {
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
      this.embasamentoservice.createEmbasamentos(this.embasamentoForm.value).subscribe((data: Embasamentos) => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'success',
          title: 'Embasamento cadastrado com sucesso',
          showConfirmButton: false,
          timer: 2000
        });
        setTimeout(() => {
          this.router.navigate(['/ListaEmbasamento/']);
        }, 3000);
      }, (error) => {
        window.scrollTo(0, 0);
        this.loadingCadastro = true;
        swal.fire({
          icon: 'warning',
          title: 'Falha na criação do embasamento',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }
  atualizar() {
    this.loadingCadastro = false;
    if (this.embasamentoForm.valid === false) {
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
      this.embasamentoservice.updateEmbasamentos(this.embasamentoForm.value).subscribe(() => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'success',
          title: 'Embasamento atualizado com sucesso',
          showConfirmButton: false,
          timer: 2000
        });
        setTimeout(() => {
          this.router.navigate(['/ListaEmbasamento/']);
        }, 3000);
      }, (error) => {
        window.scrollTo(0, 0);
        this.loadingCadastro = true;
        swal.fire({
          icon: 'warning',
          title: 'Falha na atualização do embasamento',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }

  pegaId() {
    this.route.queryParams.subscribe(
      queryParams => {
        this.idupdate = queryParams.id;
        if (this.idupdate != null) {
          window.scrollTo(0, 0);
          this.titulo = 'Atualizar Embasamento';
          this.embasamentoservice.listEmbasamentosById(this.idupdate).subscribe((documento: Embasamentos) => {
            this.createForm(documento);
          }, () => {
          });
        } else {
          window.scrollTo(0, 0);
          this.titulo = 'Cadastrar Embasamento';
          this.createForm(new Embasamentos());
        }
      }
    );
  }
}
