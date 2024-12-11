import { useState, useEffect } from 'react';
import { 
  fetchDistributorData, 
  fetchCountries, 
  fetchRoutes, 
  fetchZonesData 
} from '../utils/utils';
import { groupClosePoints, getZoneColor } from '../utils/mapsUtils';

export function useMapData() {
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [mapCenter, setMapCenter] = useState([4.6097, -74.0817]);
  const [countries, setCountries] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Colombia');
  const [selectedRoute, setSelectedRoute] = useState();
  const [distributorTypes] = useState(['Wholesalers', 'Distributors', 'Sub-distributors']);
  const [selectedDistributorType, setSelectedDistributorType] = useState(null);
  const [distributorLocations, setDistributorLocations] = useState([]);
  const [routeTotals, setRouteTotals] = useState({});

  useEffect(() => {
    const loadDistributorData = async () => {
      if (!selectedCountry || !selectedDistributorType) return;
      
      try {
        setLoading(true);
        const data = await fetchDistributorData(selectedCountry, selectedDistributorType);
        
        const allLats = data.map(item => parseFloat(item.latitude));
        const allLngs = data.map(item => parseFloat(item.longitude));
        
        const centerLat = allLats.reduce((a, b) => a + b, 0) / allLats.length;
        const centerLng = allLngs.reduce((a, b) => a + b, 0) / allLngs.length;
        
        setMapCenter([centerLat, centerLng]);
        setDistributorLocations(data);
      } catch (error) {
        console.error('Error fetching distributor data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDistributorData();
  }, [selectedCountry, selectedDistributorType]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        const countries = await fetchCountries();
        setCountries(countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true);
        const routes = await fetchRoutes(selectedCountry);
        setRoutes(routes);
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, [selectedCountry]);

  useEffect(() => {
    const loadZonesData = async () => {
      try {
        setLoading(true);
        const zonesData = await fetchZonesData(selectedCountry);
        
        let allLats = [];
        let allLngs = [];
        
        zonesData.forEach(zoneData => {
          zoneData.points.forEach(point => {
            const coords = point.replace('(', '').replace(')', '').split(',');
            allLats.push(parseFloat(coords[0]));
            allLngs.push(parseFloat(coords[1]));
          });
        });

        const centerLat = allLats.reduce((a, b) => a + b, 0) / allLats.length;
        const centerLng = allLngs.reduce((a, b) => a + b, 0) / allLngs.length;
        
        setMapCenter([centerLat, centerLng]);

        const routePoints = {};
        zonesData.forEach(zoneData => {
          if (!routePoints[zoneData.route]) {
            routePoints[zoneData.route] = {
              points: [],
              salesPoints: []
            };
          }
          
          zoneData.point_data.forEach(point => {
            const coords = point.gps_coordinates.replace('(', '').replace(')', '').split(',');
            routePoints[zoneData.route].salesPoints.push({
              coordinates: [parseFloat(coords[0]), parseFloat(coords[1])],
              sales: point.sales_units,
              salesInfo: {
                units: point.sales_units,
                liters: point.sales_liters,
                usd: point.sales_usd
              }
            });
          });
        });

        const transformedZones = Object.entries(routePoints).map(([route, data]) => {
          const salesGroups = groupClosePoints(data.salesPoints);
          
          const allSales = salesGroups.map(group => group.totalSales);
          const minSales = Math.min(...allSales);
          const maxSales = Math.max(...allSales);

          return {
            name: `Ruta ${route}`,
            salesClusters: salesGroups.map(group => ({
              points: group.points,
              totalSales: group.totalSales,
              color: getZoneColor(group.totalSales, minSales, maxSales),
              details: group.pointsData
            }))
          };
        });
        
        setZones(transformedZones);
        
        const totals = {};
        zonesData.forEach(zoneData => {
          if (!totals[zoneData.route]) {
            totals[zoneData.route] = {
              units: 0,
              liters: 0,
              usd: 0
            };
          }
          
          zoneData.point_data.forEach(point => {
            totals[zoneData.route].units += point.sales_units;
            totals[zoneData.route].liters += point.sales_liters;
            totals[zoneData.route].usd += point.sales_usd;
          });
        });
        setRouteTotals(totals);
      } catch (error) {
        console.error('Error fetching zones:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (selectedCountry) {
      loadZonesData();
    }
  }, [selectedCountry]);

  const handleDistributorTypeChange = (value) => {
    setSelectedDistributorType(value);
    setSelectedRoute(null); 
  };

  const handleRouteChange = (value) => {
    setSelectedRoute(value);
    setSelectedDistributorType(null); 
  };

  return {
    loading,
    zones,
    mapCenter,
    countries,
    routes,
    selectedCountry,
    selectedRoute,
    distributorTypes,
    selectedDistributorType,
    distributorLocations,
    routeTotals,
    setSelectedCountry,
    handleDistributorTypeChange,
    handleRouteChange
  };
}
