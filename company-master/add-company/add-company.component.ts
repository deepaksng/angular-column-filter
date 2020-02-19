import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../company.service';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../company';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {

  companyData: any = {};
  allCountries: any = [];
  allStates: any = [];
  allCities: any = [];
  contactArray: any = [];
  userData: any = {};
  isMacAllow: any;
  emailOtp: any = 0;
  smsOtp: any = 0;
  imageData: any;

  addCompanyForm: FormGroup;

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  validationMessage = {
    'companyName': [
      { type: 'required', message: 'Company Name Is Required' },
      { type: 'minlength', message: 'Minimum 2 Character Is Required' },
      { type: 'maxlength', message: 'Maximum 25 Character Is Allowed' }
    ],
    'address': [
      { type: 'required', message: 'Address Is Required' },
      { type: 'maxlength', message: 'Maximum 150 Character Is Allowed' }
    ],
    'companyEmail': [
      { type: 'required', message: 'Company Email Id Is Required' },
      { type: 'pattern', message: 'Please Enter Valid Email Address' }
    ],
    'mobileNo': [
      { type: 'required', message: 'Mobile Number Is Required' },
      { type: 'pattern', message: 'Please Enter Only Number' }
    ],
    'countryId': [
      { type: 'required', message: 'Country Is Required' }
    ],
    'stateId': [
      { type: 'required', message: 'State Is Required' }
    ],
    'cityId': [
      { type: 'required', message: 'City Is Required' }
    ],
    'contactName': [
      { type: 'required', message: 'Contact Name Is Required' },
      { type: 'minlength', message: 'Minimum 2 Character Is Required' },
      { type: 'maxlength', message: 'Maximum 25 Character Is Allowed' }
    ],
    'contactemail': [
      { type: 'required', message: 'Contact Email Id Is Required' },
      { type: 'pattern', message: 'Please Enter Valid Email Address' }
    ],
    'contactmobileno': [
      { type: 'required', message: 'Mobile Number Is Required' },
      { type: 'pattern', message: 'Please Enter Only Number' }
    ],
    'type': [
      { type: 'required', message: 'Please Select Partner Type' }
    ]
  }

  constructor(
    private localStorage: LocalStoreService,
    private companyService: CompanyService,
    public http: HttpClient,
    public route: ActivatedRoute,
    private auth: AuthService,
    private modalService: NgbActiveModal) {

    this.userData = this.auth.getuser();
  }

  get details() {
    return this.addCompanyForm.controls;
  }

  ngOnInit() {
    this.loadCountry();
    this.addCompanyForm = new FormGroup({
      'companyName': new FormControl('',
        [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25)
        ]
      ),
      'address': new FormControl('',
        [Validators.required,
        Validators.maxLength(150)
        ]),
      'companyEmail': new FormControl('',
        [
          Validators.required,
          Validators.pattern(this.emailPattern)
        ]),
      'mobileNo': new FormControl('',
        [
          Validators.required,
          Validators.pattern('[0-9]+')
        ]),
      'countryId': new FormControl('', [Validators.required]),
      'stateId': new FormControl('', [Validators.required]),
      'cityId': new FormControl('', [Validators.required]),
      'contactName': new FormControl('', [Validators.required]),
      'type': new FormControl(),
      'isAllowMac': new FormControl('1'),
      // 'isEmailOtp': new FormControl(),
      // 'isSmsOtp': new FormControl()
    });

  }
  loadCountry(): void {
    this.companyService.getCountry().subscribe((res: Company) => {
      this.allCountries = res;
    });
  }

  changeStateAsPerCountry(val: any): void {
    this.allStates = [];
    this.allCities = [];
    if (this.addCompanyForm.value.countryId == "") {
      this.addCompanyForm.controls['stateId'].disable();
      this.addCompanyForm.controls['cityId'].disable();
    } else {
      let obj: any = {
        "CountryId": this.addCompanyForm.value.countryId
      }

      this.loadState(obj);
      this.addCompanyForm.value.stateId = "";
      this.addCompanyForm.patchValue({
        companyName: this.addCompanyForm.value.companyName,
        countryId: this.addCompanyForm.value.countryId,
        stateId: "",
        cityId: ""
      });
      this.addCompanyForm.controls['stateId'].enable();
      this.addCompanyForm.controls['cityId'].disable();
    }
  }

  loadState(obj: any) {
    this.companyService.getState(obj).subscribe((res: Company) => {
      this.allStates = res;
    });
  }

  changeCityAsPerState(): void {
    this.allCities = [];
    if (this.addCompanyForm.value.stateId == "") {
      this.addCompanyForm.controls['cityId'].disable()
    } else {
      let obj: any = {
        "StateId": this.addCompanyForm.value.stateId
      }

      this.addCompanyForm.patchValue({
        companyName: this.addCompanyForm.value.companyName,
        countryId: this.addCompanyForm.value.countryId,
        stateId: this.addCompanyForm.value.stateId,
        cityId: ""
      });
      this.loadCity(obj);
      this.addCompanyForm.value.cityId = "";
      this.addCompanyForm.controls['cityId'].enable();
     }
  }

  loadCity(obj: any): void {
    this.companyService.getCity(obj).subscribe((res: Company) => {
      this.allCities = res;
    });
  }

  checkedValue(val: any) {
    this.isMacAllow = val;
  }

  // checkedEmailOtp(otp: any) {
  //   this.emailOtp = otp;
  // }

  // checkedSmsOtp(otp: any) {
  //   this.smsOtp = otp;
  // }


  addForm(): void {
    let reqObj: any = {
      "CompanyId": this.userData.cid,
      "UserId": this.userData.uid,
      "ParentCompanyId": 1,
      "CompanyCode": '',
      "CompanyName": this.addCompanyForm.value.companyName,
      "CompanyEmail": this.addCompanyForm.value.companyEmail,
      "ContactPerson": this.addCompanyForm.value.contactName,
      "ContactPersonNumber": this.addCompanyForm.value.mobileNo,
      "CreatedBy": this.userData.uid,
      "ModifiedBy": this.userData.uid,
      "Address": this.addCompanyForm.value.address,
      "Email": this.addCompanyForm.value.companyEmail,
      "Telephone": this.addCompanyForm.value.mobileNo,
      "PIN": '',
      "CityId": this.addCompanyForm.value.cityId,
      "ProductId": '',
      "PartnerType": this.addCompanyForm.value.type,
      "CountryId": this.addCompanyForm.value.countryId,
      "StateId": this.addCompanyForm.value.stateId,
      "IsActive": '',
      "Search": '',
      "ClientIp":this.localStorage.getItem('ClientIp'), 
      "IsAllowMac": this.isMacAllow,
      // "IsEmailOtp": this.emailOtp,
      // "IsSmsOtp": this.smsOtp
    }
console.log(JSON.stringify(reqObj));
    this.companyService.saveRecord(reqObj).subscribe((res) => {
      if (res[0].STATUS == "1") {
        this.modalService.close();
        this.companyService.toasterSuccessMsg(res[0].alertmessage);
      } else {
        this.modalService.close();
        this.companyService.toasterFailureMsg(res[0].alertmessage);
      }
    });
  }

  close(): void {
    this.modalService.close();
  }

}



