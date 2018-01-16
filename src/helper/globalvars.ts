'use strict';

export const access_type_key='access_type';
export const access_type_home='HOME';
export const access_type_login='LOGIN';
export const access_type_register='REGISTER';
export const access_type_profile='PROFILE';
export const patient_profile_storage_key="patientProfile";
export const vehicle_type_bus='BUS';
export const vehicle_type_tram='TRAM';
export const vehicle_config_key_ambulance='ambulance_config';
export const vehicle_config_key_bus='bus_config';
export const vehicle_config_key_tram='tram_config';
export const vehicle_detail_map_key = 'facilityType';
export const ambulance_facility_normal='normal';
export const ambulance_facility_contagious = 'contagious';
export const ambulance_facility_life_support = 'life_support';
export const ambulance_facilities=[ambulance_facility_normal,ambulance_facility_contagious,ambulance_facility_life_support];
export const data_source = 'IDEATION';
export const vehicle_call_interval_ambulance=15000;
export const nodal_agencies_storage_key="nodalAgencies";
export const public_transport_storage_key="publicRoutes";

export const public_imei_ambulance = "301020171133110";
export const public_imei_bus = "301020171133111";
export const public_imei_tram = "301020171133112";

export const facility_type_key_normal="A";
export const facility_type_key_contagious = "B";
export const facility_type_key_lifesupport = "C";
export const facility_type_value_normal="normal";
export const facility_type_value_contagious = "contagious";
export const facility_type_value_lifesupport = "lifesupport";
export const EVENT_LISTENER_TYPE_KEYBOARD ="keydown";


export const facility_type_values : Map<string,string> = new Map();
facility_type_values.set(facility_type_key_normal,facility_type_value_normal);
facility_type_values.set(facility_type_key_contagious,facility_type_value_contagious);
facility_type_values.set(facility_type_key_lifesupport,facility_type_value_lifesupport);

export const facility_type_keys_by_value: Map<string,string> = new Map();
facility_type_keys_by_value.set(facility_type_value_normal,facility_type_key_normal);
facility_type_keys_by_value.set(facility_type_value_contagious,facility_type_key_contagious);
facility_type_keys_by_value.set(facility_type_value_lifesupport,facility_type_key_lifesupport);


//uat server in i

// Localhost
/*
export const END_POINT_GET_LOGIN_AUTH = "http://localhost/smarthealth/api/login/loginAuth.php";
export const END_POINT_GET_PATIENT_PROFILE = "http://localhost/smarthealth/api/profile/read_patient.php";
export const END_POINT_SEND_REGISTRATION_DATA = "http://localhost/smarthealth/api/register/register.php";
*/
// Localhost exposed

export const END_POINT_GET_LOGIN_AUTH = "http://ef3be81e.ngrok.io/smarthealth/api/login/loginAuth.php";
export const END_POINT_GET_PATIENT_PROFILE = "http://ef3be81e.ngrok.io/smarthealth/api/profile/read_patient.php";
export const END_POINT_SEND_REGISTRATION_DATA = "http://ef3be81e.ngrok.io/smarthealth/api/register/register.php";


// Free Server
/*
export const END_POINT_GET_LOGIN_AUTH = "http://smarthealth.epizy.com/api/login/loginAuth.php";
export const END_POINT_GET_PATIENT_PROFILE = "http://smarthealth.epizy.com/api/profile/read_patient.php";
export const END_POINT_SEND_REGISTRATION_DATA = "http://smarthealth.epizy.com/api/register/register.php";
*/

export const END_POINT_SEND_VEHICLE_DATA = "http://115.119.200.83:15080/app/dataPusher";
export const END_POINT_SEND_AMBULANCE_DATA = "http://115.119.200.83:15080/app/dataPusher/special";
export const END_POINT_SEND_POLICE_VEHICLE_DATA = "http://115.119.200.83:5080/app/dataPusher/special";
export const END_POINT_SEND_POLICE_VEHICLE_CONFIG_DATA = "http://uat.ideationts.com:5080/app/dataPusher/police/configure";
export const END_POINT_GET_ALL_ROUTE = "http://115.119.200.83:8080/app/routes/getAllRoutes.json";
export const END_POINT_CHECK_APP_VERSION = "http://115.119.200.83:8080/app/checkVersion.json";
export const GET_VEHICLE_BY_ROUTE_SERVICE_URL = "http://115.119.200.83:8080/app/vehicles/getVehicleByRoute.json";
export const END_POINT_SEND_AMBULANCE_CONFIG_DATA = "http://115.119.200.83:15080/app/dataPusher/special/configure";
export const END_POINT_GET_ALL_NODAL_AGENCIES = "http://115.119.200.83:8080/app/agencies/getAllNodalAgencies.json";
export const END_POINT_GET_ALL_NODAL_AGENCIES_FOR_POLICE = "http://uat.ideationts.com:8080/app/vehicles/getVehicleAttributeValue/policeStation.json";
export const END_POINT_GET_VEHICLE_FOR_NODAL_AGENCY_POLICE="http://uat.ideationts.com:8080/app/vehicles/getMatchingVehicles.json";
