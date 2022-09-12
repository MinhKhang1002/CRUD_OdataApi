import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { PeopleService } from '../people/people.service';
@Injectable()
export class UsernameValidator {
  debouncer: any;
  constructor(public peopleService: PeopleService) {}
  checkUsername(control: FormControl): ValidationErrors {
    clearTimeout(this.debouncer);

    return new Promise((resolve) => {
      this.debouncer = setTimeout(() => {
        this.peopleService.getPeople(control.value.toLowerCase()).subscribe(
          (res) => {
            console.log(res);

            if (res) {
              resolve({ usernameIsDuplicate: true });
            }
          },
          (err) => {
            resolve(null);
          }
        );
      }, 1000);
    });
  }
}
