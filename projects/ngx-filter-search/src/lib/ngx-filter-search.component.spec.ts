import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFilterSearchComponent } from './ngx-filter-search.component';

describe('NgxFilterSearchComponent', () => {
  let component: NgxFilterSearchComponent;
  let fixture: ComponentFixture<NgxFilterSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxFilterSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxFilterSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
