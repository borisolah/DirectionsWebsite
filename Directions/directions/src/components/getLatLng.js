const getLatLng = async (streetAddress, cityName) => {
  const encodedAddress = encodeURIComponent(streetAddress);
  const encodedCity = encodeURIComponent(cityName);

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress},+${encodedCity}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(`Geocoding error! status: ${data.status}`);
  }

  const lat = data.results[0].geometry.location.lat;
  const lng = data.results[0].geometry.location.lng;
  console.error();
  return { lat, lng };
};

export default getLatLng;

/*


 {
    "truck": 2,
    "pck_id": "3116",
    "p_id": "7",
    "pck_serial": "EURO-COLOR-BAND-BT-FESTEKBOLT-WEBARUHAZ/2023/0272",
    "pck_sender": {
      "address_city": "Szeged",
      "address_street": "Olajbányász tér 6.",
      "address_zip": "6723",
      "contact": "Torma Péter",
      "email": "sz.festekbolt@euro-colorband.hu",
      "lat": 46.2749934,
      "lng": 20.1648692,
      "name": "Euro-Color Band Bt. (Festékbolt webáruház)",
      "tel": "+36-30-264-6008"
    },
    "pck_receiver": {
      "address_city": "Jánosháza",
      "address_street": "Kossuth tér 22.",
      "address_zip": "9545",
      "contact": "Horváth Sándor",
      "email": "horvathsan@icloud.com",
      "lat": 47.119756,
      "lng": 17.1621564,
      "tel": "+36-30-946-9623"
    },
    "pck_message": "",
    "pck_utanvet": "0",
    "pck_price": "0",
    "pck_packs": "1",
    "pck_weight": "",
    "sync_type": null,
    "sync_status": "0",
    "sync_id": null,
    "status": "2",
    "regdate": "2023-03-31 14:44:36",
    "moddate": "2023-03-31 15:42:06"
  }
]
*/
