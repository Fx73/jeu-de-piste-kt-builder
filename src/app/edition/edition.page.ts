import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.page.html',
  styleUrls: ['./edition.page.scss'],
})
export class EditionPage implements OnInit {
  public edition: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.edition = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
