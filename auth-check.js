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

  collection,
  getDocs,
  query,
  where

}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

/* =========================
   AUTH CHECK
========================= */

onAuthStateChanged(

  auth,

  async function(user){

    if(!user){

      clearAdminSession();

      window.location.href =
      "admin-login.html";

      return;

    }

    try{

      const adminQuery = query(

        collection(
          db,
          "districtAdmins"
        ),

        where(
          "email",
          "==",
          user.email
        )

      );

      const adminSnapshot =
      await getDocs(
        adminQuery
      );

      if(adminSnapshot.empty){

        clearAdminSession();

        window.location.href =
        "admin-login.html";

        return;

      }

      const adminData =
      adminSnapshot.docs[0].data();

      saveAdminSession(

        adminData.districtID,

        adminData.vehicleID,

        adminData.providerID

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