import {
  db
}
from "./firebase-config.js";

import {
  collection,
  addDoc
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
        70

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