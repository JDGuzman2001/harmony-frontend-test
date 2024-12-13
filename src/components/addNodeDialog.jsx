import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function AddNodeDialog({ open, onClose, onAdd }) {
  const [nodeName, setNodeName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nodeName.trim()) {
      onAdd(nodeName);
      setNodeName("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir nuevo nodo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Input
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="Nombre del nodo"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Añadir</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddNodeDialog;
