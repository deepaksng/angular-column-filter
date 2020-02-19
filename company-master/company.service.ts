import { AppService } from '../../app.service';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  resultArray : any = [];

  constructor(private httpService: AppService, private toaster: ToastrService) {
     
   }

   getCountry() {
      return this.httpService.get('/User/BindCountry');
    }

    getState(obj: any) {
      return this.httpService.post( '/User/BindState', obj);
    }

    getCity(obj: any) {
      return this.httpService.post('/User/BindCity', obj);
    }
    
    getGridData(reqObject: any) {
        return this.httpService.post('/Company/BindGridData', reqObject );
    }

    getChildDetails(reqObj: any) {
      return this.httpService.post('/Company/FetchChildByCompany', reqObj);
    }

    saveRecord(obj: any) {
      return this.httpService.post('/Company/InsertCompany', obj);
    }

    fetchRecord(obj: any) {
      return this.httpService.post('/Company/FetchRecordById', obj);
    }

    updateRecord(obj: any) {
      return this.httpService.post('/Company/UpdateCompany', obj);
    }
    
    insertPartnerType(reqObj: any) {
      return this.httpService.post('/Company/InsertType', reqObj)
    }

    getPartnerTypeList(reqObj: any) {
      return this.httpService.post('/Company/ListPartnerMapping', reqObj);
    }

    deletePartnerType(reqObj: any) {
      return this.httpService.post('/Company/Delete', reqObj);
    }

    insertMailConfig(reqObj: any) {
      return this.httpService.post('/Company/InsertMailConfig', reqObj);
    }
  
    getMailConfigDetails(reqObj: any) {
      return this.httpService.post('/Company/SelectMailConfig', reqObj);
    }

    insertSmsConfig(reqObj: any) {
      return this.httpService.post('/Company/InsertSMSConfig', reqObj);
    }

    getSmsConfigDetails(reqObj: any) {
      return this.httpService.post('/Company/SelectSMSConfig', reqObj);
    }

    insertWhatsappConfig(reqObj: any) {
      return this.httpService.post('/Company/InsertWhatsAppConfig', reqObj);
    }

    getWhatsappConfigDetails(reqObj: any) {
      return this.httpService.post('/Company/SelectWhatsAppConfig', reqObj);
    }

    postImage(reqObj: any) {
      return this.httpService.post('/Company/UploadLogo', reqObj);
    }

    getImage(reqObj: any) {
      return this.httpService.post('/Company/FetchLogo', reqObj)
    }

    // insertSkypeConfig(reqObj: any) {
    //   return this.httpService.post('', reqObj);
    // }
    
     /* ---------------------------------------------------------  Error messages  ---------------------------------------------------------*/

    toasterSuccessMsg(msg: string) {
      return this.toaster.success('success!', msg, { timeOut: 3000, closeButton: true, progressBar: true });
    }

    toasterFailureMsg(msg: string) {
      return this.toaster.error('error!', msg, { timeOut: 3000, closeButton: true, progressBar: true });
    }
    
  }