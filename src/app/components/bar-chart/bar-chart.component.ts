import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { TipoTermoPipe } from 'src/app/pipes/tipo-termo.pipe';
import swal from 'sweetalert2';
import { CountTermos } from '../../../models/termos';
import { TermoService } from '../../services/termo.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  initDate = `${new Date().getFullYear()}-01-01`;
  endDate = `${new Date().getFullYear()}-12-31`;
  countTermos: CountTermos[] = [];
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
      backgroundColor: ['rgba(20, 186, 50,0.8)', 'rgba(6, 82, 221,0.8)', 'rgba(220, 160, 113,0.8)', 'rgba(170, 22, 21,0.8)',
        'rgba(10, 182, 221,0.8)', 'rgba(55, 82, 129,0.8)', 'rgba(234, 32, 39,0.8)'],
    },
  ];

  constructor (private termosService: TermoService, private pipe: TipoTermoPipe) { }

  ngOnInit () {
    this.getListaTermo();
  }

  getListaTermo () {
    if (this.initDate !== '' && this.endDate !== '') {
      this.termosService.countTermosByPeriod(this.initDate, this.endDate)
        .subscribe((values: [CountTermos]) => {
          this.countTermos = values;
          this.fillChart();
        });
    } else {
      swal.fire({
        icon: 'warning',
        title: 'As datas fornecidas estão inválidas',
        text: 'Favor fornecer datas válidas para atualização do gráfico',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }

  fillChart () {
    this.barChartLabels = this.countTermos.map((value) => this.pipe.transform(value.tipo_termo));
    this.barChartData = this.countTermos.map((value) => value.count);
  }
}
