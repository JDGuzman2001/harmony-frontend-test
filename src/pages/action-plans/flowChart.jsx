import { useParams, useSearchParams } from 'react-router-dom';
import Header from '../../components/header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '../../context/authContext';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  addEdge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { Plus } from 'lucide-react';
import CustomNode from '../../components/customNode';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { createNode, fetchEdgesByWorkflow, fetchNodesByWorkflow, updateNodes } from '../../utils/utils';
import { useToast } from '../../hooks/use-toast';

function FlowChart() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const title = searchParams.get('title');
  const description = searchParams.get('description');
  const { handleLogout } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 100, y: 100 });
  const { toast } = useToast();
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [isUpdatingNodes, setIsUpdatingNodes] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: nodesFromWorkflowInformation = [], isLoading: nodesLoading } = useQuery({
    queryKey: ['nodes', id],
    queryFn: async () => await fetchNodesByWorkflow(id),
    enabled: !!id,
  });

  const { data: edgesFromWorkflowInformation = [], isLoading: edgesLoading } = useQuery({
    queryKey: ['edges', id],
    queryFn: async () => await fetchEdgesByWorkflow(id),
    enabled: !!id,
  });

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesFromWorkflowInformation || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesFromWorkflowInformation || []);

  const {mutate: createNodeData} = useMutation({
    mutationFn: async (nodeData) => {
      setIsCreatingNode(true);
      return await createNode(nodeData, id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['nodes', id]);
      toast({
        title: "Node Created",
        description: "Node has been successfully created",
      });
      setIsCreatingNode(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create node",
        variant: "destructive",
      });
      setIsCreatingNode(false);
    },
  });

  const { mutate: updateNodesData } = useMutation({
    mutationFn: async ({ nodes, edges, workflowId }) => {
      setIsUpdatingNodes(true);
      return await updateNodes(nodes, edges, workflowId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['nodes', id]);
      toast({
        title: "Nodes Updated",
        description: "Nodes have been successfully updated",
      });
      setIsUpdatingNodes(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update nodes",
        variant: "destructive",
      });
      setIsUpdatingNodes(false);
    },
  });

  const nodeTypes = {
    custom: CustomNode
  };

  const handleAddNodeClick = () => {
    setIsDialogOpen(true);
  };

  const handleAddNode = () => {
    if (nodeName.trim()) {
      const newNode = {
        id: crypto.randomUUID(),
        type: 'custom',
        position: mousePosition,
        data: { label: nodeName },
        dragging: false,
        height: 100,
        width: 100,
        positionAbsolute: { x: mousePosition.x, y: mousePosition.y },   
        selected: false,
      };

      createNodeData(newNode);
      setNodes(prevNodes => [...prevNodes, newNode]);
      setNodeName('');
      setIsDialogOpen(false);
      
      setMousePosition(prev => ({ x: prev.x, y: prev.y + 100 }));
    }
  };

  const onConnect = (params) => {
    setEdges((eds) => addEdge(params, eds));
  };

  const onNodesDelete = (deleted) => {
    setEdges(edges.filter(edge => {
      return !deleted.some(node => 
        node.id === edge.source || node.id === edge.target
      );
    }));
  };

  const onEdgesDelete = (deleted) => {
    setEdges(edges.filter(edge => 
      !deleted.some(deletedEdge => deletedEdge.id === edge.id)
    ));
  };

  const handleSaveNodes = () => {
    updateNodesData({ nodes: nodes, edges: edges, workflowId: id });
  };    

  return (
    <div className='flex flex-col justify-start items-center min-h-screen bg-background'>
      <Header title={`Workflow: ${title}`} onLogout={handleLogout} onBack={true} onBackUrl={`/action-plans`} />
      
      <div className="w-full max-w-[1400px] p-4 space-y-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{description}</CardTitle>
            <div className="flex flex-row items-center justify-center">
                <Button onClick={handleAddNodeClick} variant="outline" disabled={isCreatingNode || isUpdatingNodes}>
                    {isCreatingNode ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Add Node
                </Button>
                <Button className="ml-2 hover:bg-gray-600 text-white" onClick={handleSaveNodes} disabled={isUpdatingNodes || isCreatingNode}>
                    {isUpdatingNodes ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Save'}
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            {nodesLoading || edgesLoading ? 
                <div className="flex justify-center items-center h-full min-h-[400px]">
                    <Loader2Icon className="animate-spin" />
                </div> : 
                <div className="w-full h-[600px] border rounded-lg">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodesDelete={onNodesDelete}
                        onEdgesDelete={onEdgesDelete}
                        nodeTypes={nodeTypes}
                        fitView
                    >
                        <Background />
                        <Controls />
                        <MiniMap />
                    </ReactFlow>
                </div>
            }
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Node</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter node name"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddNode();
              }
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNode}>
              Add Node
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FlowChart;