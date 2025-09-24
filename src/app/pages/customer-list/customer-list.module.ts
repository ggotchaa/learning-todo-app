import { NgModule } from '@angular/core';

import { CustomerListComponent } from './customer-list.component';

@NgModule({
  imports: [CustomerListComponent],
  exports: [CustomerListComponent]
})
export class CustomerListModule {}
