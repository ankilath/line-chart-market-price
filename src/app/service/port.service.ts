import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IPorts, IMarketPrice } from '../shared/tradeSchema';
import { environment } from '../../environment/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PortService {
  constructor(private http: HttpClient) {}

  getPorts() {
    const headers = environment.apiKey;
    return this.http.get<IPorts[]>(`${environment.apiUrl}/ports`, { headers, observe: 'response' });
  }

  getMarketPrice(src: string, dest: string): Observable<any> {
    const headers = environment.apiKey;
    return this.http.get<IMarketPrice[]>(
      `${environment.apiUrl}/rates?origin=${src}&destination=${dest}`,
      { headers, observe: 'response' }
    );
  }
}
