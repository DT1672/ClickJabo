import {
  auth
}
from "./firebase-config.js";

import {
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
  db
}
from "./firebase-config.js";

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
      "admin-login.html";

      return;

    }

    try{

      const adminDoc =
      await getDoc(

        doc(
          db,
          "districtAdmins",
          user.uid
        )

      );

      if(
        !adminDoc.exists()
      ){

        window.location.href =
        "subscription-expired.html";

        return;

      }

      const adminData =
      adminDoc.data();

      if(
        adminData.isActive !== true
      ){

        window.location.href =
        "subscription-expired.html";

        return;

      }

      const now =
      new Date();

      const expiryDate =
      adminData.expiryDate.toDate();

      if(
        now > expiryDate
      ){

        window.location.href =
        "subscription-expired.html";

        return;

      }

    }

    catch(error){

      console.log(error);

      window.location.href =
      "subscription-expired.html";

    }

  }

);