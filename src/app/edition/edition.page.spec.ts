import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditionPage } from './edition.page';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

describe('EditionPage', () => {
  let component: EditionPage;
  let fixture: ComponentFixture<EditionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(EditionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
