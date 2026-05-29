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
  collection,
  getDocs,
  query,
  where
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

        window.location.href =
        "subscription-expired.html";

        return;

      }

      const adminData =
      adminSnapshot.docs[0].data();

      if(
        adminData.isActive !== true
      ){

        window.location.href =
        "subscription-expired.html";

        return;

      }

      if(
        adminData.planType ===
        "Lifetime"
      ){

        return;
      }

      if(
        !adminData.expiryDate
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