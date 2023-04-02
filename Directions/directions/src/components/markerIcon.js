function createNumberedColoredMarkerIcon(color, number) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36">
      <path d="M12 0C5.4 0 0 5.4 0 12C0 18.6 12 36 12 36S24 18.6 24 12C24 5.4 18.6 0 12 0Z" fill="${color}" stroke="black" stroke-width="2" />
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12px" font-weight="bold" fill="white">${number}</text>
    </svg>`;

  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    anchor: new window.google.maps.Point(12, 36),
    scaledSize: new window.google.maps.Size(24, 36),
  };
}

export default createNumberedColoredMarkerIcon;
