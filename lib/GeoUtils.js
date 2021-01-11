//https://stackoverflow.com/a/48805273
/**
 * Calculates the haversine distance between point A, and B.
 * @param {number[]} latlngA [lat, lng] point A
 * @param {number[]} latlngB [lat, lng] point B
 */
function haversineDistance(latlngA, latlngB) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    let lat1 = parseFloat(latlngA[0]);
    let lon1 = parseFloat(latlngA[1]);

    let lat2 = parseFloat(latlngB[0]);
    let lon2 = parseFloat(latlngB[1]);

    let R = 6371; // radius of the Earth in km

    let x1 = lat2 - lat1;
    let dLat = x1.toRad();
    let x2 = lon2 - lon1;
    let dLon = x2.toRad();
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;
}