import { useState, useEffect } from 'react';
import Header from '../../components/header';
import { useAuth } from '../../context/authContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { fetchProductsByCountry, fetchCountries, createTask, fetchTasks, updateTask, deleteTask, fetchWorkflowsByOrganization, createWorkflow, deleteWorkflow } from '../../utils/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateTaskDialog } from '../../components/createTaskDialog';
import { WorkflowsCard } from '../../components/action-plans/workflowsCard';
import { AnalyticsCard } from '../../components/action-plans/analyticsCard';
import { TasksCard } from '../../components/action-plans/tasksCard';

const getDepartmentsByRole = (role) => {
  switch (role) {
    case 'Sales Manager':
      return ['Sales'];
    case 'Marketing Manager':
      return ['Marketing', 'Trade Marketing'];
    case 'Administrator':
      return ['Marketing', 'Trade Marketing', 'Sales'];
    default:
      return [];
  }
};

function ActionPlans() {
  const { handleLogout, userInfo } = useAuth();
  const { toast } = useToast();
  const [uniqueProducts, setUniqueProducts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Colombia');
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    averageSalesPerProduct: 0
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [idToUpdate, setIdToUpdate] = useState('');

  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [isDeletingWorkflow, setIsDeletingWorkflow] = useState(false);
  const [idToUpdateWorkflow, setIdToUpdateWorkflow] = useState('');

  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState("workflows");

  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', userInfo?.organization.id],
    queryFn: async () => await fetchTasks(userInfo?.organization.id),
    enabled: !!userInfo?.organization.id && activeTab === 'tasks',
  });

  const { data: productsByCountry = [], isLoading: productsByCountryLoading } = useQuery({
    queryKey: ['productsByCountry', selectedCountry],
    queryFn: async () => await fetchProductsByCountry(selectedCountry),
    enabled: !!selectedCountry && activeTab === 'analytics',
  });

  const departments = getDepartmentsByRole(userInfo?.role.name);
  const canCreateTasks = userInfo?.role.name === 'Administrator';

  const filteredTasks = tasks.filter(task => 
    departments.includes(task.department.name) || task.assigned_to.id === userInfo.id
  );

  const currentMetrics = {
    totalTasks: filteredTasks.length,
    completedTasks: filteredTasks.filter(t => t.status === 'Done').length,
    inProgressTasks: filteredTasks.filter(t => t.status === 'In Progress').length,
    departmentProgress: {
      Marketing: 0,
      'Trade Marketing': 0,
      Sales: 0
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const uniqueProducts = Object.values(
          productsByCountry.reduce((acc, product) => {
            if (!acc[product.product_name]) {
              acc[product.product_name] = {...product};
            } else {
              acc[product.product_name].sales_units += product.sales_units;
            }
            return acc;
          }, {})
        );
        
        const stats = {
          totalProducts: uniqueProducts.length,
          totalSales: uniqueProducts.reduce((sum, product) => sum + product.sales_units, 0),
          averageSalesPerProduct: uniqueProducts.length > 0 
            ? Math.round(uniqueProducts.reduce((sum, product) => sum + product.sales_units, 0) / uniqueProducts.length) 
            : 0
        };
        
        setProductStats(stats);
        setUniqueProducts(uniqueProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } 
    };
    
    if (productsByCountry.length > 0) {
      loadProducts();
    }
  }, [productsByCountry]);

  const { data: countries = [], isLoading: countriesLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => await fetchCountries(),
    enabled: activeTab === 'analytics',
  });

  const { data: workflows = [], isLoading: workflowsLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => await fetchWorkflowsByOrganization(userInfo?.organization.id),
    enabled: !!userInfo?.organization.id && activeTab === 'workflows',
  });

  const { mutate: createNewTask } = useMutation({
    mutationFn: async (taskData) => {
      setIsCreatingTask(true);
      return await createTask(taskData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['tasks']);
      toast({
        title: "Task Created",
        description: "Task has been successfully created",
      });
      setIsCreatingTask(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
      setIsCreatingTask(false);
    },
  });

  const { mutate: updateTaskStatus } = useMutation({
    mutationFn: async ({ taskId, newStatus }) => {
      setIsUpdatingTask(true);
      setIdToUpdate(taskId);
      return await updateTask(taskId, { status: newStatus });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['tasks']);
      toast({
        title: "Task Updated",
        description: "Task status has been successfully updated",
      });
      setIsUpdatingTask(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
      setIsUpdatingTask(false);
    },
  });

  const { mutate: deleteTaskById } = useMutation({
    mutationFn: async (taskId) => {
      setIsDeletingTask(true);
      setIdToUpdate(taskId);
      return await deleteTask(taskId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['tasks']);
      toast({
        title: "Task Deleted",
        description: "Task has been successfully deleted",
      });
      setIsDeletingTask(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
      setIsDeletingTask(false);
    },
  });

  const defaultTab = () => {
    if (userInfo?.role.name === 'Administrator') {
      return 'Marketing';
    } else if (userInfo?.role.name === 'Sales Manager') {
      return 'Sales';
    } else if (userInfo?.role.name === 'Marketing Manager') {
      return 'Marketing';
    } 
  }

  const { mutate: createNewWorkflow } = useMutation({
    mutationFn: async (workflowData) => {
      setIsCreatingWorkflow(true);
      return await createWorkflow(workflowData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['workflows']);
      toast({
        title: "Workflow Created",
        description: "Workflow has been successfully created",
      });
      setIsCreatingWorkflow(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create workflow",
        variant: "destructive",
      });
      setIsCreatingWorkflow(false);
    },
  });

  const { mutate: deleteWorkflowById } = useMutation({
    mutationFn: async (workflowId) => {
      setIsDeletingWorkflow(true);
      setIdToUpdateWorkflow(workflowId);
      return await deleteWorkflow(workflowId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['workflows']);
      toast({
        title: "Workflow Deleted",
        description: "Workflow has been successfully deleted",
      });
      setIsDeletingWorkflow(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete workflow",
        variant: "destructive",
      });
      setIsDeletingWorkflow(false);
      setIdToUpdateWorkflow('');
    },
  });

  return (
    <div className='flex flex-col justify-start items-center min-h-screen bg-background'>
      <Header title="Action Plans" onLogout={handleLogout} />
      
      <div className="w-full max-w-[1400px] p-4 space-y-4">
        <Tabs defaultValue="workflows" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workflows">Workflow</TabsTrigger>
            <TabsTrigger value="analytics">Product Analytics</TabsTrigger>
            <TabsTrigger value="tasks">Tasks Management</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows">
            <WorkflowsCard 
              workflows={workflows} 
              workflowsLoading={workflowsLoading} 
              userInfo={userInfo} 
              onSubmitWorkflow={createNewWorkflow}
              onDeleteWorkflow={deleteWorkflowById}
              isCreatingWorkflow={isCreatingWorkflow}
              idToUpdate={idToUpdateWorkflow}
              isDeletingWorkflow={isDeletingWorkflow}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsCard
              countriesLoading={countriesLoading}
              productsByCountryLoading={productsByCountryLoading}
              uniqueProducts={uniqueProducts}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              countries={countries}
              productStats={productStats}
            />
          </TabsContent>

          <TabsContent value="tasks">
            <TasksCard
              tasksLoading={tasksLoading}
              currentMetrics={currentMetrics}
              departments={departments}
              filteredTasks={filteredTasks}
              canCreateTasks={canCreateTasks}
              setCreateOpen={setCreateOpen}
              isCreatingTask={isCreatingTask}
              isDeletingTask={isDeletingTask}
              isUpdatingTask={isUpdatingTask}
              updateTaskStatus={updateTaskStatus}
              deleteTaskById={deleteTaskById}
              idToUpdate={idToUpdate}
              userInfo={userInfo}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              defaultTab={defaultTab}
            />
          </TabsContent>
        </Tabs>
      </div>

      <CreateTaskDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmitTask={createNewTask}
        userInfo={userInfo}
      />
    </div>
  );
}

export default ActionPlans;
