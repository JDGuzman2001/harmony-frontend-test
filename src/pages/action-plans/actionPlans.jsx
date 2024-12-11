import { useState, useEffect } from 'react';
import Header from '../../components/header';
import { useAuth } from '../../context/authContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import TaskCard from '../../components/taskCard';
import { fetchProductsByCountry, fetchCountries, createTask } from '../../utils/utils';
import { BarChart } from "../../components/barChart";
import { Loader2Icon } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const DEPARTMENTS = ['Marketing', 'Trade Marketing', 'Sales'];


function ActionPlans() {
  const { handleLogout, userInfo } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
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
  const [products, setProducts] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('Colombia');
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    averageSalesPerProduct: 0
  });

  useEffect(() => {
    const mockTasks = [
      {
        id: 1,
        title: 'Optimize Campaign ROI',
        department: 'Marketing',
        status: 'In Progress',
        assignee: 'John Doe',
        progress: 65,
        expectedOutcome: '300K'
      },
    ];
    setTasks(mockTasks);
  }, []);

  useEffect(() => {
    const newMetrics = {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'Done').length,
      inProgressTasks: tasks.filter(t => t.status === 'In Progress').length,
      departmentProgress: DEPARTMENTS.reduce((acc, dept) => {
        const deptTasks = tasks.filter(t => t.department === dept);
        acc[dept] = deptTasks.length ? 
          (deptTasks.filter(t => t.status === 'Done').length / deptTasks.length) * 100 : 0;
        return acc;
      }, {})
    };
    setMetrics(newMetrics);
  }, [tasks]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const productsData = await fetchProductsByCountry(selectedCountry);
        
        const uniqueProducts = Object.values(
          productsData.reduce((acc, product) => {
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
        setProducts(uniqueProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [selectedCountry]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoading(true);
        const countriesData = await fetchCountries();
        setCountries(countriesData);
        if (countriesData.length > 0 && !selectedCountry) {
          setSelectedCountry(countriesData[0]);
        }
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCountries();
  }, []);

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    toast({
      title: "Task Updated",
      description: "Task status has been successfully updated",
    });
  };

  const handleCreateTask = async () => {
    const taskData = {
      title: "Nueva tarea",
      department: "Marketing",
      status: "in_progress",
      assignee: "John Doe",
      created_by: userInfo?.id,
      expectedOutcome: "100000",
      organization_id: userInfo?.organization.id
    };

    try {
      await createTask(taskData);
      toast({
        title: "Task Created",
        description: "Task has been successfully created",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  };

  return (
    <div className='flex flex-col justify-start items-center min-h-screen bg-background'>
      <Header title="Action Plans" onLogout={handleLogout} />
      
      <div className="w-full max-w-[1400px] p-4 space-y-4">
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

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Product Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-full min-h-[400px]">
                <Loader2Icon className="animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between"> 
                  <BarChart 
                    data={products.map(product => ({
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
            )}
          </CardContent>
        </Card>

        {/* Department Tabs */}
        <Tabs defaultValue="Marketing" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              {DEPARTMENTS.map(dept => (
                <TabsTrigger key={dept} value={dept}>
                  {dept}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </div>

          {DEPARTMENTS.map(dept => (
            <TabsContent key={dept} value={dept}>
              <Card>
                <CardHeader>
                  <CardTitle>{dept} Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks
                      .filter(task => task.department === dept)
                      .map(task => (
                        <TaskCard 
                          key={task.id}
                          task={task}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default ActionPlans;
