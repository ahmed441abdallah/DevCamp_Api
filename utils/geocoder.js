import NodeGeocoder from "node-geocoder";
const options = {
    provider: "mapquest",
    apiKey: "iNX8THJrc3SiKUMUTPoAALs60kJpD2OV",
    formatter: null
}
const geocoder = NodeGeocoder(options)
export default geocoder;