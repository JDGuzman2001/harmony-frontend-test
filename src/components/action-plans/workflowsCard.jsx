import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRightIcon, Loader2Icon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CreateWorkflowDialog } from "../createWorkflowDialog"
import { useState } from "react";
import { Trash2Icon } from "lucide-react"

export function WorkflowsCard({ 
  workflows, 
  workflowsLoading, 
  userInfo, 
  onSubmitWorkflow, 
  onDeleteWorkflow,
  isCreatingWorkflow, 
  idToUpdate,
  isDeletingWorkflow 
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-2">Workflow</CardTitle>
          <Button onClick={() => setOpen(true)} disabled={isCreatingWorkflow} className="bg-gray-800 hover:bg-gray-700 text-white">
            {isCreatingWorkflow ? <Loader2Icon className="animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Add workflow
          </Button>
        </CardHeader>
        <CardContent>
          {workflowsLoading ? (
            <div className="flex justify-center items-center h-full min-h-[400px]">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {workflows.map((plan) => (
                <div key={plan.id} className="flex items-center justify-between w-full gap-4 ">
                  <Link key={plan.id} to={`/action-plans/${plan.id}?title=${plan.title}`} className={`${((isDeletingWorkflow || isCreatingWorkflow) && idToUpdate === plan.id) ? 'opacity-50 cursor-not-allowed w-full' : 'w-full'}`}>
                    <Card className="hover:bg-gray-100 cursor-pointer transition-colors flex flex-row items-center justify-between p-4">
                      <div className="flex flex-col items-start justify-start">
                        <p className="text-lg font-bold">{plan.title}</p>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      <ArrowRightIcon className="h-6 w-6" />
                    </Card>
                  </Link>
                  <div>
                    <Trash2Icon className="h-6 w-6 text-red-500 hover:text-red-600 transition-all duration-300 cursor-pointer" onClick={() => onDeleteWorkflow(plan.id)} disabled={isDeletingWorkflow || isCreatingWorkflow} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <CreateWorkflowDialog open={open} onOpenChange={setOpen} userInfo={userInfo} onSubmitWorkflow={onSubmitWorkflow} />
    </>
  )
}