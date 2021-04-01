import {Component, Input, OnInit} from '@angular/core';
import {ProductResponse} from '../../model/ProductResponse.model';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {
  @Input() product: ProductResponse;

  constructor(config:NgbRatingConfig) {
    config.max =5;
    config.readonly = true;

  }

  ngOnInit(): void {
  }

  goToExternalLink(link){
    window.open(link, "_blank");
  }

}
