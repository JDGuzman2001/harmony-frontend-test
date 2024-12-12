export const calculateDistance = (point1, point2) => {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
           Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const groupClosePoints = (points, maxDistance = 0.5) => {
  const groups = [];
  const visited = new Set();

  points.forEach((point, index) => {
    if (visited.has(index)) return;

    const currentGroup = {
      points: [point.coordinates],
      totalSales: point.sales,
      pointsData: [point]
    };
    visited.add(index);

    points.forEach((otherPoint, otherIndex) => {
      if (visited.has(otherIndex)) return;
      
      if (calculateDistance(point.coordinates, otherPoint.coordinates) <= maxDistance) {
        currentGroup.points.push(otherPoint.coordinates);
        currentGroup.totalSales += otherPoint.sales;
        currentGroup.pointsData.push(otherPoint);
        visited.add(otherIndex);
      }
    });

    if (currentGroup.points.length >= 2) {
      groups.push(currentGroup);
    }
  });

  return groups;
};

export const getZoneColor = (salesValue, minSales, maxSales) => {
  const ratio = (salesValue - minSales) / (maxSales - minSales);
  
  if (ratio < 0.33) {
    return '#ff4444';
  } else if (ratio < 0.66) {
    return '#ffff44';
  } else {
    return '#44ff44';
  }
};
