import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FBServiceService {

  myCollection:any;
  
  constructor(private fireStore: AngularFirestore) { 
    
    /* Crea una referencia a la colección 'todo' que empleamos para realizar las operaciones CRUD*/ 
    
    this.myCollection = fireStore.collection<any>(environment.firebaseConfig.personajesCollection); 
  }
  
  /* Recibe un objeto y lo guarda como un documento nuevo en la colección 'todo' Devuelve un Promise */ 
  
  agregaPersonaje(datos){ 
    
    return this.myCollection.add(datos); 
  
  } 
  
  leePersonajesConLimite(){ 

    return this.myCollection.ref.orderBy("Nombre").limit(3).get(); 

  }

  leePersonajes(){ 

    return this.myCollection.ref.orderBy("Puntuacion").get(); 

  }

  leePersonajesDespuesDe(ultimoPersonaje: any){ 

    return this.myCollection.ref.orderBy("Nombre").startAfter(ultimoPersonaje).limit(3).get(); 

  }

  /* Recupera todos los campos de un documento concreto identificado por la clave id de la colección 'todo' Devuelve un Observable */ 

  public getPJ(id) {
    return this.myCollection.doc(id).get();
  }



  /* Actualiza los campos (sobreescribe y añade) determinados por el objeto data en el documento 
  identificado por id de la colección 'todo' Devuelve un Promise */ 
  
  actualizaPersonaje(id,data){ 
    
    return this.myCollection.doc(id).set(data); 
  
  }
  
  /* Sin desarrollar aún */ 
  
  leeNotasegunCriterio(){ 
    
    /*Aquí podriamos insertar una selección con where: .where("capital", "==", true).get() */ 
  
  } 
  
  /* Elimina el documento identificado por id de la colección 'todo' Devuelve un Promise */ 
  
  borraNota(id){ 
    
    return this.myCollection.doc(id).delete(); 
  
  }

}
