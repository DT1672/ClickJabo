let routes = [];

const districtSelect =
document.getElementById("district");

const fromSelect =
document.getElementById("from");

const toSelect =
document.getElementById("to");


let fromChoices;
let toChoices;


const savedDistrict =
localStorage.getItem("selectedDistrict");

if(savedDistrict){

  districtSelect.value = savedDistrict;

}


districtSelect.addEventListener("change", () => {

  localStorage.setItem(

    "selectedDistrict",

    districtSelect.value

  );

  loadLocations();

});


fetch("routes.json")

.then(response => response.json())

.then(data => {

  routes = data;

  loadLocations();

});



function loadLocations(){

  fromSelect.innerHTML =

  '<option value="">Select Pickup Location</option>';

  toSelect.innerHTML =

  '<option value="">Select Destination</option>';


  let locations = [];

  let selectedDistrict =

  districtSelect.value;


  routes.forEach(route => {

    if(route.district === selectedDistrict){

      if(!locations.includes(route.from)){

        locations.push(route.from);

      }

      if(!locations.includes(route.to)){

        locations.push(route.to);

      }

    }

  });


  locations.forEach(location => {

    let option1 =
    document.createElement("option");

    option1.value = location;

    option1.text = location;

    fromSelect.appendChild(option1);


    let option2 =
    document.createElement("option");

    option2.value = location;

    option2.text = location;

    toSelect.appendChild(option2);

  });


  initializeSearchableDropdowns();

}



function initializeSearchableDropdowns(){

  if(fromChoices){

    fromChoices.destroy();

  }


  if(toChoices){

    toChoices.destroy();

  }


  fromChoices = new Choices('#from', {

    searchEnabled: true,

    itemSelectText: '',

    shouldSort: false

  });


  toChoices = new Choices('#to', {

    searchEnabled: true,

    itemSelectText: '',

    shouldSort: false

  });

}



function checkFare(){

  let from =
  fromChoices.getValue(true);

  let to =
  toChoices.getValue(true);

  let rideType =
  document.getElementById("rideType").value;

  let fareMode =
  document.getElementById("fareMode").value;

  let passengers =
  parseInt(

  document.getElementById("passengers").value

  );


  let result =
  "No fare data available for selected route.";


  if(from === "" || to === ""){

    document.getElementById("result").innerText =
    "Please select pickup and destination";

    return;

  }


  if(from === to){

    document.getElementById("result").innerText =
    "Please select a different destination";

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

      route.district === districtSelect.value &&

      route.from === from &&

      route.to === to

    ){

      if(rideType === "shared"){

        let totalSharedFare;


        if(fareMode === "day"){

          totalSharedFare =

          route.sharedFare * passengers;

        }

        else{

          totalSharedFare =

          (route.sharedFare + 20)

          * passengers;

        }


        result =

        "Shared Fare: ₹" +

        totalSharedFare;

      }

      else{

        if(fareMode === "day"){

          result =

          "Hire Fare: ₹" +

          route.hireDayFare;

        }

        else{

          result =

          "Hire Night Fare: ₹" +

          route.hireNightFare;

        }

      }

    }

  });


  document.getElementById("result").innerText =
  result;

}



function swapLocations(){

  let fromValue =
  fromChoices.getValue(true);

  let toValue =
  toChoices.getValue(true);


  fromChoices.setChoiceByValue(toValue);

  toChoices.setChoiceByValue(fromValue);

}
window.addEventListener("load", () => {

  const lastFrom =
  localStorage.getItem("lastFrom");

  const lastTo =
  localStorage.getItem("lastTo");


  if(lastFrom){

    setTimeout(() => {

      fromChoices.setChoiceByValue(lastFrom);

    }, 300);

  }


  if(lastTo){

    setTimeout(() => {

      toChoices.setChoiceByValue(lastTo);

    }, 300);

  }

});
window.addEventListener("load", () => {

  setTimeout(() => {

    document.getElementById(

      "splash-screen"

    ).style.opacity = "0";

    setTimeout(() => {

      document.getElementById(

        "splash-screen"

      ).style.display = "none";

    }, 500);

  }, 2500);

});