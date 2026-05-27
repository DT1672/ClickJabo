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
  getDoc,
  query,
  where
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

/* =========================
   LOAD SPONSOR
========================= */

async function loadSponsorBanner(){

  try{

    const sponsorImage =

    document.getElementById(
      "sponsorBanner"
    );

    const sponsorLink =

    document.getElementById(
      "sponsorLinkWrap"
    );

    const sponsorSnapshot =

    await getDocs(

      collection(
        db,
        "sponsors"
      )

    );

    let matchedSponsor =
    null;

    sponsorSnapshot.forEach(docSnap => {

      const sponsor =
      docSnap.data();

      if(

        sponsor.isActive === true &&

        (

          sponsor.isGlobal === true ||

          sponsor.district === districtSelect.value

        )

      ){

        matchedSponsor =
        sponsor;

      }

    });

    if(matchedSponsor){

      sponsorImage.src =

      matchedSponsor.imageUrl;

      sponsorLink.href =

      matchedSponsor.redirectUrl ||

      "#";

    }

    else{

      sponsorImage.src =
      "banner.png";

      sponsorLink.href =
      "#";

    }

  }

  catch(error){

    console.log(error);

  }

}

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

const vehicleCategoryContainer =
document.getElementById(
  "vehicleCategoryContainer"
);

let selectedVehicleCategory =
"";

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

  async () => {

    localStorage.setItem(

      "selectedDistrict",

      districtSelect.value

    );

    await loadVehicleCategories();

    await loadRoutesFromFirestore();

    await loadHelpline();

    await loadSponsorBanner();

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

    if(savedDistrict){

      districtSelect.value =
      savedDistrict;

    }

  }

  catch(error){

    console.log(error);

  }

}

/* =========================
   LOAD VEHICLE CATEGORIES
========================= */

async function loadVehicleCategories(){

  try{

    const querySnapshot =
    await getDocs(

      collection(
        db,
        "vehicleCategories"
      )

    );

    vehicleCategoryContainer.innerHTML =
    "";

    querySnapshot.forEach(docSnap => {

      const category =
      docSnap.data();

      if(category.isActive){

        const button =
        document.createElement(
          "button"
        );

        button.className =
        "vehicle-category-btn";

        button.innerHTML = `

<img
src="${category.icon}"
class="vehicle-icon">

<div class="vehicle-text">

${category.name}

</div>

`;

        button.dataset.category =
        category.name;

        button.onclick =
        async function(){

          document
          .querySelectorAll(
            ".vehicle-category-btn"
          )
          .forEach(btn => {

            btn.classList.remove(
              "active"
            );

          });

          button.classList.add(
            "active"
          );

          selectedVehicleCategory =
          category.name;

          localStorage.setItem(

            "selectedVehicleCategory",

            category.name

          );

          await loadRoutesFromFirestore();

        };

        vehicleCategoryContainer.appendChild(
          button
        );

      }

    });

    const savedCategory =
    localStorage.getItem(
      "selectedVehicleCategory"
    );

    if(savedCategory){

      selectedVehicleCategory =
      savedCategory;

      const buttons =
      document.querySelectorAll(
        ".vehicle-category-btn"
      );

      buttons.forEach(btn => {

        if(

          btn.dataset.category ===
          savedCategory

        ){

          btn.classList.add(
            "active"
          );

        }

      });

    }

  }

  catch(error){

    console.log(error);

  }

}

/* =========================
   LOAD ROUTES
========================= */

async function loadRoutesFromFirestore(){

  try{

    const routesQuery = query(

      collection(
        db,
        "routes"
      ),

      where(
        "district",
        "==",
        districtSelect.value
      ),

      where(
        "vehicleCategory",
        "==",
        selectedVehicleCategory
      )

    );

    const querySnapshot =
    await getDocs(
      routesQuery
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

    console.log(error);

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
        districtSelect.value
      )

    );

    if(settingsDoc.exists()){

      const settings =
      settingsDoc.data();

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

    console.log(error);

  }

}

/* =========================
   LOAD LOCATIONS
========================= */

function loadLocations(){

  fromSelect.innerHTML =

  '<option value="">Select Pickup Location</option>';

  toSelect.innerHTML =

  '<option value="">Select Destination</option>';

  let locations = [];

  routes.forEach(route => {

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

  routes.forEach(route => {

    if(

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

window.addEventListener(

  "load",

  async () => {

    await loadDistricts();

    await loadVehicleCategories();

    await loadRoutesFromFirestore();

    await loadHelpline();

    await loadSponsorBanner();

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