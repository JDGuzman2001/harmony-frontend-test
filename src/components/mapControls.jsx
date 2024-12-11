import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MapControls = ({
  countries,
  routes,
  distributorTypes,
  selectedCountry,
  selectedRoute,
  selectedDistributorType,
  onCountryChange,
  onRouteChange,
  onDistributorTypeChange
}) => {
  return (
    <div className="mb-4 flex justify-center items-center gap-4">
      <div className="mb-4 flex justify-center items-center">
        <div className="mr-4 font-bold">Countries:</div>
        <Select
          value={selectedCountry}
          onValueChange={onCountryChange}
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
          onValueChange={onRouteChange}
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
          onValueChange={onDistributorTypeChange}
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
  );
};

export default MapControls;
