import {
  auth
}
from "../firebase-config.js";

import {
  onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

onAuthStateChanged(

  auth,

  function(user){

    if(!user){

      window.location.href =
      "admin-login.html";

    }

  }

);