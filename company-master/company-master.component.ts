import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CompanyService } from './company.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Company } from './company';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCompanyComponent } from './add-company/add-company.component';
import { DatePipe } from '@angular/common';
import { NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-company-master',
  templateUrl: './company-master.component.html',
  styleUrls: ['./company-master.component.scss'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class CompanyMasterComponent implements OnInit {

  headerData: any = [];
  allCountries: any = [];
  allStates: any = [];
  allCities: any = [];
  addCompanyForm: FormGroup;
  partnerTypeForm: FormGroup;
  mailConfigureForm: FormGroup;
  smsConfigureForm: FormGroup;
  whatsappConfigureForm: FormGroup;
  skypeConfigureForm: FormGroup;
  childdata: any;
  companyData: any = [];
  checkedValue: any = 0;
  userData: any = {};
  CompanyId: any;
  c_Name: string = '';
  c_Id: any;
  partnerTypeList: any = [];
  companyName: any;
  todayDate: any;
  imageUrl: any;
  imageData: any;
  imgUploadCheck: boolean = false;

  validationMessage = {
    'country': [
      { type: 'required', message: 'Country Is Required' }
    ],
    'partnerType': [
      { type: 'required', message: 'Type Is Required' }
    ],
    'date': [
      { type: 'required', message: 'Date Is Required' }
    ]
  }

  constructor(
    private localStorage: LocalStoreService,
    public http: HttpClient,
    private companyService: CompanyService,
    private modalService: NgbModal,
    private auth: AuthService) {
    this.userData = this.auth.getuser();
  }

  ngOnInit() {
    this.headerData = ['Company Code', 'Company', 'Parent Company', 'Address', 'Email', 'City', 'State', 'Country'];
    let date = new Date();
    this.todayDate = { "year": date.getFullYear(), "month": (date.getMonth() + 1), "day": date.getDate() };
    this.imageUrl = 'assets/images/default.png';

    this.addCompanyForm = new FormGroup({
      'countryId': new FormControl(''),
      'stateId': new FormControl(''),
      'cityId': new FormControl('')
    });

    this.partnerTypeForm = new FormGroup({
      'country': new FormControl('', [Validators.required]),
      'partnerType': new FormControl('', [Validators.required]),
      'date': new FormControl('', [Validators.required]),
      'exclusiveCheck': new FormControl()
    });

    this.mailConfigureForm = new FormGroup({
      'mailServerName': new FormControl(),
      'mailServerPort': new FormControl(),
      'mailUserName': new FormControl(),
      'mailPassword': new FormControl(),
      'mailSenderName': new FormControl(),
      'mailFromName': new FormControl(),
      'mailIsEnambledSSL': new FormControl()
    });

    this.smsConfigureForm = new FormGroup({
      'smsUrl': new FormControl(),
      'smsCountryCode': new FormControl(),
    });

    this.whatsappConfigureForm = new FormGroup({
      'whatsappUrl': new FormControl(),
      'whatsappCountryCode': new FormControl(),
    });

    this.skypeConfigureForm = new FormGroup({
      'skypeUrl': new FormControl(),
    });

    this.loadCountry();
    this.getCompanyList();
  }

  get details() {
    return this.addCompanyForm.controls;
  }

  get pType() {
    return this.partnerTypeForm.controls;
  }

  loadCountry() {
    this.companyService.getCountry().subscribe((res: Company) => {
      this.allCountries = res;
    }, err => {
      if (err) {
        this.allCountries = [];
      }
    });
  }

  loadState(obj: any) {
    this.companyService.getState(obj).subscribe((res: Company) => {
      this.allStates = res;
    });
  }

  loadCity(obj: any) {
    this.companyService.getCity(obj).subscribe((res: Company) => {
      this.allCities = res;
    });
  }

  changeStateAsPerCountry() {
    this.allStates = [];
    this.allCities = [];
    if (this.addCompanyForm.value.countryId == "") {
      this.addCompanyForm.controls['stateId'].disable();
      this.addCompanyForm.controls['cityId'].disable();
    }
    else {
      let obj = {
        "CountryId": this.addCompanyForm.value.countryId
      }
      this.loadState(obj);
      this.addCompanyForm.setValue({
        countryId: this.addCompanyForm.value.countryId,
        stateId: "",
        cityId: ""
      })

      this.addCompanyForm.controls['stateId'].enable();
      this.addCompanyForm.controls['cityId'].disable();

    }
  }

  changeCityAsPerState() {
    this.allCities = [];
    if (this.addCompanyForm.value.stateId == "") {
      this.addCompanyForm.controls['cityId'].disable()
    }
    else {
      let obj =
      {
        "StateId": this.addCompanyForm.value.stateId
      }
      this.loadCity(obj);

      this.addCompanyForm.setValue(
        {
          countryId: this.addCompanyForm.value.countryId,
          stateId: this.addCompanyForm.value.stateId,
          cityId: ""
        }
      )

      this.addCompanyForm.value.cityId = "";
      this.addCompanyForm.controls['cityId'].enable()
    }
  }
  getCompanyList() {
    this.companyData = [];
    var obj: any = {
      "ChildId": this.userData.cid,
      "CountryId": this.addCompanyForm.value.countryId,
      "StateId": this.addCompanyForm.value.stateId,
      "CityId": this.addCompanyForm.value.cityId
    }
    this.companyService.getGridData(obj).subscribe((res: any) => {
      if (res.length == "0" || res[0].STATUS == "0") {
        return false;
      }
      this.companyData = res;
    });
  }

  addPartnerType() {
    let reqObj: any = {
        "CompanyId":  this.c_Id,
        "CreatedBy": this.userData.uid,
        "ModifiedBy": this.userData.uid,
        "CountryId": this.partnerTypeForm.value.country,
        "PartnerType": this.partnerTypeForm.value.partnerType,
        "StartDate" : this.partnerTypeForm.value.date,
        "IsActive": 1,
        "IsExclusiveRight" : this.checkedValue,
        "ClientIp":this.localStorage.getItem('ClientIp')   
      }
      console.log(reqObj);

    this.companyService.insertPartnerType(reqObj).subscribe((res: any) => {
      if (res[0].STATUS == "1") {
        this.getPartnerTypeList();
        this.companyService.toasterSuccessMsg(res[0].alertmessage);
      } else {
        this.companyService.toasterFailureMsg(res[0].alertmessage);
      }
    });
  }

  getPartnerTypeList(): void {
    this.partnerTypeList = [];
    let reqObj: any = {
      "CompanyId": this.c_Id,
    }

    this.companyService.getPartnerTypeList(reqObj).subscribe((res: any) => {
      if (res[0].STATUS == "0" || res.length == 0) {
        return false;
      }
      this.partnerTypeList = res;
      console.log(res);
    });
  }

  deletePartnerType(content: string, obj: any, _index: any): void {
      console.log(obj);
      let reqObj: any = {
        "CCMId" : obj.CCMId,
        "ModifiedBy": this.userData.uid,
        "ClientIp":this.localStorage.getItem('ClientIp')
      }
      console.log(reqObj);
      if (_index !== -1) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop : 'static', keyboard : false, centered: true })
          .result.then((result) => {
            this.companyService.deletePartnerType(reqObj).subscribe((res: any) => {
              console.log(res);
              if (res[0].STATUS == "1") {
                this.getPartnerTypeList();
                this.companyService.toasterSuccessMsg(res[0].alertmessage);
              } else {
                this.companyService.toasterFailureMsg(res[0].alertmessage);
              }
          }, (reason) => {
            // this.confirmResut = `Dismissed with: ${reason}`;
          });
        });
    }
  }

  addMailConfigure(): void {
    let mConnfig: any = this.mailConfigureForm.value;
    if (mConnfig.mailFromName || mConnfig.mailIsEnambledSSL || mConnfig.mailPassword || mConnfig.mailSenderName || mConnfig.mailServerName || mConnfig.mailServerPort || mConnfig.mailUserName) {
      let reqObj: any = {
        "CompanyId": this.c_Id || '',
        "CreatedBy": this.userData.uid,
        "ServerName": mConnfig.mailServerName,
        "ServerPort": mConnfig.mailServerPort,
        "UserName": mConnfig.mailUserName,
        "Password": mConnfig.mailPassword,
        "SendingFrom": mConnfig.mailSenderName,
        "FromName": mConnfig.mailFromName,
        "IsEnableSSL": mConnfig.mailIsEnambledSSL,
        "ModifiedBy": this.userData.uid,
        "ClientIp":this.localStorage.getItem('ClientIp')  
        }
       this.companyService.insertMailConfig(reqObj).subscribe((res: any) => {
        if (res[0].STATUS == "1") {
          this.modalService.dismissAll();
          this.companyService.toasterSuccessMsg(res[0].alertmessage);
        } else {
          this.companyService.toasterFailureMsg(res[0].alertmessage);
        }
      });
    } else {
      this.companyService.toasterFailureMsg("Empty entry is not allowed");
    }
  }

  addSmsConfigure(): void {
    let sConnfig: any = this.smsConfigureForm.value;
    if(sConnfig.smsUrl || sConnfig.smsCountryCode) {
        let reqObj: any = {
          "CompanyId":  this.c_Id,
          "MethodType": "POST",
          "GetwayUrl": sConnfig.smsUrl,
          "CountryCode": sConnfig.smsCountryCode,
          "IsDefault": "1",
          "ClientIp":this.localStorage.getItem('ClientIp'),
          "CreatedBy": this.userData.uid
         }
         console.log(reqObj);
        this.companyService.insertSmsConfig(reqObj).subscribe((res: any) => {
         console.log(res);
         if (res[0].STATUS == "1") {
           this.modalService.dismissAll();
           this.smsConfigureForm.reset();
           this.companyService.toasterSuccessMsg(res[0].alertmessage);
         } else {
           this.companyService.toasterFailureMsg(res[0].alertmessage);
         }
       }); 
     } else {
       this.companyService.toasterFailureMsg("Empty entry is not allowed");
     }
  }

  getMailConfigDetails(): void {
    console.log(this.c_Id);
    var obj: any = {
      "CompanyId": this.c_Id,
    }
    this.companyService.getMailConfigDetails(obj).subscribe((res: any) => {
      console.log(res);
      if (res[0].STATUS == "0") {
        return false;
      }
      this.mailConfigureForm.patchValue({
        "mailServerName": res[0].ServerName,
        "mailServerPort": res[0].ServerPort,
        "mailUserName": res[0].UserName,
        "mailPassword": res[0].Password,
        "mailSenderName": res[0].SendingFrom,
        "mailFromName": res[0].FromName,
        "mailIsEnambledSSL": res[0].IsEnableSsl
      });
    });
  }

  getSmsConfigDetails(): void {
    var obj: any = {
      "CompanyId": this.c_Id,
    }
    this.companyService.getSmsConfigDetails(obj).subscribe((res: any) => {
      console.log(res);
      if (res[0].STATUS == "0") {
        return false;
      }
      this.smsConfigureForm.patchValue({
        "smsUrl": res[0].GetwayUrl,
        "smsCountryCode": res[0].CountryCode
      });
    });
  }

  getWhatsappConfigDetails(): void {
    var obj: any = {
      "CompanyId": this.c_Id,
    }
    this.companyService.getWhatsappConfigDetails(obj).subscribe((res: any) => {
      console.log(res);
        if (res[0].STATUS == "0") {
          return false;
        }
        this.whatsappConfigureForm.patchValue({
          'whatsappUrl': res[0].WhatsappUrl,
          'whatsappCountryCode': res[0].CountryCode,
        });
    });
  }

  addWhatsappConfigure(): void {
      let wConnfig: any = this.whatsappConfigureForm.value;
      if(wConnfig.whatsappUrl || wConnfig.whatsappCountryCode) {
          let reqObj: any = {
            "CompanyId":  this.c_Id,
            "MethodType": "GET",
            "WhatsappUrl": this.whatsappConfigureForm.value.whatsappUrl,
            "CountryCode": this.whatsappConfigureForm.value.whatsappCountryCode,
            "IsDefault": "1",
            "ClientIp":this.localStorage.getItem('ClientIp'),
            "CreatedBy": this.userData.uid
           }
           console.log(reqObj)
          this.companyService.insertWhatsappConfig(reqObj).subscribe((res: any) => {
           console.log(res);
           if (res[0].STATUS == "1") {
             this.modalService.dismissAll();
             this.whatsappConfigureForm.reset();
             this.companyService.toasterSuccessMsg(res[0].alertmessage);
           } else {
             this.companyService.toasterFailureMsg(res[0].alertmessage);
           }
         }); 
       } else {
         this.companyService.toasterFailureMsg("Empty entry is not allowed");
       }
  }

  addSkypeConfigure(): void {
    console.log(this.skypeConfigureForm.value)
  }


  checkdValue(val: any): void {
    this.checkedValue = val;
  }

  fnConfigureCompany(content: string, company: any) {
    console.log(company);
    this.c_Name = company.CompanyName;
    this.c_Id = company.CompanyId;
    this.getMailConfigDetails();
    this.getSmsConfigDetails();
    this.getWhatsappConfigDetails();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: 'static', keyboard: false, centered: true })
      .result.then((result) => {
      }, (reason) => {
      });
  }

  fnMapCompany(content: string, company: any) {
    this.partnerTypeForm.reset();
    this.c_Name = company.CompanyName;
    this.c_Id = company.CompanyId;
    this.getPartnerTypeList();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: 'static', keyboard: false, centered: true })
      .result.then((result) => {
        this.getPartnerTypeList();
      }, (reason) => {
      });
  }

  fnUploadLogo(content: any, company: any) {
    this.imgUploadCheck = false;
    this.c_Id = company.CompanyId;
    this.getLogo(this.c_Id);
    this.imageUrl = 'assets/images/default.png';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, centered: true })
    .result.then((result) => {
      this.getPartnerTypeList();
    }, (reason) => {
    });
  }
  
  previewImg(imgData: any) {
      if (imgData.target.files.length === 0) {
        this.imgUploadCheck = false;
        return;
      }
      var reader = new FileReader();
      this.imageData = imgData.target.files[0];
      if(imgData.target.files.length) {
        this.imgUploadCheck = true;
      }
      reader.readAsDataURL(imgData.target.files[0]); 
      reader.onload = (_event) => { 
        this.imageUrl = reader.result; 
      }
  }

  uploadImg() {
    const formData = new FormData();
    formData.append("Image", this.imageData,this.imageData.name);
    formData.append("CompanyId", this.c_Id);
    formData.append("CreatedBy", this.userData.uid);
    this.companyService.postImage(formData).subscribe(res => {
      console.log(res);
      if (res[0].STATUS == "1") {
        this.modalService.dismissAll();
        this.companyService.toasterSuccessMsg(res[0].alertmessage);
      } else {
        this.companyService.toasterFailureMsg(res[0].alertmessage);
      }
    })
  }

  getLogo(cid: any) {
    let reqObj: any = {
      "CompanyId": cid
    }
    this.companyService.getImage(reqObj).subscribe(res => {
      console.log(res);
      if(res[0].logopath) {
        this.imageUrl = environment.imageUrl + res[0].logopath;
      } else {
        this.imageUrl = 'assets/images/default.png';
      }
    }, err => {
       this.imageUrl = 'assets/images/default.png';
    })
  }

  addCompany(): void {
    const modalRef = this.modalService.open(AddCompanyComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: 'static', keyboard: false, centered: true });
    modalRef.result.then((result) => {
      this.getCompanyList();
    }).catch((error) => {
      // this.getCompanyList();
    });
  }

  editCompany(company: any): void {
    const modalRef = this.modalService.open(EditCompanyComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: 'static', keyboard: false, centered: true });
    modalRef.componentInstance.CompanyId = company.CompanyId;
    modalRef.result.then((result) => {
      this.getCompanyList();
    }).catch((error) => {
    });
  }

}

