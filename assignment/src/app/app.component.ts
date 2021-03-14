import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Column } from './modal/column';
import { Person } from './modal/person';
import { PersonApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  persons: Person[] = [];
  columns: Column[] = [];
  personForm: FormGroup;
  addressForm: FormGroup;
  geoForm: FormGroup;
  companyForm: FormGroup;
  isEdit: boolean = false;
  show: boolean = false;
  listsData: any[] = [];
  currentPageItems: any[] = [];
  lists: any[] = [];

  intialPageConfig = {
    numOfPages: 5,
    itemsPerPage: 5,
    directionalLinks: true
  };
  pageConfig: any;

  constructor(
    private personService: PersonApiService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.pageConfig = this.intialPageConfig;
    this.initializeColumns();
    this.build();

  }

  ngOnInit() {
    this.personService.listPersons().subscribe((response: Person[]) => {
      this.persons = response;
    });
  }

  initializeColumns() {
    this.columns = [
      { label: 'ID', name: 'id', enable: true },
      { label: 'Name', name: 'name', enable: true },
      { label: 'Username', name: 'username', enable: true },
      { label: 'Email', name: 'email', enable: true },
      { label: 'Website', name: 'website', enable: false },
    ];
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {

    });
  }

  identify(item, index) {
    return item.name;
  }

  edit(person: Person, content) {
    this.isEdit = true;
    this.geoForm = this.formBuilder.group({
      lat: [person.address.geo.lat],
      lng: [person.address.geo.lng]
    });
    this.addressForm = this.formBuilder.group({
      street: [person.address.street],
      suit: [person.address.suite],
      city: [person.address.city],
      zipcode: [person.address.zipcode],
      geo: this.geoForm
    });
    this.companyForm = this.formBuilder.group({
      name: [person.company.name],
      catchPhrase: [person.company.catchPhrase],
      bs: [person.company.bs]
    });
    this.personForm = this.formBuilder.group({
      id: [person.id],
      name: [person.name],
      username: [person.username],
      email: [person.email],
      address: this.addressForm,
      website: [person.website],
      company: this.companyForm
    });
    this.personForm.get('id').disable();
    this.personForm.updateValueAndValidity();
    this.open(content);
  }

  build() {
    this.geoForm = this.formBuilder.group({
      lat: [],
      lng: []
    });
    this.addressForm = this.formBuilder.group({
      street: [],
      suit: [],
      city: [],
      zipcode: [],
      geo: this.geoForm
    });
    this.companyForm = this.formBuilder.group({
      name: [],
      catchPhrase: [],
      bs: []
    });
    this.personForm = this.formBuilder.group({
      id: [],
      name: [],
      username: [],
      email: [],
      address: this.addressForm,
      website: [],
      company: this.companyForm
    });
  }
  addNewUser(content) {
    this.isEdit = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {

    });
    this.build();
  }
  submitNewUser(modal) {
    const id = this.personForm.get('id').value;
    if (this.isEdit && this.personForm.get('id').value) {
      const index = this.persons.findIndex(person => person.id === this.personForm.get('id').value);
      this.persons.splice(index, 1);
    }
    this.personForm.value.id = id;
    this.persons.push(this.personForm.value);
    this.persons = JSON.parse(JSON.stringify(this.persons));
    this.isEdit = false;
    modal.dismiss('Cross click');
  }

  change(value) {
    this.pageConfig.itemsPerPage = value.value;
    this.pageConfig = JSON.parse(JSON.stringify(this.pageConfig));
  }

  cancel() {
    this.isEdit = false;
  }

  add(event, _column: Column) {
    this.columns.forEach(column => {
      if (column.name === _column.name) {
        column.enable = event.checked;
      }
    })
  }

  showColumnTogle(modal) {
    this.open(modal);
  }
}
