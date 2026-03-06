import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestBook } from './request-book';

describe('RequestBook', () => {
  let component: RequestBook;
  let fixture: ComponentFixture<RequestBook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestBook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestBook);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
