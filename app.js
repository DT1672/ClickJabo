const isOffline =
!navigator.onLine;

import {
  db
}
from "./firebase-config.js";

import {
  collection,
  getDocs,
  doc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

let routes = [];

let fromChoices;

let toChoices;

const districtSelect =
document.getElementById(
  "district"
);

const fromSelect =
document.getElementById(
  "from"
);

const toSelect =
document.getElementById(
  "to"
);

/* =========================
   DISTRICT SAVE
========================= */

const savedDistrict =
localStorage.getItem(
  "selectedDistrict"
);

if(savedDistrict){

  districtSelect.value =
  savedDistrict;

}

districtSelect.addEventListener(
  "change",
  () => {

    localStorage.setItem(

      "selectedDistrict",

      districtSelect.value

    );

    loadLocations();

  }
);

/* =========================
   LOAD DISTRICTS
========================= */

async function loadDistricts(){

  try{

    const districtSnapshot =
    await getDocs(

      collection(
        db,
        "districts"
      )

    );

    districtSelect.innerHTML =
    "";

    districtSnapshot.forEach(docSnap => {

      const district =
      docSnap.data();

      if(district.isActive){

        districtSelect.innerHTML += `

<option value="${district.name}">
${district.name}
</option>

        `;

      }

    });

    const savedDistrict =
    localStorage.getItem(
      "selectedDistrict"
    );

    if(savedDistrict){

      districtSelect.value =
      savedDistrict;

    }

  }

  catch(error){

    console.log(
      "Unable to load districts",
      error
    );

  }

}

/* =========================
   LOAD ROUTES
========================= */

async function loadRoutesFromFirestore(){

  try{

    const querySnapshot =
    await getDocs(

      collection(
        db,
        "routes"
      )

    );

    routes = [];

    querySnapshot.forEach(docSnap => {

      routes.push(
        docSnap.data()
      );

    });

    localStorage.setItem(

      "offlineRoutes",

      JSON.stringify(routes)

    );

    loadLocations();

  }

  catch(error){

    console.log(
      "Offline Mode",
      error
    );

    const offlineRoutes =
    localStorage.getItem(
      "offlineRoutes"
    );

    if(offlineRoutes){

      routes =
      JSON.parse(
        offlineRoutes
      );

      loadLocations();

    }

  }

}

/* =========================
   LOAD HELPLINE
========================= */

async function loadHelpline(){

  try{

    const settingsDoc =
    await getDoc(

      doc(
        db,
        "settings",
        "Dimapur"
      )

    );

    if(settingsDoc.exists()){

      const settings =
      settingsDoc.data();

      localStorage.setItem(

        "offlineHelpline",

        settings.helpline || ""

      );

      const helplineBtn =
      document.getElementById(
        "helplineBtn"
      );

      if(

        helplineBtn &&

        settings.helpline

      ){

        helplineBtn.href =

        `tel:${settings.helpline}`;

      }

    }

  }

  catch(error){

    console.log(
      "Offline Helpline",
      error
    );

  }

}

loadHelpline();

/* =========================
   LOAD LOCATIONS
========================= */

function loadLocations(){

  fromSelect.innerHTML =

  '<option value="">📍 Select Pickup Location</option>';

  toSelect.innerHTML =

  '<option value="">📍 Select Destination</option>';

  let locations = [];

  let selectedDistrict =
  districtSelect.value;

  routes.forEach(route => {

    if(
      route.district ===
      selectedDistrict
    ){

      if(
        !locations.includes(
          route.from
        )
      ){

        locations.push(
          route.from
        );

      }

      if(
        !locations.includes(
          route.to
        )
      ){

        locations.push(
          route.to
        );

      }

    }

  });

  locations.forEach(location => {

    let option1 =
    document.createElement(
      "option"
    );

    option1.value =
    location;

    option1.text =
    location;

    fromSelect.appendChild(
      option1
    );

    let option2 =
    document.createElement(
      "option"
    );

    option2.value =
    location;

    option2.text =
    location;

    toSelect.appendChild(
      option2
    );

  });

  if(fromChoices){

    fromChoices.destroy();

  }

  if(toChoices){

    toChoices.destroy();

  }

  fromChoices =
  new Choices("#from", {

    searchEnabled:true,

    searchPlaceholderValue:
    "Type here to search...",

    itemSelectText:"",

    shouldSort:false

  });

  toChoices =
  new Choices("#to", {

    searchEnabled:true,

    searchPlaceholderValue:
    "Type here to search...",

    itemSelectText:"",

    shouldSort:false

  });

}

/* =========================
   CHECK FARE
========================= */

function checkFare(){

  let from =
  fromChoices.getValue(
    true
  );

  let to =
  toChoices.getValue(
    true
  );

  let rideType =
  document.getElementById(
    "rideType"
  ).value;

  let fareMode =
  document.getElementById(
    "fareMode"
  ).value;

  let passengers =
  parseInt(

    document.getElementById(
      "passengers"
    ).value

  );

  let result =
  "No fare data available";

  if(
    from === "" ||
    to === ""
  ){

    document.getElementById(
      "result"
    ).innerText =
    "Select Route";

    return;

  }

  if(from === to){

    document.getElementById(
      "result"
    ).innerText =
    "Same Location";

    return;

  }

  localStorage.setItem(
    "lastFrom",
    from
  );

  localStorage.setItem(
    "lastTo",
    to
  );

  routes.forEach(route => {

    if(

      route.district ===
      districtSelect.value &&

      route.from === from &&

      route.to === to

    ){

      if(

        route.updatedAt &&

        route.updatedAt.toDate

      ){

        document.getElementById(
          "lastUpdated"
        ).innerText =

        route.updatedAt
        .toDate()
        .toLocaleString();

      }

      if(
        rideType ===
        "shared"
      ){

        let totalSharedFare;

        if(
          fareMode ===
          "day"
        ){

          totalSharedFare =

          (

            Number(
              route.sharedDay || 0
            )

            +

            Number(
              route.tempSharedDay || 0
            )

          )

          * passengers;

        }

        else{

          totalSharedFare =

          (

            Number(
              route.sharedNight || 0
            )

            +

            Number(
              route.tempSharedNight || 0
            )

          )

          * passengers;

        }

        result =
        "₹" +
        totalSharedFare;

      }

      else{

        if(
          fareMode ===
          "day"
        ){

          result =

          "₹" +

          (

            Number(
              route.hireDay || 0
            )

            +

            Number(
              route.tempHireDay || 0
            )

          );

        }

        else{

          result =

          "₹" +

          (

            Number(
              route.hireNight || 0
            )

            +

            Number(
              route.tempHireNight || 0
            )

          );

        }

      }

    }

  });

  document.getElementById(
    "result"
  ).innerText =
  result;

}

window.checkFare =
checkFare;

/* =========================
   SWAP
========================= */

function swapLocations(){

  let fromValue =
  fromChoices.getValue(
    true
  );

  let toValue =
  toChoices.getValue(
    true
  );

  fromChoices.setChoiceByValue(
    toValue
  );

  toChoices.setChoiceByValue(
    fromValue
  );

}

window.swapLocations =
swapLocations;

/* =========================
   APP LOAD
========================= */

const offlineRoutes =
localStorage.getItem(
  "offlineRoutes"
);

window.addEventListener(

  "load",

  async () => {

    if(

      isOffline &&

      offlineRoutes

    ){

      routes =

      JSON.parse(
        offlineRoutes
      );

      loadLocations();

    }

    else{

      await loadDistricts();

      await loadRoutesFromFirestore();

    }

  }

);

/* =========================
   SPLASH
========================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(() => {

      const splash =
      document.getElementById(
        "splash-screen"
      );

      splash.style.transition =
      "opacity .6s ease";

      splash.style.opacity =
      "0";

      setTimeout(() => {

        splash.style.display =
        "none";

      }, 600);

    }, 2800);

  }
);