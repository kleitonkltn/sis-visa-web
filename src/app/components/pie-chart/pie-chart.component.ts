
import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import * as moment from 'moment';
import { Label, SingleDataSet } from 'ng2-charts';
import { Estabelecimento } from '../../../models/estabelecimento';
import { EstabelecimentoService } from '../../services/estabelecimento.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  @Input() estabelecimentos: Estabelecimento[] = [];
  estabelecimento: Estabelecimento;
  public licencaAtiva: number;
  public dataAtual: Date;
  public vencidaCount = 0;
  public avencerCount = 0;
  public vigenteCount = 0;
  public inativosCount = 0;
  public pieChartLabels: Label[] = ['Licenças Vencidas', 'Licenças à Vencer', 'Licenças Vigentes', 'Inativos'];
  public pieChartData: SingleDataSet = [this.vencidaCount, this.avencerCount, this.vigenteCount, this.inativosCount];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(235, 47, 6,1.0)', 'rgba(246, 185, 59,1.0)', 'rgba(46, 204, 113,1.0)', 'rgba(220, 220, 220,1.0)'],
    },
  ];

  constructor (private estabelecimentoService: EstabelecimentoService) { }

  ngOnInit () {
    this.getListaLicenca();
  }

  getListaLicenca () {
    this.estabelecimentoService.ListarTodosEstabelecimentos()
      .subscribe((estabelecimentos) => {
        this.estabelecimentos = estabelecimentos;
        this.countLicencaStatus();
      });
  }

  countLicencaStatus () {
    this.estabelecimentos.filter(item => {
      if (item.status === '0') {
        return this.inativosCount++;
      }
      if (!item.data_retorno || !item.data_licenca) {
        return this.vencidaCount++;
      }
      const dataAtual = moment(this.dataAtual);
      const dataLicenca = moment(item.data_retorno);
      const diferencaEntreDatas = dataLicenca.diff(dataAtual, 'days');
      if (diferencaEntreDatas < 0) {
        return this.vencidaCount++;
      }
      if (diferencaEntreDatas >= 0 && diferencaEntreDatas <= 31) {
        this.avencerCount++;
      }
      if (diferencaEntreDatas > 31) {
        this.vigenteCount++;
      }
    });
    this.pieChartData = [this.vencidaCount, this.avencerCount, this.vigenteCount, this.inativosCount];
  }

  addSlice () {
    this.pieChartColors[0].backgroundColor.push('rgba(196,79,244,0.3)');
  }
}
