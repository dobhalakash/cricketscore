import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aution } from './aution';

describe('Aution', () => {
  let component: Aution;
  let fixture: ComponentFixture<Aution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
