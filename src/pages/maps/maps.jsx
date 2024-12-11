import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, useMap, Polygon, Tooltip, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Header from '../../components/header';
import { useAuth } from '../../context/authContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from "lucide-react";
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

import MapControls from '../../components/mapControls';
import { useMapData } from '../../hooks/useMapData';

const ChangeMapView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const Maps = () => {
  const { 
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
  } = useMapData();

  const { handleLogout } = useAuth();
  const [pointsPerPage, setPointsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleLocations, setVisibleLocations] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(null);

  useEffect(() => {
    if (distributorLocations.length > 0) {
      const startIndex = (currentPage - 1) * pointsPerPage;
      const endIndex = startIndex + pointsPerPage;
      setVisibleLocations(distributorLocations.slice(startIndex, endIndex));
    }
  }, [distributorLocations, currentPage, pointsPerPage]);

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
            <MapControls
              countries={countries}
              routes={routes}
              distributorTypes={distributorTypes}
              selectedCountry={selectedCountry}
              selectedRoute={selectedRoute}
              selectedDistributorType={selectedDistributorType}
              onCountryChange={setSelectedCountry}
              onRouteChange={handleRouteChange}
              onDistributorTypeChange={handleDistributorTypeChange}
            />
            {!loading && distributorLocations.length > 0 && (
              <div className="w-full max-w-[1400px] mb-4 p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Showing {visibleLocations.length} of {distributorLocations.length} points
                  </span>
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
              </div>
            )}
            {selectedRoute && routeTotals[selectedRoute] && (
              <div className="mb-4 bg-secondary rounded-lg shadow-sm w-full">
                <div className="flex gap-4 justify-between items-center">
                  <div>
                    <span className="font-semibold">Total Units:</span>{' '}
                    {routeTotals[selectedRoute].units.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Total Liters:</span>{' '}
                    {routeTotals[selectedRoute].liters.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Total USD:</span>{' '}
                    ${routeTotals[selectedRoute].usd.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
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
                      {zone.salesClusters.map((cluster, polyIndex) => (
                        <Polygon
                          key={polyIndex}
                          positions={cluster.points}
                          pathOptions={{
                            fillColor: cluster.color,
                            fillOpacity: 0.8,
                            weight: 6,
                            opacity: 1,
                            color: cluster.color,
                          }}
                        >
                          <Tooltip sticky>
                            <div>
                              <strong>{zone.name}</strong><br/>
                              Total Sales: {cluster.totalSales.toLocaleString()} units<br/>
                              Percentage of total sales: {((cluster.totalSales / routeTotals[selectedRoute].units) * 100).toFixed(2)}%<br/>
                              Points in cluster: {cluster.points.length}
                            </div>
                          </Tooltip>
                        </Polygon>
                      ))}
                    </LayersControl.Overlay>
                  ))}
              </LayersControl>
            </MapContainer>
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