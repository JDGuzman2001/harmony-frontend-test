import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_OPTIONS = ['Backlog', 'Ready', 'In Progress', 'Done'];

function TaskCard({ task, onStatusChange }) {
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Assignee</p>
            <p>{task.assignee}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expected Outcome</p>
            <p>{task.expectedOutcome}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Select
              value={task.status}
              onValueChange={(value) => onStatusChange(task.id, value)}
            >
              <SelectTrigger>
                <SelectValue>{task.status}</SelectValue>
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
