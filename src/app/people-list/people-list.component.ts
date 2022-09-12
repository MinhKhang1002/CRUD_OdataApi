import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { Odata } from '../model/odata';
import { People } from '../model/people.model';
import { PeopleService } from '../people/people.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css'],
})
export class PeopleListComponent implements OnInit {
  peopleList!: People[];

  constructor(private peopleService: PeopleService) {
    this.peopleService.getAllPeople().subscribe((data: Odata) => {
      this.peopleList = data.value;
    });
  }

  ngOnInit() {}

  deletePeople(people: People): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        this.peopleList = this.peopleList.filter(
          (item: People) => item !== people
        );
        this.peopleService.deletePeople(people.UserName).subscribe();
      }
    });
  }

  showAlert() {
    Swal.fire('Any fool can use a computer');
  }
}
