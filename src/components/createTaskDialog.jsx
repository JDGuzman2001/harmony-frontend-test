import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery } from '@tanstack/react-query';
import { fetchOrganizationData } from '../utils/utils';
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2).max(50),
  department_id: z.string().min(2).max(50),
  assigned_to_id: z.string().min(2).max(50),
  expected_outcome: z.string().min(2).max(50),
})

export function CreateTaskDialog({ open, onOpenChange, userInfo, onSubmitTask }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      department_id: "",
      assigned_to_id: "",
      expected_outcome: "",
    },
  });

  const { data: organizationData, isLoading } = useQuery({
    queryKey: ['organizationData', userInfo?.organization.id],
    queryFn: () => fetchOrganizationData(userInfo?.organization.id),
    enabled: open && !!userInfo?.organization.id,
  });


  const getFilteredUsers = (departmentId) => {
    if (!organizationData) return [];
    
    const allowedRoles = {
      'marketing': ['Marketing Manager', 'Administrator'],
      'trade_marketing': ['Marketing Manager', 'Administrator'],
      'sales': ['Sales Manager', 'Administrator']
    };

    const department = organizationData.departments.find(d => d.id === departmentId);
    if (!department) return organizationData.users;

    const deptName = department.name.toLowerCase();
    const allowedRolesForDept = 
      deptName.includes('marketing') ? allowedRoles.marketing :
      deptName === 'sales' ? allowedRoles.sales :
      null;

    return allowedRolesForDept
      ? organizationData.users.filter(user => 
          allowedRolesForDept.includes(user.role.name)
        )
      : organizationData.users;
  };

  const onSubmit = form.handleSubmit(async (values) => {
      const taskData = {
        ...values,
        created_by_id: userInfo.id,
        organization_id: userInfo.organization.id,
        status: "In Progress" 
      };
      await onSubmitTask(taskData);
      onOpenChange(false);
      form.reset();
    });

  if (isLoading || !organizationData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex items-center justify-center">
          <Loader2Icon className="w-4 h-4 animate-spin" />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Create a new task for the organization
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />  
              <FormField
                control={form.control}
                name="department_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {organizationData.departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigned_to_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={!form.watch('department_id')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select assigned to" />
                        </SelectTrigger>
                        <SelectContent>
                          {getFilteredUsers(form.watch('department_id')).map(user => (
                            <SelectItem 
                              key={user.id} 
                              value={user.id} 
                              className="flex items-center justify-between w-full"
                            >
                              <p>{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.role.name}</p>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expected_outcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Outcome</FormLabel>
                    <FormControl>
                      <div className="flex flex-row items-center justify-between gap-2">
                        <Input placeholder="Expected Outcome" type="number" {...field} />
                        <p className="text-sm text-muted-foreground">USD</p>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between gap-2">
                <Button type="button" onClick={() => onOpenChange(false)} className="w-full">Cancel</Button>
                <Button type="button" onClick={onSubmit} className="w-full">Create</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
}
