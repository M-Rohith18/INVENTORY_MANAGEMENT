import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReduceComponent } from './add-reduce.component';

describe('AddReduceComponent', () => {
  let component: AddReduceComponent;
  let fixture: ComponentFixture<AddReduceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReduceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
