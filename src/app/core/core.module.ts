import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialModule } from '../shared/material/material.module';
import { API_BASE_URL } from './services/api.base';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [HeaderComponent, FooterComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [HeaderComponent, FooterComponent],
  providers: [{ provide: API_BASE_URL, useValue: environment.apiBaseUrl }]
})
export class CoreModule {}

