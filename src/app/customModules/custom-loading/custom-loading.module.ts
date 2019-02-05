import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingController } from '@ionic/angular';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CustomLoadingModule { 

  myloading:any;
  timeout;

  constructor(private loadingController:LoadingController){}

  async show(msg) {
    this.myloading = await this.loadingController.create({
    message:msg,
    spinner:null,
    leaveAnimation:null
    });
    this.timeout=setTimeout(()=>{
      this.myloading.dismiss();
    },10000);
    await this.myloading.present(); 
  }
  
  hide(){
    if(this.myloading){
      clearTimeout(this.timeout);
      this.myloading.dismiss();
    }
  }

}
