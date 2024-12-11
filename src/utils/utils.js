import { toast } from "@/hooks/use-toast"

const url = import.meta.env.VITE_API_URL;

export const fetchRoles = async (setRoles) => {
  try {
    const response = await fetch(`${url}/get-roles`);
    if (!response.ok) {
      throw new Error('Failed to fetch roles');
    }
    const data = await response.json();
    setRoles(data.roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    toast({
      title: "Error",
      description: "Failed to load roles",
      variant: "destructive",
    });
  }
};

export const updateUserData = async (userData) => {
    try {
      const response = await fetch(`${url}/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user data');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

export const fetchDistributorData = async (selectedCountry, selectedDistributorType) => {
  try {
    let url = `${url}/distributor-data?country=${selectedCountry}`;
    
    if (selectedDistributorType) {
      url += `&distributor_type=${selectedDistributorType}`;
    }
    
    const response = await fetch(url);
    const dataJSON = await response.json();
    return dataJSON.distributors;
  } catch (error) {
    console.error('Error fetching distributor data:', error);
    toast({
      title: 'Error',
      description: `Failed to load distributor data for ${selectedCountry}`,
    });
    throw error;
  }
};

export const fetchCountries = async () => {
  try {
    const response = await fetch(`${url}/countries`);
    const data = await response.json();
    return data.countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    toast({
      title: 'Error',
      description: 'Failed to load countries list',
    });
    throw error;
  }
};

export const fetchRoutes = async (selectedCountry) => {
  try {
    const response = await fetch(`${url}/routes-by-country?country=${selectedCountry}`);
    const data = await response.json();
    return data.routes;
  } catch (error) {
    console.error('Error fetching routes:', error);
    toast({
      title: 'Error',
      description: 'Failed to load routes list',
    });
    throw error;
  }
};

export const fetchZonesData = async (selectedCountry) => {
  try {
    const zonesResponse = await fetch(`${url}/distribution-zones?country=${selectedCountry}`);
    const zonesDataJSON = await zonesResponse.json();
    return zonesDataJSON.zones;
  } catch (error) {
    console.error('Error fetching zones:', error);
    toast({
      title: 'Error',
      description: `Failed to load zones for ${selectedCountry}`,
    });
    throw error;
  }
};

export const fetchProductsByCountry = async (selectedCountry) => {
    try {
      const response = await fetch(`${url}/get-products?country=${selectedCountry}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: `Failed to load products for ${selectedCountry}`,
        variant: "destructive",
      });
      throw error;
    }
  };

export const createTask = async (taskData) => {
  try {
    const response = await fetch(`${url}/create-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const data = await response.json();
    return data.task;
  } catch (error) {
    console.error('Error creating task:', error);
    toast({
      title: "Error",
      description: "Failed to create task",
      variant: "destructive",
    });
    throw error;
  }
};