import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
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
import { HomeComponent } from './pages/home/home.component';
import { ReportsModule } from './pages/reports/reports.module';
import { TenderAwardsModule } from './pages/tender-awards/tender-awards.module';
import { CustomerListModule } from './pages/customer-list/customer-list.module';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
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
    ReportsModule,
    TenderAwardsModule,
    CustomerListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
