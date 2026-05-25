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

    let latestDate =
    null;

    querySnapshot.forEach(doc => {

      routes.push(
        doc.data()
      );

      const route =
      doc.data();

      if(route.updatedAt){

        const routeDate =
        route.updatedAt.toDate();

        if(

          !latestDate ||

          routeDate > latestDate

        ){

          latestDate =
          routeDate;

        }

      }

    });

    /* SAVE OFFLINE CACHE */

    localStorage.setItem(

      "offlineRoutes",

      JSON.stringify(routes)

    );

    if(latestDate){

      document.getElementById(
        "lastUpdated"
      ).innerHTML =

      latestDate.toLocaleDateString(

        "en-GB",

        {

          day:"2-digit",
          month:"short",
          year:"numeric"

        }

      );

    }

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

const offlineRoutes =

localStorage.getItem(
  "offlineRoutes"
);

window.addEventListener(

  "load",

  () => {

    if(

      isOffline &&

      offlineRoutes

    ){

      routes =

      JSON.parse(
        offlineRoutes
      );

      setTimeout(() => {

        loadLocations();

      }, 500);

    }

    else{

      loadRoutesFromFirestore();

    }

  }

);


loadHelpline();

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

      /* SAVE OFFLINE CACHE */

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

    const offlineHelpline =

    localStorage.getItem(
      "offlineHelpline"
    );

    if(offlineHelpline){

      const helplineBtn =
      document.getElementById(
        "helplineBtn"
      );

      if(

        helplineBtn &&

        offlineHelpline

      ){

        helplineBtn.href =

        `tel:${offlineHelpline}`;

      }

    }

  }

}

function loadLocations(){

  fromSelect.innerHTML =

  '<option value="">Select Pickup Location</option>';

  toSelect.innerHTML =

  '<option value="">Select Destination</option>';

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

  const lastFrom =
  localStorage.getItem(
    "lastFrom"
  );

  const lastTo =
  localStorage.getItem(
    "lastTo"
  );

  if(lastFrom){

    fromSelect.value =
    lastFrom;

  }

  if(lastTo){

    toSelect.value =
    lastTo;

  }

  if(fromChoices){

    fromChoices.destroy();

  }

  if(toChoices){

    toChoices.destroy();

  }

  fromChoices =
  new Choices("#from", {

    searchEnabled:true,

    itemSelectText:"",

    shouldSort:false

  });

  toChoices =
  new Choices("#to", {

    searchEnabled:true,

    itemSelectText:"",

    shouldSort:false

  });

}

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
        rideType ===
        "shared"
      ){

        let totalSharedFare;

        if(
          fareMode ===
          "day"
        ){

          totalSharedFare =

          Number(
            route.sharedDay
          )

          * passengers;

        }

        else{

          totalSharedFare =

          Number(
            route.sharedNight
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

          route.hireDay;

        }

        else{

          result =

          "₹" +

          route.hireNight;

        }

      }

    }

  });

  document.getElementById(
    "result"
  ).innerText =
  result;

  const card =
  document.querySelector(

    ".result-glass"

  );

  card.classList.remove(

    "result-animate"

  );

  void card.offsetWidth;

  card.classList.add(

    "result-animate"

  );

}

window.checkFare =
checkFare;

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