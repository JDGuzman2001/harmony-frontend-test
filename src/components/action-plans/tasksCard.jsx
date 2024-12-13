import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Loader2Icon } from 'lucide-react'
import TaskCard from '../taskCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TasksCard({ 
  tasksLoading,
  currentMetrics,
  departments,
  filteredTasks,
  canCreateTasks,
  setCreateOpen,
  isCreatingTask,
  isDeletingTask,
  isUpdatingTask,
  updateTaskStatus,
  deleteTaskById,
  idToUpdate,
  userInfo,
  statusFilter,
  setStatusFilter,
  defaultTab
}) {
  return (
    <>
    {tasksLoading ? (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-2">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-full min-h-[400px]">
            <Loader2Icon className="animate-spin" />
          </div>
        </CardContent>
      </Card>
    ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{currentMetrics.totalTasks}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{currentMetrics.completedTasks}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{currentMetrics.inProgressTasks}</p>
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
                <Button onClick={() => setCreateOpen(true)} disabled={isCreatingTask} >{isCreatingTask ? <div className="flex items-center justify-center gap-2">Creating Task <Loader2Icon className="animate-spin" /></div> : 'Create Task'}</Button>
              )}
            </div>

            {departments.map(dept => (
              <TabsContent key={dept} value={dept}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold">{dept} Tasks</CardTitle>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Tasks</SelectItem>
                          <SelectItem value="Done">Completed</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredTasks.length > 0 ? ( 
                        <div className="flex flex-col w-full h-[400px] overflow-y-auto gap-4 px-8">
                          {filteredTasks
                            .filter(task => task.department.name === dept)
                            .filter(task => statusFilter === 'all' ? true : task.status === statusFilter).length > 0 ? (
                              <> 
                                {filteredTasks
                                  .filter(task => task.department.name === dept)
                                  .filter(task => statusFilter === 'all' ? true : task.status === statusFilter)
                                  .map(task => (
                                    <TaskCard 
                                      key={task.id}
                                      task={task}
                                      onStatusChange={updateTaskStatus}
                                      onDeleteTask={deleteTaskById}
                                      idToUpdate={idToUpdate}
                                      isDeletingTask={isDeletingTask}
                                      isUpdatingTask={isUpdatingTask}
                                      userInfo={userInfo}
                                    />
                                  ))}
                              </>
                            ) : (
                              <div className="flex flex-col justify-center items-center h-[400px] text-center">
                                <p className="text-lg font-semibold text-muted-foreground">No {statusFilter === 'all' ? '' : statusFilter.toLowerCase()} tasks found</p>
                                <p className="text-sm text-muted-foreground">
                                  {statusFilter === 'all' 
                                    ? 'Create a new task to get started'
                                    : `No ${statusFilter.toLowerCase()} tasks in ${dept}`}
                                </p>
                              </div>
                            )}
                        </div>
                      ) : (
                        <div className="flex flex-col justify-center items-center h-[400px] text-center">
                          <p className="text-lg font-semibold text-muted-foreground">No {statusFilter === 'all' ? '' : statusFilter.toLowerCase()} tasks found</p>
                          <p className="text-sm text-muted-foreground">
                            {statusFilter === 'all' 
                              ? 'Create a new task to get started'
                              : `No ${statusFilter.toLowerCase()} tasks in ${dept}`}
                          </p>
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
    </>
  )
}