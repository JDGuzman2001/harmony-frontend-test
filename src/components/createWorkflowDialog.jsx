import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().optional()
})

export function CreateWorkflowDialog({ open, onOpenChange, userInfo, onSubmitWorkflow }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
      const workflowData = {
        ...values,
        created_by_id: userInfo.id,
        organization_id: userInfo.organization.id,
      };
      await onSubmitWorkflow(workflowData);
      onOpenChange(false);
      form.reset();
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Workflow</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Create a new workflow for the organization
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> 
              <div className="flex items-center justify-between gap-2">
                <Button type="button" onClick={() => onOpenChange(false)} className="w-full bg-red-500 hover:bg-red-600 text-white">Cancel</Button>
                <Button type="button" onClick={onSubmit} className="w-full bg-gray-800 hover:bg-gray-700 text-white">Create</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
}
