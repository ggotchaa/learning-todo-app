import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BiddingReport } from '../../features/home/reports/bidding-report.interface';
import { ApiService } from './api.base';

@Injectable({ providedIn: 'root' })
export class ApiEndpointService {
  constructor(private readonly api: ApiService) {}

  getBiddingReports(): Observable<BiddingReport[]> {
    return this.api.get<BiddingReport[]>('/BiddingReports');
  }
}

