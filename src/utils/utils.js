import { toast } from "@/hooks/use-toast"

const url = import.meta.env.VITE_API_URL;

// USER

export const fetchUserInfo = async (uid) => {
  try {
    const response = await fetch(`${url}/get-user-info?user_id=${uid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    const data = await response.json();
    return data.user_info;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};

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

// ORGANIZATION

export const fetchOrganizationData = async (organizationId) => {
  try {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    const response = await fetch(`${url}/get-organization-info?organization_id=${organizationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch organization data');
    }

    const data = await response.json();
    return data.organization;
  } catch (error) {
    console.error('Error fetching organization data:', error);
    toast({
      title: "Error",
      description: "Failed to load organization data",
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchDistributorData = async (selectedCountry, selectedDistributorType) => {
  try {
    let newUrl = `${url}/distributor-data?country=${selectedCountry}`;
    
    if (selectedDistributorType) {
      newUrl += `&distributor_type=${selectedDistributorType}`;
    }
    
    const response = await fetch(newUrl);
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

// TASKS

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

export const updateTask = async (taskId, newStatus) => {
  try {
    const response = await fetch(`${url}/update-task?task_id=${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    const data = await response.json();
    return data.task;
  } catch (error) {
    console.error('Error updating task:', error);
    toast({
      title: "Error",
      description: "Failed to update task",
      variant: "destructive",
    });
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${url}/delete-task?task_id=${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    const data = await response.json();
    return data.task;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const fetchTasks = async (organizationId) => {
  try {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    const response = await fetch(`${url}/get-tasks-by-organization?organization_id=${organizationId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const data = await response.json();
    return data.tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    toast({
      title: "Error",
      description: "Failed to load tasks",
      variant: "destructive",
    });
    throw error;
  }
};

// WORKFLOWS

export const fetchWorkflowsByOrganization = async (organizationId) => {
  try {
    const response = await fetch(`${url}/get-workflows-by-organization?organization_id=${organizationId}`);
    const data = await response.json();
    return data.workflows;
  } catch (error) {
    console.error('Error fetching workflows:', error);
    throw error;
  }
};

export const fetchNodesByWorkflow = async (workflowId) => {
  try {
    const response = await fetch(`${url}/get-nodes-by-workflow?workflow_id=${workflowId}`);
    const data = await response.json();
    return data.nodes;
  } catch (error) {
    console.error('Error fetching nodes:', error);
    throw error;
  }
};

export const fetchEdgesByWorkflow = async (workflowId) => {
  try {
    const response = await fetch(`${url}/get-edges-by-workflow?workflow_id=${workflowId}`);
    const data = await response.json();
    return data.edges;
  } catch (error) {
    console.error('Error fetching edges:', error);
    throw error;
  }
};

export const createWorkflow = async (workflowData) => {
  try {
    const response = await fetch(`${url}/create-workflow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflowData),
    });

    if (!response.ok) {
      throw new Error('Failed to create workflow');
    }

    const data = await response.json();
    return data.task;
  } catch (error) {
    console.error('Error creating workflow:', error);
    toast({
      title: "Error",
      description: "Failed to create workflow",
      variant: "destructive",
    });
    throw error;
  }
};

export const deleteWorkflow = async (workflowId) => {
  try {
    const response = await fetch(`${url}/delete-workflow?workflow_id=${workflowId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete workflow');
    }

    const data = await response.json();
    return data.workflow;
  } catch (error) {
    console.error('Error deleting workflow:', error);
    throw error;
  }
};

export const createNode = async (nodeData, workflowId) => {
  try {
    const response = await fetch(`${url}/create-node?workflow_id=${workflowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nodeData),
    });

    if (!response.ok) {
      throw new Error('Failed to create node');
    }

    const data = await response.json();
    return data.node;
  } catch (error) {
    console.error('Error creating node:', error);
    toast({
      title: "Error",
      description: "Failed to create node",
      variant: "destructive",
    });
    throw error;
  }
};

export const updateNodes = async (nodes, edges, workflowId) => {
  try {
    const response = await fetch(`${url}/update-nodes`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nodes: nodes, edges: edges, workflow_id: workflowId }),
    });

    if (!response.ok) {
      throw new Error('Failed to update nodes');
    }

    const data = await response.json();
    return data.task;
  } catch (error) {
    console.error('Error updating nodes:', error);
    toast({
      title: "Error",
      description: "Failed to update nodes",
      variant: "destructive",
    });
    throw error;
  }
};

// CHAT

export const fetchUserMessages = async (userId) => {
  try {
    const response = await fetch(`${url}/get-user-messages?user_id=${userId}`);
    const data = await response.json();
    const parsedData = JSON.parse(data.user_messages.ia_answer);
    return parsedData
  } catch (error) {
    console.error('Error fetching user messages:', error);
    throw error;
  }
};

export const getAnswerToChat = async (message, userId) => {
  try {
    const response = await fetch(`${url}/get-answer-to-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message, user_id: userId }),
    });
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error fetching answer to chat:', error);
    throw error;
  }
};
