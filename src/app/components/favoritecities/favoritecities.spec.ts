import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Favoritecities } from './favoritecities';

describe('Favoritecities', () => {
  let component: Favoritecities;
  let fixture: ComponentFixture<Favoritecities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Favoritecities],
    }).compileComponents();

    fixture = TestBed.createComponent(Favoritecities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
