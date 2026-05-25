import {
  auth,
  db
}
from "./firebase-config.js";

import {

  clearAdminSession,

  saveAdminSession

}
from "./shared-config.js";

import {

  onAuthStateChanged

}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {

  doc,
  getDoc

}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(

  auth,

  async function(user){

    /* NOT LOGGED IN */

    if(!user){

      clearAdminSession();

      window.location.href =
      "admin-login.html";

      return;

    }

    try{

      /* LOAD ADMIN PROFILE */

      const adminDoc =
      await getDoc(

        doc(
          db,
          "districtAdmins",
          user.uid
        )

      );

      /* PROFILE NOT FOUND */

      if(!adminDoc.exists()){

        clearAdminSession();

        window.location.href =
        "admin-login.html";

        return;

      }

      const adminData =
      adminDoc.data();

      /* SAVE SESSION */

      saveAdminSession(

        adminData.district,

        adminData.vehicleCategory,

        adminData.serviceProvider

      );

    }

    catch(error){

      console.log(error);

      clearAdminSession();

      window.location.href =
      "admin-login.html";

    }

  }

);