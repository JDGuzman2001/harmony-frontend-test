import { useState, useEffect } from 'react';
import Header from '../../components/header';
import { useAuth } from '../../context/authContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import TaskCard from '../../components/taskCard';
import { fetchProductsByCountry, fetchCountries, createTask, fetchTasks, updateTask, deleteTask } from '../../utils/utils';
import { BarChart } from "../../components/barChart";
import { Loader2Icon } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateTaskDialog } from '../../components/CreateTaskDialog';

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
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    departmentProgress: {
      Marketing: 0,
      'Trade Marketing': 0,
      Sales: 0
    }
  });
  const [uniqueProducts, setUniqueProducts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Colombia');
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    averageSalesPerProduct: 0
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', userInfo?.organization.id],
    queryFn: async () => await fetchTasks(userInfo?.organization.id),
    enabled: !!userInfo?.organization.id,
  });

  const { data: productsByCountry = [], isLoading: productsByCountryLoading } = useQuery({
    queryKey: ['productsByCountry', selectedCountry],
    queryFn: async () => await fetchProductsByCountry(selectedCountry),
    enabled: !!selectedCountry,
  });

  const departments = getDepartmentsByRole(userInfo?.role.name);
  const canCreateTasks = userInfo?.role.name === 'Administrator';

  const filteredTasks = tasks.filter(task => 
    departments.includes(task.department.name) || task.assigned_to.id === userInfo.id
  );

  useEffect(() => {
    const newMetrics = {
      totalTasks: filteredTasks.length,
      completedTasks: filteredTasks.filter(t => t.status === 'Done').length,
      inProgressTasks: filteredTasks.filter(t => t.status === 'In Progress').length,
    };
    setMetrics(newMetrics);
  }, [filteredTasks]);

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
      console.log('Updating task:', { taskId, newStatus });
      return await updateTask(taskId, { status: newStatus });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['tasks']);
      toast({
        title: "Task Updated",
        description: "Task status has been successfully updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteTaskById } = useMutation({
    mutationFn: async (taskId) => {
      return await deleteTask(taskId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['tasks']);
      toast({
        title: "Task Deleted",
        description: "Task has been successfully deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
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

  return (
    <div className='flex flex-col justify-start items-center min-h-screen bg-background'>
      <Header title="Action Plans" onLogout={handleLogout} />
      
      <div className="w-full max-w-[1400px] p-4 space-y-4">
        <Card className="w-full">
          <CardContent>
            {countriesLoading || productsByCountryLoading ? (
              <div className="flex justify-center items-center h-full min-h-[400px]">
                <Loader2Icon className="animate-spin" />
              </div>
            ) : (
              <>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Product Analytics</CardTitle>
                </CardHeader>
                <div className="space-y-6">
                  <div className="flex items-center justify-between"> 
                    <BarChart 
                      data={uniqueProducts.map(product => ({
                        name: product.product_name,
                        sales_units: product.sales_units || 0
                      }))}
                      xAxis="name"
                      yAxis="sales_units"
                      title="Product Sales"
                    />
                    <div className="flex flex-col items-start justify-center gap-2">
                      <div className='flex flex-row items-center justify-between gap-2'>
                        <p className="text-sm font-bold">Country</p>
                        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(country => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex flex-col w-full">
                        <div className="text-center flex items-center justify-between gap-2">
                          <p className="text-sm text-muted-foreground">Total Products</p>
                          <p className="text-xl font-bold">{productStats.totalProducts}</p>
                        </div>
                        <div className="text-center flex items-center justify-between gap-2">
                          <p className="text-sm text-muted-foreground">Total Sales</p>
                          <p className="text-xl font-bold">{productStats.totalSales.toLocaleString()}</p>
                        </div>
                        <div className="text-center flex items-center justify-between gap-2">
                          <p className="text-sm text-muted-foreground">Avg Sales/Product</p>
                          <p className="text-xl font-bold">{productStats.averageSalesPerProduct.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {tasksLoading ? (
          <div className="flex justify-center items-center h-full min-h-[400px] w-full">
            <Card className="w-full">
              <CardContent className="flex justify-center items-center h-full min-h-[400px] w-full">
                <Loader2Icon className="animate-spin" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{metrics.totalTasks}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Completed Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{metrics.completedTasks}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{metrics.inProgressTasks}</p>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue={defaultTab()} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                {departments.map(dept => (
                  <TabsTrigger key={dept} value={dept}>
                    <div className="flex items-center justify-between gap-2">
                      {dept}
                      <p className="text-sm text-muted-foreground rounded-full bg-gray-200 px-2 py-1s">
                        {filteredTasks.filter(task => task.department.name === dept).length}
                      </p>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
              {canCreateTasks &&  (
                <Button onClick={() => setCreateOpen(true)}>{isCreatingTask ? <div className="flex items-center justify-center gap-2">Creating Task <Loader2Icon className="animate-spin" /></div> : 'Create Task'}</Button>
              )}
            </div>

            {departments.map(dept => (
              <TabsContent key={dept} value={dept}>
                <Card>
                  <CardHeader>
                    <CardTitle>{dept} Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredTasks.length > 0 ? ( 
                        <div className="flex flex-col w-full h-[400px] overflow-y-auto gap-4 px-8">
                          {filteredTasks
                            .filter(task => task.department.name === dept)
                            .map(task => (
                              <TaskCard 
                                key={task.id}
                                task={task}
                                onStatusChange={updateTaskStatus}
                                onDeleteTask={deleteTaskById}
                                userRole={userInfo?.role.name}
                              />
                            ))
                          }
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-[400px] ">
                          <p className="text-sm text-muted-foreground">No tasks found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
          </>
        )}
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
