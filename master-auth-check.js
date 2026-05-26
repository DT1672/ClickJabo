import {
  auth,
  db
}
from "./firebase-config.js";

import {

  onAuthStateChanged

}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {

  doc,
  getDoc

}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

onAuthStateChanged(

  auth,

  async (user) => {

    if(!user){

      window.location.href =
      "master-login.html";

      return;

    }

    try{

      const masterDoc =

      await getDoc(

        doc(
          db,
          "masterAdmins",
          "master"
        )

      );

      if(!masterDoc.exists()){

        window.location.href =
        "master-login.html";

        return;

      }

      const masterData =
      masterDoc.data();

      if(
        masterData.role !==
        "master"
      ){

        window.location.href =
        "master-login.html";

      }

    }

    catch(error){

      console.log(error);

      window.location.href =
      "master-login.html";

    }

  }

);