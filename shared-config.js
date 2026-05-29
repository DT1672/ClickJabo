export function getAdminSession(){

  return {

    districtID:
    localStorage.getItem(
      "adminDistrictID"
    ),

    vehicleID:
    localStorage.getItem(
      "adminVehicleID"
    ),

    providerID:
    localStorage.getItem(
      "adminProviderID"
    ),

    userID:
    localStorage.getItem(
      "adminUserID"
    )

  };

}


export function saveAdminSession(

  districtID,
  vehicleID,
  providerID

){

  localStorage.setItem(
    "adminDistrictID",
    districtID
  );

  localStorage.setItem(
    "adminVehicleID",
    vehicleID
  );

  localStorage.setItem(
    "adminProviderID",
    providerID
  );

}

export function clearAdminSession(){

  localStorage.removeItem(
    "adminDistrictID"
  );

  localStorage.removeItem(
    "adminVehicleID"
  );

  localStorage.removeItem(
    "adminProviderID"
  );

}