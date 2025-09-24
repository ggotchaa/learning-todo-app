import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportsComponent } from './pages/reports/reports.component';
import { TenderAwardsComponent } from './pages/tender-awards/tender-awards.component';
import { CustomerListComponent } from './pages/customer-list/customer-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'reports', pathMatch: 'full' },
  { path: 'reports', component: ReportsComponent },
  { path: 'tender-awards', component: TenderAwardsComponent },
  { path: 'customers', component: CustomerListComponent },
  { path: '**', redirectTo: 'reports' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
