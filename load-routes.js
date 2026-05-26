import {
  db
}
from "./firebase-config.js";

import {
  collection,
  getDocs,
  query,
  where
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

async function loadRoutes(){

  try{

    const routesQuery = query(

      collection(
        db,
        "routes"
      ),

      where(
        "district",
        "==",
        "Dimapur"
      ),

      where(
        "vehicleCategory",
        "==",
        "Taxi"
      ),

      where(
        "serviceProvider",
        "==",
        "Dimapur Taxi Association"
      )

    );

    const querySnapshot =
    await getDocs(
      routesQuery
    );

    querySnapshot.forEach(docSnap => {

      console.log(
        docSnap.data()
      );

    });

  }

  catch(error){

    console.log(error);

  }

}

loadRoutes();