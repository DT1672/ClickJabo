import {
  db
}
from "./firebase-config.js";

import {
  collection,
  getDocs
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

async function loadRoutes(){

  const querySnapshot =
  await getDocs(

    collection(
      db,
      "routes"
    )

  );

  querySnapshot.forEach(doc => {

    console.log(
      doc.data()
    );

  });

}

loadRoutes();