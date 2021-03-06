import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { FBServiceService } from '../services/fbservice.service';
import { UseExistingWebDriver } from 'protractor/built/driverProviders';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {


  @Input() IDpersonaje: string;

  @Input() vrating: any;

  @Output() ratingChange: EventEmitter<number> = new EventEmitter();

  puntuacionGuardada = 0;

  private myloading:any;

  public data = { 
    Descripcion: "descripcion",  
    Imagen: "imagen",
    Nombre: "nombre", 
    Puntuacion: 0
    
  };


  constructor(private nativeStorage: NativeStorage,
    private FBService: FBServiceService,
    private loadingController: LoadingController,
    private toastCtrl: ToastController) {
      
   }


   // Guardamos la informacion del personaje que corresponde este componente, ademas de buscar en el 
   // almacenamiento local si se encuentra informacion de este
  ngOnInit() {

      this.FBService.getPJ(this.IDpersonaje)
      .subscribe((pj:any) => {

        this.data.Descripcion = pj.data().Descripcion,
        this.data.Imagen = pj.data().Imagen,
        this.data.Nombre = pj.data().Nombre,
        this.data.Puntuacion = pj.data().Puntuacion

        console.log("Recuperando datos de " + pj.data().Nombre + "de firebase");

        this.nativeStorage.getItem(this.data.Nombre)
        .then(
          data => {

            console.log("Recuperando puntuacion " + this.data.Nombre + " de NativeStorage: " + data.puntuacion);

            this.vrating = data.puntuacion;

            this.puntuacionGuardada = this.vrating;

            this.ratingChange.emit(this.vrating);

          },
          error => console.log(error)
        );

        
      });

    }

    async presentToastWithOptions(msg) {
      const toast = await this.toastCtrl.create({
        message: msg,
        showCloseButton: true,
        position: 'bottom',
        closeButtonText: 'Ok',
        duration: 5000
      });
      toast.present();
    }

  /**
   * 
   * @param NuevaPuntuacion 
   * 
   * Puntua al personaje, actualiz el personaje en la base de datos y en local
   */
  rate(NuevaPuntuacion: number){

    this.myloading = this.presentLoading(); 

      this.vrating = NuevaPuntuacion;

      this.data.Puntuacion += - (this.puntuacionGuardada - NuevaPuntuacion);

      this.FBService.actualizaPersonaje(this.IDpersonaje, this.data).then(() => {

      console.log("Documento de " + this.data.Nombre + " actualizado exitósamente");

      this.nativeStorage.setItem(this.data.Nombre, {puntuacion: this.vrating})
      .then(
        () => this.puntuacionGuardada = NuevaPuntuacion,
        error => console.error('Error storing item', error)
      );

        console.log("Actualizando puntuacion  de" + this.data.Nombre + ": "  + this.vrating);

        this.ratingChange.emit(this.vrating);

        this.loadingController.dismiss();

        this.presentToastWithOptions(this.data.Nombre + " actualizado");

      }, (error) => {
        console.log(error);

        this.loadingController.dismiss();
      });

  }

  /**
   * Devuelve el color de la estrella basado en el indice
   * 
   * @param index 
   */

  getColor(index: number) {
    if(this.isAboveRating(index)){
      return COLORS.GREY;
    }

    switch(this.vrating){
      case 1:
      case 2:
        return COLORS.RED;
      case 3:
        return COLORS.YELLOW;
      case 4:
      case 5:
        return COLORS.GREEN;
      default:
        return COLORS.GREY;
    }

  }

  /**
   * Devuelve si el index seleccionado esta por encima del rating actual
   */
  isAboveRating(index: number): boolean {
    return index> this.vrating;
  }

  async presentLoading() {
    this.myloading = await this.loadingController.create({
    message: "Cargando" });
    await this.myloading.present(); 
  }


}

enum COLORS {
  GREY = "#E0E0E0",
  GREEN = "#76FF03",
  YELLOW = "#FFCA28",
  RED = "#DD2C00"
}
