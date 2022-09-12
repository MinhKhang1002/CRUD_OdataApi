import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PeopleFormComponent } from './people-form/people-form.component';
import { PeopleListComponent } from './people-list/people-list.component';

const routes: Routes = [
  {
    path: 'form',
    component: PeopleFormComponent,
  },
  {
    path: '',
    component: PeopleListComponent,
  },
  {
    path: ':username',
    component: PeopleFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
