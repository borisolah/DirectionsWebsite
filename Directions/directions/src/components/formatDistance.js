function formatDistance(distance) {
  const kilometers = (distance / 1000).toFixed(2);
  return `${kilometers} km`;
}

export default formatDistance;
