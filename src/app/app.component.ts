import { Component } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'finalASM';
  items!: MenuItem[];
  constructor(private primengConfig: PrimeNGConfig) {}
  ngOnInit() {
    this.primengConfig.ripple = true;
    this.items = [
      {
        label: 'People',
        routerLink: [''],
      },
      {
        label: 'People List',
        icon: 'pi pi-list',
        routerLink: [''],
      },
      {
        label: 'People Information',
        icon: 'pi pi-user-edit',
        routerLink: ['form'],
      },
    ];
  }
}
