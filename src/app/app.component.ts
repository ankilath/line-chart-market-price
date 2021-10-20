import { Component, OnInit } from '@angular/core';
import { PortService } from './service/port.service';
import { IMarketPrice, IPorts } from './shared/tradeSchema';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  ports: IPorts[];
  toggleBool = [false, false];
  srcRecords = [];
  destRecords = [];
  srcModel = '';
  destModel = '';
  single = [];
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel: 'Years';
  showYAxisLabel = true;
  yAxisLabel: 'Salary';
  graphDataChart: any[];
  dataReceived = false;
  autoScale = true;
  originName: any;
  destName: any;

  constructor(private service: PortService) {}

  ngOnInit(): void {
    this.service.getPorts().subscribe({
      next: (data) => this.ports = data.body,
      error: (e) => alert('No data found')
    });
  }

  onSubmit() {
    this.service.getMarketPrice(this.originName, this.destName).subscribe({
      next: (response) => this.organiseData(response.body),
      error: (e) => alert('No data found')
    });
  }

  organiseData(data: IMarketPrice[]) {
    let high = [],
      mean = [],
      low = [];
    data.forEach((obj) => {
      if (obj.high) {
        high.push({
          name: obj.day,
          value: obj.high,
        });
      }
      if (obj.low) {
        low.push({
          name: obj.day,
          value: obj.low,
        });
      }
      if (obj.mean) {
        mean.push({
          name: obj.day,
          value: obj.mean,
        });
      }
    });
    this.single.push({
      name: 'Market High',
      series: high,
    });
    this.single.push({
      name: 'Market Low',
      series: low,
    });
    this.single.push({
      name: 'Market Average',
      series: mean,
    });
    this.dataReceived = true;
  }

  credentialsSearchFilter(event: any, type: string) {
    const val = event.target.value.toLowerCase();
    if (type == 'origin')
      this.srcRecords = this.ports.filter(function (d) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    else
      this.destRecords = this.ports.filter(function (d) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      });
  }
  hideList(type: string) {
    this.destRecords = [];
    this.srcRecords = [];
    if (type == 'origin') this.toggleBool[0] = false;
    else this.toggleBool[1] = false;
  }
  toggle(event: any, type: string) {
    if (type == 'origin') {
      this.toggleBool[0] === false
        ? (this.toggleBool[0] = true)
        : (this.toggleBool[0] = false);
    } else {
      this.toggleBool[1] === false
        ? (this.toggleBool[1] = true)
        : (this.toggleBool[1] = false);
    }
    this.toggleBool[0] || this.toggleBool[1]
      ? this.credentialsSearchFilter(event, type)
      : this.hideList(type);
  }

  getNameValue(row: IPorts, type: string) {
    if (type == 'origin') {
      this.srcModel = row.name;
      this.srcRecords = [];
      this.ports.forEach((item) => {
        if (item.name === row.name) {
          this.originName = row.code;
        }
      });
    } else {
      this.destModel = row.name;
      this.destRecords = [];
      this.ports.forEach((item) => {
        if (item.name === row.name) {
          this.destName = row.code;
        }
      });
    }
  }
}
