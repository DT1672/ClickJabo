import { db }
from "./firebase-config.js";

import {
doc,
getDoc,
setDoc
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

/* =========================
   LOAD SETTINGS
========================= */

async function loadFooterSettings(){

  try{

    const docRef =
    doc(
      db,
      "settings",
      "footer"
    );

    const docSnap =
    await getDoc(
      docRef
    );

    if(docSnap.exists()){

      const data =
      docSnap.data();

      document.getElementById(
        "txtAboutText"
      ).value =
      data.aboutText || "";

      document.getElementById(
        "txtAboutLink"
      ).value =
      data.aboutLink || "";

      document.getElementById(
        "txtFooterLine1"
      ).value =
      data.footerLine1 || "";

      document.getElementById(
        "txtFooterLine2"
      ).value =
      data.footerLine2 || "";

      document.getElementById(
        "txtFooterLine3"
      ).value =
      data.footerLine3 || "";

      document.getElementById(
        "chkShowAbout"
      ).checked =
      data.showAbout || false;

      document.getElementById(
        "chkShowFooter"
      ).checked =
      data.showFooter || false;

    }

  }

  catch(error){

    console.log(error);

  }

}

/* =========================
   SAVE SETTINGS
========================= */

async function saveFooterSettings(){

  try{

    await setDoc(

      doc(
        db,
        "settings",
        "footer"
      ),

      {

        aboutText:

        document.getElementById(
          "txtAboutText"
        ).value,

        aboutLink:

        document.getElementById(
          "txtAboutLink"
        ).value,

        footerLine1:

        document.getElementById(
          "txtFooterLine1"
        ).value,

        footerLine2:

        document.getElementById(
          "txtFooterLine2"
        ).value,

        footerLine3:

        document.getElementById(
          "txtFooterLine3"
        ).value,

        showAbout:

        document.getElementById(
          "chkShowAbout"
        ).checked,

        showFooter:

        document.getElementById(
          "chkShowFooter"
        ).checked

      }

    );

    alert(
      "Footer Settings Saved"
    );

  }

  catch(error){

    console.log(error);

    alert(
      "Save Failed"
    );

  }

}

/* =========================
   EVENTS
========================= */

document
.getElementById(
  "btnSaveFooter"
)
.addEventListener(
  "click",
  saveFooterSettings
);

/* =========================
   PAGE LOAD
========================= */

window.addEventListener(

  "load",

  loadFooterSettings

);