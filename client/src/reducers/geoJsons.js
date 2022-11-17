export default (geoJsons = [], action) => {

   switch (action.type) {
    case "FETCH_ALL":
        
        return geoJsons;
    case "CREATE":
        return geoJsons;
    default:
        break;
   }

   return geoJsons;
}