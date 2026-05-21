import {
  db
}
from "./firebase-config.js";

import {
  collection,
  getDocs
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

  const querySnapshot =
  await getDocs(

    collection(
      db,
      "routes"
    )

  );

  routes = [];

  querySnapshot.forEach(doc => {

    routes.push(
      doc.data()
    );

  });

  loadLocations();

}

loadRoutesFromFirestore();

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