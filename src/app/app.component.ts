import {Component, OnInit} from '@angular/core';
import {SearchServiceService} from './services/search-service.service';
import {ProductResponse} from './model/ProductResponse.model';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'searchEngineUI';
  searchString = '';
  domain= 'UK';
  dropDownLabel="Country";
  dropDownLabelPrice="Price"
  maxPrice: number =0;
  priceFilterArray: Array<any> = [];
  countryList: Array<any> = [
    { name: 'Great Britain', img: './assets/icons8-great-britain-48.png', domain:"UK"},
    { name: 'United Arab Emirates', img: './assets/icons8-united-arab-emirates-48.png', domain:"UAE" }
  ];
  show:boolean = false;
  result: ProductResponse[] = new Array();
  resultCopy: ProductResponse[] = new Array();

  config ={currentPage: 1, itemsPerPage: 9, totalItems:0};
  brands = [
    { value: 'Louis Vuitton', viewValue: 'Louis Vuitton' },
    { value: 'Gucci', viewValue: 'Gucci' },
    { value: 'Prada', viewValue: 'Prada' },
    { value: 'Chanel', viewValue: 'Chanel' },
  ];
  constructor(private searchService: SearchServiceService, public snackBar: MatSnackBar) {
  }
  ngOnInit(){
    console.log(this.searchString);

  }
  changeCountry(countryName) {
    this.show = true;
    this.dropDownLabel = countryName;
    console.log(countryName);
    let result = this.countryList.filter(country =>{
      return country.name == (countryName);
    });
    this.domain = result[0].domain;

    if(this.searchString!="") {
      this.search();
    }
  }
  logValue(){
    console.log(this.searchString);
  }
  search(){
    console.log(this.searchString);
    console.log(this.domain);
    this.result = [];
    this.priceFilterArray = [];
    this.searchService.searchForResults(this.searchString, this.domain)
      .subscribe(
      (data:any[]) => {
        data.forEach((product) => {
          let resultProduct = new ProductResponse();
          resultProduct.title = product["title"];
          resultProduct.brand = product["brand"];
          resultProduct.rating = product["rating"];
          resultProduct.imageLink = product["imageLink"]["link"];
          resultProduct.link = product["link"];
          resultProduct.price = product["buyboxWinner"] != null
          && product["buyboxWinner"]["price"] &&
          product["buyboxWinner"]["price"]["raw"] ? product["buyboxWinner"]["price"]["raw"] : "";
          this.result.push(resultProduct);
          if (this.maxPrice < parseInt(resultProduct.price.replace("$",""))) {
            this.maxPrice = parseInt(resultProduct.price.replace("$",""));
          }
        });
        if(data.length == 0) {
          let config = new MatSnackBarConfig();
          config.duration = 6000;
          this.snackBar.open("Oops! No data available, please try another search!", null, config);

        }
        this.resultCopy = this.result;
      },
        (error: any) => {
          let config = new MatSnackBarConfig();
          config.duration = 3000;
            this.snackBar.open("Unable to process request" + error, null, config);
          },
          ()=> {
            this.config = {
              itemsPerPage: 9,
              currentPage: 1,
              totalItems: this.result.length
            };
            this.buildPriceFilterArray();
            console.log(this.maxPrice);
          });


  }
  pageChanged(event){
    this.config.currentPage = event;
  }

  buildPriceFilterArray(){
    let maxPrice =0;
    let minPrice =0;
    while(minPrice< Math.round(this.maxPrice/100)*100) {
      maxPrice = minPrice + 50;
        this.priceFilterArray.push({
          min: minPrice,
          max: maxPrice,
          text:"$"+minPrice+" - $"+ maxPrice});

      minPrice = maxPrice;
    }



  }

  clearPriceFilter(){
    this.result = this.resultCopy;
    this.config = {
      itemsPerPage: 9,
      currentPage: 1,
      totalItems: this.result.length
    };
    this.dropDownLabelPrice = "Price";
  }

  filterByPrice(min, max, text) {
    this.dropDownLabelPrice = text;
    this.result = this.resultCopy.filter(product =>
      parseInt(product.price.replace("$", "")) >= min
      && parseInt(product.price.replace("$", "")) <= max)
    if(this.result.length == 0) {
      let config = new MatSnackBarConfig();
      config.duration = 6000;
      this.snackBar.open("Oops! No data available, please try another search!", null, config);

    }
    this.config = {
      itemsPerPage: 9,
      currentPage: 1,
      totalItems: this.result.length
    };


  }
}
