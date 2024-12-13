import { Handle, Position } from 'reactflow';

function CustomNode({ data }) {
  const handleStyle = {
    width: '8px',
    height: '8px',
    background: '#555',
    border: '1px solid #fff'
  };

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border border-gray-200 min-w-[100px] text-center">
      <Handle
        type="target"
        position={Position.Top}
        style={handleStyle}
        id="top"
      />
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
        id="left"
      />
      <div className="font-medium text-sm">{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
        id="right"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={handleStyle}
        id="bottom"
      />
    </div>
  );
}

export default CustomNode; 