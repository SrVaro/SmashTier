import { Component, ViewChild, Input } from '@angular/core';
import { FBServiceService } from '../services/fbservice.service';
import { Router } from '@angular/router';
import { IonSlides, IonInfiniteScroll, LoadingController, ToastController } from '@ionic/angular';
import * as CanvasJS from '../../assets/canvasjs-2.2/canvasjs.min.js';
import { RatingComponent } from '../rating/rating.component';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { CustomLoadingModule } from '../customModules/custom-loading/custom-loading.module';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {


    @ViewChild('dynamicList') dynamicList;
    @ViewChild('SwipedTabsSlider') SwipedTabsSlider: IonSlides;
    @ViewChild('infiniteScroll') ionInfiniteScroll: IonInfiniteScroll;

    SwipedTabsIndicator: any = null;
    tabs = ["selectTab(0)", "selectTab(1)"];
    public category: any = "0";
    ntabs = 2;

    listado=[];
    nombrePersonajes=[];
    listadoPanel=[];

    private myloading:any;

    tamañoLista: number;

    IDUltimoPersonaje: string;

    listadoPuntuaciones = [];

    chartCargada: boolean;


    constructor(
      private FBService: FBServiceService,
      private router: Router,
      private nativeStorage: NativeStorage,
      private loadingController: LoadingController,
      private toastCtrl: ToastController,
      private translate: TranslateService
    ){
      this.chartCargada = false;
    }


    // Obtenemos los 3 personajes siguientes despues del ultimo almacenado    
    loadData(event) {
      setTimeout(() => {
        event.target.complete();
        
        this.FBService.leePersonajesDespuesDe(this.IDUltimoPersonaje)
        .then((d) => {
          d.forEach((u) => {
  
            console.log(u);
  
            this.listado.push( { id: u.id, ...u.data() });

            // Controlamos el tamaño de la lista
            this.tamañoLista++;
            
            this.nombrePersonajes.push(u.data().Nombre);
            
            // En esta variable se ira guardando el ultimo personaje guardado
            this.IDUltimoPersonaje = u.data().Nombre;
  
          });
  
          this.listadoPanel = this.listado;


        })

        if (this.listadoPanel.length == this.tamañoLista) {
          event.target.disabled = true;
        }
        
        
      }, 1000);

      this.presentToastWithOptions(this.translate.instant("CharactersLoaded"));
    }

    toggleInfiniteScroll() {
      this.ionInfiniteScroll.disabled = !this.ionInfiniteScroll.disabled;
    }

    async presentLoading() {
      this.myloading = await this.loadingController.create({
      message: this.translate.instant("Loading") });
      await this.myloading.present(); 
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

    ionViewDidEnter(){

      this.myloading = this.presentLoading(); 
      console.log("ionViewDidEnter");

      this.listado=[];

      this.FBService.leePersonajesConLimite()
      .then((d) => {
        d.forEach((u) => {

          console.log(u);

          this.listado.push( { id: u.id, ...u.data() });

          this.tamañoLista++;
          
          this.nombrePersonajes.push(u.data().Nombre);

          this.IDUltimoPersonaje = u.data().Nombre;

        });

        this.loadingController.dismiss();

      })

      this.listadoPanel = this.listado;

      this.SwipedTabsIndicator = document.getElementById("indicator");

     
      
    }

    ionViewWillEnter() {
      this.category = "0";
      this.SwipedTabsSlider.length().then(l => {  //no sería necesario aquí, solo en ngOnInit
        this.ntabs = l;
      });
    }

    updateReq(event?) {
    if (!event)  

      this.myloading = this.presentLoading(); 

      this.listadoPuntuaciones = [];

      this.FBService.leePersonajes()
      .then((d) => {
        d.forEach((u) => {

          this.listadoPuntuaciones.push( { id: u.id, ...u.data()});

          

        });

        let chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          title: {
            text: "Tier List"
          },
          axisX: {
            interval: 1
          },
          axisY: {
            title: "Points",
            scaleBreaks: {
              type: "wavy",
              customBreaks: [{
                startValue: 80,
                endValue: 210
                },
                {
                  startValue: 230,
                  endValue: 600
                }
            ]}
          },
          data: [{
            type: "bar",
            toolTipContent: "",
            dataPoints: [
              
              { label: this.listadoPuntuaciones[0].Nombre, y: this.listadoPuntuaciones[0].Puntuacion, gdp: this.listadoPuntuaciones[0].Puntuacion, url: "uae.png" },
              { label: this.listadoPuntuaciones[1].Nombre, y: this.listadoPuntuaciones[1].Puntuacion, gdp: this.listadoPuntuaciones[1].Puntuacion, url: "brazil.png"},
              { label: this.listadoPuntuaciones[2].Nombre, y: this.listadoPuntuaciones[2].Puntuacion, gdp: this.listadoPuntuaciones[2].Puntuacion, url: "australia.png" },
              { label: this.listadoPuntuaciones[3].Nombre, y: this.listadoPuntuaciones[3].Puntuacion, gdp: this.listadoPuntuaciones[3].Puntuacion, url: "skorea.png" },
              { label: this.listadoPuntuaciones[4].Nombre, y: this.listadoPuntuaciones[4].Puntuacion, gdp: this.listadoPuntuaciones[4].Puntuacion, url: "israel.png" },
              { label: this.listadoPuntuaciones[5].Nombre, y: this.listadoPuntuaciones[5].Puntuacion, gdp: this.listadoPuntuaciones[5].Puntuacion, url: "germany.png" },
              { label: this.listadoPuntuaciones[6].Nombre, y: this.listadoPuntuaciones[6].Puntuacion, gdp: this.listadoPuntuaciones[6].Puntuacion, url: "japan.png" }
            ]
          }]
        });
        chart.render();
        
        
        })

        this.loadingController.dismiss();

      if (event) {
        event.target.complete();
      }
  }

  /* Actualiza la categoría que esté en ese momento activa*/
  updateCat(cat: Promise<any>) {
    cat.then(dat => {
      this.category = dat;
      this.category = +this.category; //to int;
    });
  }
  /* El método que permite actualizar el indicado cuando se cambia de slide*/
  updateIndicatorPosition() {
    this.SwipedTabsSlider.getActiveIndex().then(i => {
      if (this.ntabs > i) {  // this condition is to avoid passing to incorrect index
        this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' + (i * 100) + '%,0,0)';
      }
    });

    // Se dibuja los graficos la primera vez que se pase al segundo slide

    if(!this.chartCargada){


      //Se cargan todos los datos de la base de datos y posteriormente se muestran en la grafica
      this.myloading = this.presentLoading(); 

      this.listadoPuntuaciones = [];

      this.FBService.leePersonajes()
      .then((d) => {
        d.forEach((u) => {

          this.listadoPuntuaciones.push( { id: u.id, ...u.data()});

          

        });

        this.loadingController.dismiss();

        let chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          title: {
            text: "Tier List"
          },
          axisX: {
            interval: 1
          },
          axisY: {
            title: "Points",
            scaleBreaks: {
              type: "wavy",
              customBreaks: [{
                startValue: 80,
                endValue: 210
                },
                {
                  startValue: 230,
                  endValue: 600
                }
            ]}
          },
          data: [{
            type: "bar",
            toolTipContent: "",
            dataPoints: [
              
              { label: this.listadoPuntuaciones[0].Nombre, y: this.listadoPuntuaciones[0].Puntuacion, gdp: this.listadoPuntuaciones[0].Puntuacion, url: "uae.png" },
              { label: this.listadoPuntuaciones[1].Nombre, y: this.listadoPuntuaciones[1].Puntuacion, gdp: this.listadoPuntuaciones[1].Puntuacion, url: "brazil.png"},
              { label: this.listadoPuntuaciones[2].Nombre, y: this.listadoPuntuaciones[2].Puntuacion, gdp: this.listadoPuntuaciones[2].Puntuacion, url: "australia.png" },
              { label: this.listadoPuntuaciones[3].Nombre, y: this.listadoPuntuaciones[3].Puntuacion, gdp: this.listadoPuntuaciones[3].Puntuacion, url: "skorea.png" },
              { label: this.listadoPuntuaciones[4].Nombre, y: this.listadoPuntuaciones[4].Puntuacion, gdp: this.listadoPuntuaciones[4].Puntuacion, url: "israel.png" },
              { label: this.listadoPuntuaciones[5].Nombre, y: this.listadoPuntuaciones[5].Puntuacion, gdp: this.listadoPuntuaciones[5].Puntuacion, url: "germany.png" },
              { label: this.listadoPuntuaciones[6].Nombre, y: this.listadoPuntuaciones[6].Puntuacion, gdp: this.listadoPuntuaciones[6].Puntuacion, url: "japan.png" }
            ]
          }]
        });
        chart.render();
        
        
        })

        this.chartCargada = true;
        
    }
  }
  /* El método que anima la "rayita" mientras nos estamos deslizando por el slide*/
  animateIndicator(e) {
    //console.log(e.target.swiper.progress);
    if (this.SwipedTabsIndicator)
      this.SwipedTabsIndicator.style.webkitTransform = 'translate3d(' +
        ((e.target.swiper.progress * (this.ntabs - 1)) * 100) + '%,0,0)';
  }
    
  

  }
  

