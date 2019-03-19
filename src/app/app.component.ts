import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as faker from 'faker';

let expectedSize = 0;

const createItem = () => {
  const count = faker.random.number({min:0, max:5})
  expectedSize += 35 + (count * 24);
  return {
    id: faker.random.uuid(),
    name: faker.name.firstName(),
    zipcode: faker.address.zipCode(),
    jobType: faker.name.jobType(),
    company: faker.company.companyName(),
    count
  };
};

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {

  items$ = new BehaviorSubject([]);
  loading$ = new BehaviorSubject(false);

  ngOnInit() {
    this.loading$.next(true);

    let count = 0;
    for (let index = 0; index < 100; index++) {
      setTimeout(() => {
        const cur = this.items$.getValue();
        this.items$.next([
          ...cur,
          createItem(),
          createItem(),
          createItem(),
          createItem(),
          createItem()
        ]);

        count++;

        if (count === 100) {
          this.loading$.next(false);
        }

      }, faker.random.number({ min:100, max:400 }))
    }
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

}
