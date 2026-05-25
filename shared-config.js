export function getAdminSession(){

  return {

    district:
    localStorage.getItem(
      "adminDistrict"
    ),

    vehicleCategory:
    localStorage.getItem(
      "adminVehicleCategory"
    ),

    serviceProvider:
    localStorage.getItem(
      "adminServiceProvider"
    )

  };

}

export function saveAdminSession(

  district,
  vehicleCategory,
  serviceProvider

){

  localStorage.setItem(
    "adminDistrict",
    district
  );

  localStorage.setItem(
    "adminVehicleCategory",
    vehicleCategory
  );

  localStorage.setItem(
    "adminServiceProvider",
    serviceProvider
  );

}

export function clearAdminSession(){

  localStorage.removeItem(
    "adminDistrict"
  );

  localStorage.removeItem(
    "adminVehicleCategory"
  );

  localStorage.removeItem(
    "adminServiceProvider"
  );

}