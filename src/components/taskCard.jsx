import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider"

const STATUS_OPTIONS = ['In Progress', 'Done'];

function TaskCard({ task, onStatusChange, onDeleteTask, userRole }) {  
  const [isHovering, setIsHovering] = useState(false);
  const [sliderValue, setSliderValue] = useState(task.status === 'Done' ? [100] : [0]);
  const [localStatus, setLocalStatus] = useState(task.status);
  const isAdmin = userRole === 'Administrator';

  const handleProgressChange = (taskId, value) => {
    setSliderValue(value);
    if (value[0] === 100 && localStatus !== 'Done') {
      setLocalStatus('Done');
      onStatusChange({ taskId, newStatus: 'Done' });
    } else if (value[0] < 100 && localStatus === 'Done') {
      setLocalStatus('In Progress');
      onStatusChange({ taskId, newStatus: 'In Progress' });
    }
  };

  return (
    <Card className="w-full max-h-[300px] relative hover:bg-gray-100 transition-all duration-300" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      {isHovering && isAdmin && (
        <Trash2Icon className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-all duration-300 cursor-pointer" onClick={() => onDeleteTask(task.id)}/>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg w-full">{task.title}</CardTitle>
          <Slider 
            value={sliderValue} 
            onValueChange={(value) => handleProgressChange(task.id, value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Assigned To</p>
            <p>{task.assigned_to.name}, {task.assigned_to.role.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Created By</p>
            <p>{task.created_by.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expected Outcome</p>
            <p>${new Intl.NumberFormat('en-US').format(task.expected_outcome)} USD</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Select
              value={localStatus}
              onValueChange={(newStatus) => {
                setLocalStatus(newStatus);
                onStatusChange({ taskId: task.id, newStatus });
              }}
            >
              <SelectTrigger>
                <SelectValue>{localStatus}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TaskCard;
