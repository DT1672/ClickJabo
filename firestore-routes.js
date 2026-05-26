import {
  db
}
from "./firebase-config.js";

import {
  collection,
  addDoc,
  serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

async function addRoute(){

  try{

    await addDoc(

      collection(
        db,
        "routes"
      ),

      {

        district:
        "Dimapur",

        vehicleCategory:
        "Taxi",

        serviceProvider:
        "Dimapur Taxi Association",

        from:
        "Rail Gate",

        to:
        "City Tower",

        hireDay:
        200,

        hireNight:
        250,

        sharedDay:
        50,

        sharedNight:
        70,

        tempHireDay:
        0,

        tempHireNight:
        0,

        tempSharedDay:
        0,

        tempSharedNight:
        0,

        createdAt:
        serverTimestamp(),

        updatedAt:
        serverTimestamp()

      }

    );

    console.log(
      "Route Added"
    );

  }

  catch(error){

    console.log(
      error
    );

  }

}

addRoute();