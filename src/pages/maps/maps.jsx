import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, useMap, Polygon, Tooltip, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../../components/header';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const calculateDistance = (point1, point2) => {
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

const groupClosePoints = (points, maxDistance = 2) => { 
  const groups = [];
  const visited = new Set();

  points.forEach((point, index) => {
    if (visited.has(index)) return;

    const currentGroup = [point];
    visited.add(index);

    points.forEach((otherPoint, otherIndex) => {
      if (visited.has(otherIndex)) return;
      
      if (calculateDistance(point, otherPoint) <= maxDistance) {
        currentGroup.push(otherPoint);
        visited.add(otherIndex);
      }
    });

    if (currentGroup.length >= 3) { 
      groups.push(currentGroup);
    }
  });

  return groups;
};

const Maps = () => {
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [mapCenter, setMapCenter] = useState([4.6097, -74.0817]);
  const [countries, setCountries] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Colombia');
  const [selectedRoute, setSelectedRoute] = useState();
  const [distributorTypes] = useState(['Wholesalers', 'Distributors', 'Sub-distributors']);
  const [selectedDistributorType, setSelectedDistributorType] = useState(null);
  const { handleLogout } = useAuth();
  const { toast } = useToast();
  const [distributorLocations, setDistributorLocations] = useState([]);
  const [pointsPerPage, setPointsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleLocations, setVisibleLocations] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(null);

  useEffect(() => {
    const fetchDistributorData = async () => {
      try {
        setLoading(true);
        let url = `http://127.0.0.1:8000/distributor_data?country=${selectedCountry}`;
        
        if (selectedDistributorType) {
          url += `&distributor_type=${selectedDistributorType}`;
        }
        
        const response = await fetch(url);
        const dataJSON = await response.json();
        const data = dataJSON.distributors;

        const allLats = data.map(item => parseFloat(item.latitude));
        const allLngs = data.map(item => parseFloat(item.longitude));
        
        const centerLat = allLats.reduce((a, b) => a + b, 0) / allLats.length;
        const centerLng = allLngs.reduce((a, b) => a + b, 0) / allLngs.length;
        
        setMapCenter([centerLat, centerLng]);
        setDistributorLocations(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching distributor data:', error);
        toast({
          title: 'Error',
          description: `Failed to load distributor data for ${selectedCountry}`,
        });
        setLoading(false);
      }
    };
    
    if (selectedCountry && selectedDistributorType) {
      fetchDistributorData();
    }
  }, [selectedCountry, selectedDistributorType, toast]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/countries');
        const data = await response.json();
        setCountries(data.countries);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching countries:', error);
        toast({
          title: 'Error',
          description: 'Failed to load countries list',
        });
      }
    };

    fetchCountries();
  }, [toast]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:8000/routes-by-country?country=${selectedCountry}`);
        const data = await response.json();
        setRoutes(data.routes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching routes:', error);
        toast({
          title: 'Error',
          description: 'Failed to load routes list',
        });
      }
    };

    fetchRoutes();
  }, [selectedCountry, toast]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); 
        const zonesResponse = await fetch(`http://127.0.0.1:8000/distribution_zones?country=${selectedCountry}`);
        const zonesDataJSON = await zonesResponse.json();

        let allLats = [];
        let allLngs = [];
        
        zonesDataJSON.zones.forEach(zoneData => {
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
        zonesDataJSON.zones.forEach(zoneData => {
          if (!routePoints[zoneData.route]) {
            routePoints[zoneData.route] = {
              points: [],
              sales: {
                total_liters: 0,
                total_usd: 0
              },
              cities: new Set()
            };
          }
          
          zoneData.points.forEach(point => {
            const coords = point.replace('(', '').replace(')', '').split(',');
            routePoints[zoneData.route].points.push([parseFloat(coords[0]), parseFloat(coords[1])]);
          });
          
          routePoints[zoneData.route].sales.total_liters += zoneData.sales_summary.total_liters;
          routePoints[zoneData.route].sales.total_usd += zoneData.sales_summary.total_usd;
          routePoints[zoneData.route].cities.add(zoneData.city);
        });

        const transformedZones = Object.entries(routePoints).map(([route, data]) => {
          const pointGroups = groupClosePoints(data.points);
          
          return {
            name: `Ruta ${route}`,
            cities: Array.from(data.cities).join(', '),
            coverage: `Ventas: ${data.sales.total_liters.toLocaleString()} litros / $${data.sales.total_usd.toLocaleString()}`,
            polygons: pointGroups,
            points: data.points,
            color: `hsl(${(parseInt(route) * 137.5) % 360}, 70%, 50%)`
          };
        });
        
        setZones(transformedZones);
        
        setLoading(false);
        toast({
          title: 'Fetched zones data',
          description: 'Zones data fetched correctly',
        })
      } catch (error) {
        console.error('Error fetching zones:', error);
        toast({
          title: 'Error',
          description: `Failed to load zones for ${selectedCountry}`,
        });
      }
    };
    
    if (selectedCountry) {
      fetchData();
    }
  }, [selectedCountry, toast]);

  useEffect(() => {
    if (distributorLocations.length > 0) {
      const startIndex = (currentPage - 1) * pointsPerPage;
      const endIndex = startIndex + pointsPerPage;
      setVisibleLocations(distributorLocations.slice(startIndex, endIndex));
    }
  }, [distributorLocations, currentPage, pointsPerPage]);

  const handleDistributorTypeChange = (value) => {
    setSelectedDistributorType(value);
    setSelectedRoute(null); 
  };

  const handleRouteChange = (value) => {
    setSelectedRoute(value);
    setSelectedDistributorType(null); 
  };

  return (
    <div className='flex flex-col justify-start items-center min-h-screen bg-background'>
      <Header title="Map" onLogout={handleLogout} />
      <div className='p-4 w-full max-w-[1400px] relative z-0'>
        {loading ? (
          <div className="relative">
            <Skeleton className="h-[80vh] w-full rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex justify-center items-center gap-4">
              <div className="mb-4 flex justify-center items-center">
                <div className="mr-4 font-bold" >Countries:</div>
                <Select
                  value={selectedCountry}
                  onValueChange={setSelectedCountry}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4 flex justify-center items-center">
                <div className="mr-4 font-bold">Routes:</div>
                <Select
                  value={selectedRoute}
                  onValueChange={handleRouteChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4 flex justify-center items-center">
                <div className="mr-4 font-bold">Distributor Type:</div>
                <Select
                  value={selectedDistributorType}
                  onValueChange={handleDistributorTypeChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select distributor type" />
                  </SelectTrigger>
                  <SelectContent>
                    {distributorTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <MapContainer 
            center={mapCenter}
            zoom={12}
            style={{ height: '80vh', width: '100%', maxWidth: '1400px', zIndex: 0 }}
            className="z-0"
          >
            <ChangeMapView center={mapCenter} />
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </LayersControl.BaseLayer>
              
              {selectedDistributorType && (
                <LayersControl.Overlay checked name={selectedDistributorType}>
                  {visibleLocations.map((location, index) => (
                    <Marker 
                      key={index} 
                      position={[parseFloat(location.latitude), parseFloat(location.longitude)]}
                      eventHandlers={{
                        click: () => setSelectedDistributor(location),
                      }}
                    >
                      <Tooltip>
                        <div className="font-medium">
                          <div>{location.brand} - {location.sub_brand}</div>
                          <div>{location.product_name}</div>
                          <div>Sales: ${location.sales_usd.toLocaleString()}</div>
                          <div>{location.address}</div>
                        </div>
                      </Tooltip>
                    </Marker>
                  ))}
                </LayersControl.Overlay>
              )}

              {!selectedDistributorType && zones
                .filter(zone => selectedRoute && zone.name === `Ruta ${selectedRoute}`)
                .map((zone, index) => (
                  <LayersControl.Overlay key={index} checked name={zone.name}>
                    {zone.polygons.map((polygon, polyIndex) => (
                      <Polygon
                        key={polyIndex}
                        positions={polygon}
                        pathOptions={{
                          fillColor: zone.color,
                          fillOpacity: 0.4,
                          weight: 2,
                          opacity: 1,
                          color: 'white'
                        }}
                      >
                        <Tooltip sticky>{zone.name}<br/>{zone.coverage}</Tooltip>
                      </Polygon>
                    ))}
                  </LayersControl.Overlay>
                ))}
            </LayersControl>
          </MapContainer>
          {!loading && distributorLocations.length > 0 && (
              <div className="w-full max-w-[1400px] mb-4 p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Showing {visibleLocations.length} of {distributorLocations.length} points
                  </span>
                  <div className="flex items-center gap-4">
                    <span>Points per page:</span>
                    <Select
                      value={pointsPerPage.toString()}
                      onValueChange={(value) => {
                        setPointsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[25, 50, 100, 200].map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-center">
                  <button
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {Math.ceil(distributorLocations.length / pointsPerPage)}</span>
                  <button
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
                    disabled={currentPage >= Math.ceil(distributorLocations.length / pointsPerPage)}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Dialog open={!!selectedDistributor} onOpenChange={() => setSelectedDistributor(null)}>
        <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Distributor Details</DialogTitle>
          </DialogHeader>
          {selectedDistributor && (
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="col-span-2 font-bold text-lg border-b pb-2">
                {selectedDistributor.brand} - {selectedDistributor.sub_brand}
              </div>
              
              <div className="space-y-2">
                <p><span className="font-semibold">Product:</span> {selectedDistributor.product_name}</p>
                <p><span className="font-semibold">Sales Units:</span> {selectedDistributor.sales_units.toLocaleString()}</p>
                <p><span className="font-semibold">Sales Liters:</span> {selectedDistributor.sales_liters.toLocaleString()}</p>
                <p><span className="font-semibold">Sales USD:</span> ${selectedDistributor.sales_usd.toLocaleString()}</p>
                <p><span className="font-semibold">Channel:</span> {selectedDistributor.channel}</p>
                <p><span className="font-semibold">Category:</span> {selectedDistributor.category}</p>
              </div>
              
              <div className="space-y-2">
                <p><span className="font-semibold">Vendor:</span> {selectedDistributor.vendor_name} ({selectedDistributor.vendor_code})</p>
                <p><span className="font-semibold">Route:</span> {selectedDistributor.route}</p>
                <p><span className="font-semibold">Address:</span> {selectedDistributor.address}</p>
                <p><span className="font-semibold">City:</span> {selectedDistributor.city}</p>
                <p><span className="font-semibold">Type:</span> {selectedDistributor.distributor_type}</p>
                <p><span className="font-semibold">Segment:</span> {selectedDistributor.segment_type}</p>
              </div>

              <div className="col-span-2 mt-4 pt-2 border-t">
                <p><span className="font-semibold">Period:</span> {selectedDistributor.month} {selectedDistributor.year} ({selectedDistributor.quarter}, {selectedDistributor.semester})</p>
                <p><span className="font-semibold">Location:</span> {selectedDistributor.gps_coordinates}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Maps; 