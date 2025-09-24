import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { NgIconsModule } from '@ng-icons/core';

import { ReportsComponent } from './reports.component';

@NgModule({
  declarations: [ReportsComponent],
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, NgIconsModule],
  exports: [ReportsComponent]
})
export class ReportsModule {}
