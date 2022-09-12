import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { People } from '../model/people.model';
import { PeopleService } from '../people/people.service';
import { UsernameValidator } from '../validators/async-username.validator';

@Component({
  selector: 'app-people-form',
  templateUrl: './people-form.component.html',
  styleUrls: ['./people-form.component.css'],
})
export class PeopleFormComponent implements OnInit {
  isEdit: boolean = false;
  peopleForm!: FormGroup;
  userName!: string;
  people!: People;
  regexEmail: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  constructor(
    private fb: FormBuilder,
    private peopleService: PeopleService,
    private route: ActivatedRoute,
    private router: Router,
    private userNameValidator: UsernameValidator
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.userName = params['username'];
      this.isEdit = params['username'] != null;
      this.initForm();
    });
  }

  initForm() {
    let userName;
    let firstName;
    let middleName;
    let lastName;
    let emails = this.fb.array(
      [this.fb.control('', Validators.pattern(this.regexEmail))],
      isEmailDuplicate()
    );
    let addressInfo = this.fb.array([
      this.fb.group({
        Address: [''],
        City: this.fb.group({
          Name: [''],
          CountryRegion: [''],
          Region: [''],
        }),
      }),
    ]);
    //Case Edit
    if (this.isEdit) {
      emails = new FormArray<FormControl>([]);
      addressInfo = new FormArray<FormGroup>([]);
      this.peopleService.getPeople(this.userName).subscribe((data: People) => {
        this.people = data;
        if (this.people.Emails.length > 0) {
          for (let email of this.people.Emails) {
            emails.push(
              this.fb.control(
                email,
                Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')
              )
            );
          }
        }
        if (this.people.AddressInfo.length > 0) {
          for (let address of this.people.AddressInfo) {
            addressInfo.push(
              this.fb.group({
                Address: [address.Address],
                City: this.fb.group({
                  Name: [address.City.Name],
                  CountryRegion: [address.City.CountryRegion],
                  Region: [address.City.Region],
                }),
              })
            );
          }
        }
        this.peopleForm = this.fb.group({
          UserName: [this.people.UserName, Validators.required],
          FirstName: [this.people.FirstName, Validators.required],
          MiddleName: [this.people.MiddleName],
          LastName: [this.people.LastName, Validators.maxLength(26)],
          Emails: emails,
          AddressInfo: addressInfo,
        });
      });
    }
    //Case New Form
    this.peopleForm = this.fb.group({
      UserName: [
        userName,
        Validators.required,
        this.userNameValidator.checkUsername.bind(this.userNameValidator),
      ],
      FirstName: [firstName, Validators.required],
      MiddleName: [middleName],
      LastName: [lastName, Validators.maxLength(26)],
      Emails: emails,
      AddressInfo: addressInfo,
    });
  }

  get emails() {
    return this.peopleForm.get('Emails') as FormArray;
  }

  get addressInfo() {
    return this.peopleForm.get('AddressInfo') as FormArray;
  }

  get UserName() {
    return this.peopleForm.get('UserName');
  }

  get FirstName() {
    return this.peopleForm.get('FirstName');
  }

  get LastName() {
    return this.peopleForm.get('LastName');
  }

  addEmail() {
    this.emails.push(this.fb.control('', Validators.pattern(this.regexEmail)));
  }

  removeEmail(i: number) {
    this.emails.removeAt(i);
  }

  addAddressInfo() {
    this.addressInfo.push(
      this.fb.group({
        Address: [''],
        City: this.fb.group({
          Name: [''],
          CountryRegion: [''],
          Region: [''],
        }),
      })
    );
  }

  removeAddressInfo(i: number) {
    this.addressInfo.removeAt(i);
  }

  showAlertAdd() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  onSubmit(people: People) {
    if (this.isEdit) {
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Saved!', '', 'success');
          this.peopleService
            .updatePeople(people)
            .subscribe(() => this.onCancel());
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
    } else {
      this.showAlertAdd();
      this.peopleService.addPeople(people).subscribe(() => this.onCancel());
    }
  }

  onCancel() {
    this.router.navigate([''], {
      relativeTo: this.route,
    });
  }
}

function isEmailDuplicate() {
  const validator: ValidationErrors = (formArray: FormArray) => {
    const emails = formArray.controls.map((control) => control.value);
    const hasDuplicate = emails.some(
      (name, index) => emails.indexOf(name, index + 1) != -1
    );
    return hasDuplicate ? { duplicate: true } : null;
  };
  return validator;
}
