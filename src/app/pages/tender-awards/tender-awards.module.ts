import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIconsModule } from '@ng-icons/core';

import { TenderAwardsComponent } from './tender-awards.component';

@NgModule({
  declarations: [TenderAwardsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    NgIconsModule
  ],
  exports: [TenderAwardsComponent]
})
export class TenderAwardsModule {}
