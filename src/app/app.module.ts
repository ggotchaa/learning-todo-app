import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIconsModule } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideDownload,
  lucideFileSpreadsheet,
  lucideFileText,
  lucideLock,
  lucideMoon,
  lucideRefreshCw,
  lucideRotateCcw,
  lucideSun,
  lucideTrash2,
  lucideUpload,
  lucideX
} from '@ng-icons/lucide';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { TenderAwardsComponent } from './pages/tender-awards/tender-awards.component';
import { CustomerListComponent } from './pages/customer-list/customer-list.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    NgIconsModule.withIcons({
      lucideArrowUpDown,
      lucideDownload,
      lucideFileSpreadsheet,
      lucideFileText,
      lucideLock,
      lucideMoon,
      lucideRefreshCw,
      lucideRotateCcw,
      lucideSun,
      lucideTrash2,
      lucideUpload,
      lucideX
    }),
    AppRoutingModule,
    ReportsComponent,
    TenderAwardsComponent,
    CustomerListComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
