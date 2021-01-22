import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { Termos } from '../termos';
import { TermoService } from '../service/termo.service';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  @Input() termo: Termos[] = [];

  prot: Termos;
  inutilizacao = 0;
  inspecao = 0;
  orientacao = 0;
  desinterdicao = 0;
  interdicao = 0;
  notificacao = 0;
  constatacao = 0;
  relatorio = 0;
  infracao = 0;
  public i = 0;
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartData: SingleDataSet = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartColors = [
    {
      backgroundColor: ['rgba(20, 186, 50,0.75)', 'rgba(6, 82, 221,0.75)', 'rgba(220, 160, 113,0.75)', 'rgba(170, 22, 21,0.75)',
        'rgba(10, 182, 221,0.75)', 'rgba(55, 82, 129,0.75)', 'rgba(234, 32, 39,0.75)'],
    },
  ];


  constructor(private termoservice: TermoService) { }

  ngOnInit() {
    this.getListatermo();
  }

  getListatermo() {
    this.termoservice.ListarTodosTermos()
      .subscribe((termo) => {
        this.termo = termo;

      }).add(() => { this.fillChart(); })
  }

  fillChart() {
    this.termo.filter(item => {
      if (item.tipo_termo === 'inspecao') {
        this.inspecao++;
      } else if (item.tipo_termo === 'orientacao') {
        this.orientacao++;
      } else if (item.tipo_termo === 'desinterdicao') {
        this.desinterdicao++;
      } else if (item.tipo_termo === 'interdicao') {
        this.interdicao++;
      } else if (item.tipo_termo === 'notificacao') {
        this.notificacao++;
      } else if (item.tipo_termo === 'constatacao') {
        this.constatacao++;
      } else if (item.tipo_termo === 'relatorio') {
        this.relatorio++;
      } else if (item.tipo_termo === 'infracao') {
        this.infracao++;
      } else if (item.tipo_termo === 'inutilizacao') {
        this.inutilizacao++;
      }
    }
    );
    this.barChartLabels = ['Inspeção', 'Constatação', 'Orientação',
      'Notificação', 'Relatório', 'Desinterdição', 'Interdição', 'Inutilização', 'Infracao'];
    this.barChartData = [
      this.inspecao,
      this.constatacao,
      this.orientacao,
      this.notificacao,
      this.relatorio,
      this.desinterdicao,
      this.interdicao,
      this.inutilizacao,
      this.infracao]
  }
}
