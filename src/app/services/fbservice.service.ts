import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FBServiceService {

  myCollection:any;
  
  constructor(private fireStore: AngularFirestore) { 
    /* Crea una referencia a la colección 'personajes' que empleamos mas adelante */

    this.myCollection = fireStore.collection<any>(environment.firebaseConfig.personajesCollection); 
  }


  
  /**
   * Recupera los 3 primeros personajes despues del que recibe por parametro 
   * 
   * @returns un promise
   */
  leePersonajesConLimite(){ 

    return this.myCollection.ref.orderBy("Nombre").limit(3).get(); 

  }

  /**
   * Recupera  todos los personajes ordenados por puntuación
   * 
   * @returns un promise
   */
  leePersonajes(){ 

    return this.myCollection.ref.orderBy("Puntuacion").get(); 

  }

  /**
   * Recupera 3 personajes despues del que recibe por parametro
   * 
   * @param ultimoPersonaje 
   * 
   * @returns un promise
   */
  leePersonajesDespuesDe(ultimoPersonaje: any){ 

    return this.myCollection.ref.orderBy("Nombre").startAfter(ultimoPersonaje).limit(3).get(); 

  }

  /**
   * 
   * Recupera todos los campos de un documento concreto identificado por la clave id de la colección 'personajes'
   * 
   * @param id 
   * 
   * @returns un promise
   */
  public getPJ(id) {
    return this.myCollection.doc(id).get();
  }


 
  /**
   * Actualiza el campo (puntuacion) determinados por el objeto data en el documento 
   * identificado por id de la colección 'personajes'
   * 
   * @param id 
   * @param data 
   * 
   * @returns un promise
   */
  actualizaPersonaje(id,data){ 
    
    return this.myCollection.doc(id).set(data); 
  
  }
  

}
