//  test location for calculating the distance between the user and the store:
const location = { latitude: 40.834139, longitude: 44.264942 };

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const getDistanceFromLatLonInM = async (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dInKm = R * c; // Distance in m
  const dInM = dInKm * 1000;
  return dInM;
};

const unlock = async (params) => {
  const distance = await getDistanceFromLatLonInM(
    params.location.coords.latitude,
    params.location.coords.longitude,
    location.latitude,
    location.longitude
  );

  if (distance >= 50) {
    return 'you are far from the door';
  }
  return 'the door is open';
};

module.exports = { unlock };
