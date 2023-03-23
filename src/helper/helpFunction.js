const uniqueLocation = (arr) => {
  return Array.from(new Set(arr));
};

const averageGeolocation = (coords) => {
  if (coords.length === 1) {
    return coords[0];
  }

  let x = 0.0;
  let y = 0.0;
  let z = 0.0;

  // eslint-disable-next-line no-restricted-syntax
  for (const coord of coords) {
    const lat = (coord.lat * Math.PI) / 180;
    const long = (coord.long * Math.PI) / 180;

    x += Math.cos(lat) * Math.cos(long);
    y += Math.cos(lat) * Math.sin(long);
    z += Math.sin(lat);
  }

  const total = coords.length;

  x /= total;
  y /= total;
  z /= total;

  const centralLng = Math.atan2(y, x);
  const centralSquareRoot = Math.sqrt(x * x + y * y);
  const centralLat = Math.atan2(z, centralSquareRoot);

  return {
    lat: (centralLat * 180) / Math.PI,
    long: (centralLng * 180) / Math.PI,
  };
};

module.exports = { uniqueLocation, averageGeolocation };
