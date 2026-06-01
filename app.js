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
  where,
  updateDoc,
  increment
}
from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

let sponsorRotationInterval =
null;

/* =========================
   LOAD SPONSOR
========================= */

async function loadSponsorBanner(){

  try{

    const sponsorCarousel =

    document.getElementById(
      "sponsorCarousel"
    );

    sponsorCarousel.innerHTML = `

<a
href="#"
style="
display:block;
width:100%;
height:100%;
">

<img
src="banner.png"
class="install-banner"

style="
width:100%;
height:100%;
object-fit:cover;
border-radius:22px;
">

</a>

`;

    const sponsorSnapshot =

    await getDocs(

      collection(
        db,
        "sponsors"
      )

    );

    sponsorCarousel.innerHTML = `

<div
id="sponsorDots"

style="
position:absolute;
bottom:14px;
left:50%;
transform:translateX(-50%);
display:flex;
gap:6px;
z-index:999;
pointer-events:none;
"

>
</div>

    `;

    const sponsorDots =

    document.getElementById(
      "sponsorDots"
    );

    const now =
    new Date();

    let validSponsors =
    [];

    sponsorSnapshot.forEach(docSnap => {

      const sponsorId =
docSnap.id;


  const sponsor =
  docSnap.data();

      /* =========================
         EXPIRY CHECK
      ========================= */

      const notStartedYet =

  sponsor.startDate &&

  sponsor.startDate.toDate() > now;

      const isExpired =

        sponsor.expiryDate &&

        sponsor.expiryDate.toDate() < now;

      /* =========================
         DISTRICT CHECK
      ========================= */

      const districtMatched =

        sponsor.isGlobal === true ||

        (

          sponsor.districts &&

          sponsor.districts.includes(
            districtSelect.value
          )

        );

      /* =========================
         VALID SPONSOR
      ========================= */

     if(

  sponsor.isActive === true &&

  !isExpired &&

  !notStartedYet &&

  districtMatched

){

       validSponsors.push({

  id:sponsorId,

  ...sponsor

});

      }

    });

    
    /* =========================
   PRIORITY SORT
========================= */

validSponsors.sort(

  (a,b) =>

  (a.priority || 1) -

  (b.priority || 1)

);

 /* =========================
   FALLBACK BANNER
========================= */

if(validSponsors.length === 0){

  sponsorCarousel.innerHTML = `

<div
id="sponsorDots"

style="
position:absolute;
bottom:14px;
left:50%;
transform:translateX(-50%);
display:flex;
gap:6px;
z-index:10;
"

>
</div>

<a
href="#"

onclick="
trackSponsorClick(
'defaultBanner'
)
"

style="
display:block;
width:100%;
height:100%;
">

<img
src="banner.png"
class="install-banner"

style="
width:100%;
height:100%;
object-fit:cover;
border-radius:22px;
">

</a>

  `;

trackSponsorImpression(
  "defaultBanner"
);
  return;

}

/* =========================
   CREATE SLIDES
========================= */

validSponsors.forEach((sponsor,index) => {

  sponsorCarousel.innerHTML += `
<a
href="${
  sponsor.redirectUrl || "#"
}"
target="_blank"

onclick="
trackSponsorClick(
'${sponsor.id}'
)
"

class="sponsor-slide"


style="
position:absolute;
inset:0;
z-index:1;
opacity:${index === 0 ? "1" : "0"};
transition:opacity .6s ease;
pointer-events:${
  index === 0
  ? "auto"
  : "none"
};
"

>

<img
src="${sponsor.imageUrl}"

class="install-banner"

style="
width:100%;
height:100%;
object-fit:cover;
border-radius:22px;
">

</a>

  `;

});

/* =========================
   CREATE DOTS
========================= */

sponsorDots.innerHTML = "";

validSponsors.forEach((_,index) => {

  sponsorDots.innerHTML += `

<div
class="sponsor-dot"

style="
width:8px;
height:8px;
border-radius:50%;
background:${
  index === 0
  ? "#ffffff"
  : "rgba(255,255,255,.35)"
};
transition:.3s ease;
box-shadow:
0 0 8px rgba(255,255,255,.45);
">

</div>

  `;

});

/* =========================
   AUTO ROTATION
========================= */

if(sponsorRotationInterval){

  clearInterval(
    sponsorRotationInterval
  );

}

let currentIndex =
0;

const slides =

document.querySelectorAll(
  ".sponsor-slide"
);

const dots =

document.querySelectorAll(
  ".sponsor-dot"
);

trackSponsorImpression(
  validSponsors[0].id
);

sponsorRotationInterval =

setInterval(() => {

  slides.forEach(slide => {

    slide.style.opacity =
    "0";

    slide.style.pointerEvents =
    "none";

  });

  currentIndex++;

  if(
    currentIndex >=
    slides.length
  ){

    currentIndex = 0;

  }

  slides[currentIndex]
  .style.opacity = "1";

  slides[currentIndex]
  .style.pointerEvents =
  "auto";

  trackSponsorImpression(
  validSponsors[currentIndex].id
);

  dots.forEach(dot => {

    dot.style.background =

    "rgba(255,255,255,.35)";

  });

  dots[currentIndex]
  .style.background =
  "#ffffff";

}, 4000);

  }

  catch(error){

    console.log(error);

  }

}

let routes = [];

let providerMap = {};

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

const providerSection =
document.getElementById(
  "providerSection"
);

const providerSelect =
document.getElementById(
  "providerSelect"
);


let selectedVehicleCategory =
"";

let selectedProviderID =
"";

async function loadProvidersMaster(){

  providerMap = {};

  try{

    const snapshot = await getDocs(
      collection(db, "providers")
    );

    snapshot.forEach(docSnap => {

      const provider =
      docSnap.data();

      providerMap[
        provider.providerID
      ] = provider.name;

    });

  }

  catch(error){

    console.log(error);

  }

}

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

    

    loadSponsorBanner();

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

<option value="${district.districtID}">
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
        "vehicles"
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
category.vehicleID;

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
  category.vehicleID;

  localStorage.setItem(

    "selectedVehicleCategory",

    category.vehicleID

  );

  /* CLEAR OLD DATA */

  providerSelect.innerHTML =
  '<option value="">Select Service Provider</option>';

  document.getElementById(
    "result"
  ).innerText =
  "Select Route";

  selectedProviderID =
  "";

  /* LOAD NEW ROUTES */

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

  routes = [];

  try{

    const routesQuery = query(

      collection(
        db,
        "routes"
      ),

      where(
        "districtID",
        "==",
        districtSelect.value
      ),

      where(
        "vehicleID",
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
   LOAD FOOTER SETTINGS
========================= */

async function loadFooterSettings(){

  try{

    const footerDoc =
    await getDoc(

      doc(
        db,
        "settings",
        "footer"
      )

    );

    if(!footerDoc.exists()){

      return;

    }

    const data =
    footerDoc.data();

    const aboutBtn =
    document.getElementById(
      "aboutBtn"
    );

    const footerBrand =
    document.getElementById(
      "footerBrand"
    );

    /* ABOUT BUTTON */

    if(data.showAbout){

      aboutBtn.style.display =
      "inline-block";

      aboutBtn.innerText =
      data.aboutText || "About";

      aboutBtn.href =
      data.aboutLink || "#";

    }

    else{

      aboutBtn.style.display =
      "none";

    }

    /* FOOTER TEXT */

    if(data.showFooter){

      let footerText = "";

      if(data.footerLine1){

        footerText +=
        data.footerLine1;

      }

      if(data.footerLine2){

        footerText +=
        (footerText ? " • " : "") +
        data.footerLine2;

      }

      if(data.footerLine3){

        footerText +=
        (footerText ? " • " : "") +
        data.footerLine3;

      }

      footerBrand.innerText =
      footerText;

      footerBrand.style.display =
      "block";

    }

    else{

      footerBrand.style.display =
      "none";

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
        route.fromPlace
      )
    ){

      locations.push(
        route.fromPlace
      );

    }

    if(
      !locations.includes(
        route.toPlace
      )
    ){

      locations.push(
        route.toPlace
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
  "Search pickup location...",

  itemSelectText:"",

  shouldSort:false,

  searchResultLimit:4

});

toChoices =
new Choices("#to", {

  searchEnabled:true,

  searchPlaceholderValue:
  "Search destination...",

  itemSelectText:"",

  shouldSort:false,

  searchResultLimit:4

});

}

fromSelect.addEventListener(
  "change",
  loadProviders
);

toSelect.addEventListener(
  "change",
  loadProviders
);

/* =========================
   LOAD PROVIDERS
========================= */

function loadProviders(){

  providerSelect.innerHTML =

  `
  <option value="">
  Select Service Provider
  </option>
  `;

  const from =
  fromChoices.getValue(
    true
  );

  const to =
  toChoices.getValue(
    true
  );

  if(
    !from ||
    !to
  ){

    return;

  }

  const addedProviders =
  new Set();

  routes.forEach(route => {

    if(

      route.fromPlace === from &&

      route.toPlace === to

    ){

      if(

        !addedProviders.has(
          route.providerID
        )

      ){

        addedProviders.add(
          route.providerID
        );

        providerSelect.innerHTML +=
        `
       <option value="${route.providerID}">
${providerMap[route.providerID] || route.providerID}
</option>
        `;

      }

    }

  });

}

/* =========================
   PROVIDER CHANGE
========================= */

providerSelect.addEventListener(

  "change",

  async () => {

    selectedProviderID =
    providerSelect.value;

    const providerQuery =
    query(

      collection(
        db,
        "providers"
      ),

      where(
        "providerID",
        "==",
        selectedProviderID
      )

    );

    const providerSnapshot =
    await getDocs(
      providerQuery
    );

    if(
      !providerSnapshot.empty
    ){

      const provider =
      providerSnapshot
      .docs[0]
      .data();

      const providerCallBtn =
      document.getElementById(
        "providerCallBtn"
      );

      providerCallBtn.href =
      `tel:${provider.helplineNumber}`;

    }

  }

);

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

  let lastUpdated =
"Unknown";

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

    route.fromPlace === from &&
    route.toPlace === to &&
    route.providerID === selectedProviderID

  ){

    if(route.updatedAt){

      const date =

      route.updatedAt.toDate();

      lastUpdated =

      date.toLocaleDateString(
        "en-IN",
        {
          day:"2-digit",
          month:"short",
          year:"numeric"
        }
      );

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
              route.shareDayFare || 0
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
              route.shareNightFare || 0
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
              route.hireDayFare || 0
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
              route.hireNightFare || 0
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

showFareModal(
  result,
  lastUpdated
);

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
   TRACK CLICK
========================= */

async function trackSponsorClick(

  sponsorId

){

  try{

    await updateDoc(

      doc(
        db,
        "sponsors",
        sponsorId
      ),

      {

        clicks:
        increment(1)

      }

    );

  }

  catch(error){

    console.log(error);

  }

}

/* =========================
   TRACK IMPRESSION
========================= */

const viewedSponsors =
new Set();

async function trackSponsorImpression(

  sponsorId

){

  try{

    if(
      viewedSponsors.has(
        sponsorId
      )
    ){

      return;

    }

    viewedSponsors.add(
      sponsorId
    );

    await updateDoc(

      doc(
        db,
        "sponsors",
        sponsorId
      ),

      {

        impressions:
        increment(1)

      }

    );

  }

  catch(error){

    console.log(error);

  }

}


/* =========================
   FARE MODAL
========================= */
function showFareModal(
  fare,
  updatedDate
){

  document.getElementById(
    "modalFare"
  ).innerText =
  fare;

  document.getElementById(
    "modalUpdated"
  ).innerText =

  "Last Updated: " +
  updatedDate;

  document.getElementById(
    "fareModal"
  ).style.display =

  "flex";

}

function closeFareModal(){

  document.getElementById(
    "fareModal"
  ).style.display =

  "none";

}

window.closeFareModal =
closeFareModal;

/* =========================
   ROUTE MODAL
========================= */
function openRouteModal(){

  loadRouteList();

  document.getElementById(
    "routeModal"
  ).style.display =

  "block";

}


function closeRouteModal(){

  document.getElementById(
    "routeModal"
  ).style.display =

  "none";

}

window.openRouteModal =
openRouteModal;

window.closeRouteModal =
closeRouteModal;

/* =========================
   ROUTE LIST
========================= */

function loadRouteList(){

  const routeList =

  document.getElementById(
    "routeList"
  );

  routeList.innerHTML = "";

  routes.forEach(route => {

    routeList.innerHTML += `

<div

style="
padding:14px;
margin-bottom:10px;
border-radius:14px;
background:
rgba(255,255,255,.05);
border:
1px solid rgba(255,255,255,.08);
cursor:pointer;
">

<div
style="
font-size:15px;
font-weight:600;
">

${route.fromPlace}
→
${route.toPlace}

</div>

<div
style="
font-size:12px;
color:#94a3b8;
margin-top:4px;
">

${providerMap[route.providerID] || route.providerID}

</div>

</div>

`;

  });

}

/* =========================
   APP LOAD
========================= */
window.addEventListener(

  "load",

  async () => {

    await loadProvidersMaster();

    await loadDistricts();

    await loadVehicleCategories();

    await loadRoutesFromFirestore();

    loadSponsorBanner();

    loadFooterSettings();

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