import { Component, OnInit } from '@angular/core';
import { CalAuthService } from './core/services/cal-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private readonly calAuthService: CalAuthService) {}

  ngOnInit(): void {
    this.calAuthService.initialize();
  }
}
