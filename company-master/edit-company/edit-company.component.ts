import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CompanyService } from './../company.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})

export class EditCompanyComponent implements OnInit {

  editCompanyForm: FormGroup;

  companyData: any = {};
  allCountries: any = [];
  allStates: any = [];
  allCities: any = [];
  @Input() CompanyId: any;
  userData: any = {};
  isMacAllow: any;
  emailOtp: any;
  smsOtp: any;

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
    'ptype': [
      { type: 'required', message: 'Please Select Partner Type' }
    ]
  }


  constructor(
    private localStorage: LocalStoreService,
    public route: ActivatedRoute,
    public http: HttpClient,
    private router: Router,
    private companyService: CompanyService,
    private modalService: NgbActiveModal,
    private auth: AuthService,
    public toaster: ToastrService) {
    this.userData = this.auth.getuser();
  }

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  ngOnInit() {
    this.fetchCompanyData();
    this.loadCountry();
    this.editCompanyForm = new FormGroup({
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
      'partnertype': new FormControl(),
      'isAllowMac': new FormControl(),
      // 'isEmailOtp': new FormControl(),
      // 'isSmsOtp': new FormControl()
    });

  }

  get details() {
    return this.editCompanyForm.controls;
  }

  fetchCompanyData() {
    var obj = {
      "CompanyId": this.CompanyId
    }

    this.companyService.fetchRecord(obj).subscribe((res) => {
      this.companyData = res;
      console.log(res);
      let type = res[0].PartnerType;
      if (type != null) {
        type = res[0].PartnerType.toString();
      }
      this.editCompanyForm.patchValue({
        companyName: res[0].CompanyName,
        address: res[0].Address,
        companyEmail: res[0].CompanyEmail,
        mobileNo: res[0].Telephone,
        countryId: res[0].CountryId,
        contactName: res[0].ContactPerson,
        contactemail: res[0].Email,
        contactmobileno: res[0].ContactPersonNumber,
        partnertype: type,
        isAllowMac: res[0].IsAllowMac,
        isEmailOtp: 0,
        isSmsOtp: 1
      });

      this.changeStateAsPerCountry(this.editCompanyForm.value.countryId);
      this.editCompanyForm.patchValue({
        stateId: res[0].StateId
      });
      this.changeCityAsPerState();
      this.editCompanyForm.patchValue({
        cityId: res[0].CityId
      });
    });
  }

  loadCountry() {
    this.companyService.getCountry().subscribe((res) => {
      this.allCountries = res;
      console.log(this.allCountries);
    });
  }

  changeStateAsPerCountry(val) {
    this.allStates = [];
    this.allCities = [];
    if (this.editCompanyForm.value.countryId == "") {
      this.editCompanyForm.controls['stateId'].disable();
      this.editCompanyForm.controls['cityId'].disable();
    }
    else {
      let obj: any = {
        "CountryId": this.editCompanyForm.value.countryId
      }
      this.loadState(obj);
      this.editCompanyForm.value.stateId = "";
      this.editCompanyForm.patchValue(
        {
          companyName: this.editCompanyForm.value.companyName,
          countryId: this.editCompanyForm.value.countryId,
          stateId: "",
          cityId: ""
        }
      )

      this.editCompanyForm.controls['stateId'].enable();
      this.editCompanyForm.controls['cityId'].disable();

    }
  }

  loadState(obj: any) {
    this.companyService.getState(obj).subscribe((res) => {
      this.allStates = res;
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

  changeCityAsPerState() {
    this.allCities = [];
    if (this.editCompanyForm.value.stateId == "") {
      this.editCompanyForm.controls['cityId'].disable()
    }
    else {
      let obj =
      {
        "StateId": this.editCompanyForm.value.stateId
      }

      this.editCompanyForm.patchValue({
        companyName: this.editCompanyForm.value.companyName,
        countryId: this.editCompanyForm.value.countryId,
        stateId: this.editCompanyForm.value.stateId,
        cityId: ""
      });

      this.loadCity(obj);
      this.editCompanyForm.value.cityId = "";
      this.editCompanyForm.controls['cityId'].enable();
    }
  }

  loadCity(obj: any) {
    this.companyService.getCity(obj).subscribe((res) => {
      this.allCities = res;
      console.log(this.allCities)
    });
  }

  editForm(): void {
    let reqObj: any = {
      "CompanyId": this.CompanyId,
      "UserId": this.userData.uid,
      "ParentCompanyId": 1,
      "CompanyCode": '',
      "CompanyName": this.editCompanyForm.value.companyName,
      "CompanyEmail": this.editCompanyForm.value.companyEmail,
      "ContactPerson": this.editCompanyForm.value.contactName,
      "ContactPersonNumber": this.editCompanyForm.value.mobileNo,
      "CreatedBy": this.userData.uid,
      "ModifiedBy": this.userData.uid,
      "Address": this.editCompanyForm.value.address,
      "Email": this.editCompanyForm.value.companyEmail,
      "Telephone": this.editCompanyForm.value.mobileNo,
      "PIN": '',
      "CityId": this.editCompanyForm.value.cityId,
      "ProductId": '',
      "IsHeadOffice": '1',
      "PartnerType": this.editCompanyForm.value.partnertype,
      "CountryId": this.editCompanyForm.value.countryId,
      "StateId": this.editCompanyForm.value.stateId,
      "IsActive": '',
      "Search": '',
      "IsAllowMac": this.isMacAllow,
      // "IsEmailOtp": this.emailOtp,
      // "IsSmsOtp": this.smsOtp
      "ClientIp":this.localStorage.getItem('ClientIp')
    }

    console.log(reqObj);

    this.companyService.updateRecord(reqObj).subscribe((res) => {
      if (res[0].STATUS == 1) {
        this.modalService.close();
        this.companyService.toasterSuccessMsg(res[0].alertmessage);
      } else {
        // this.modalService.close();
        this.companyService.toasterFailureMsg(res[0].alertmessage);
      }
    });
  }

  close(): void {
    this.modalService.close();
  }

}
