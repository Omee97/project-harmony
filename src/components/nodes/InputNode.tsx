import { memo } from 'react';
import { Position, NodeProps } from 'reactflow';
import { LogIn } from 'lucide-react';
import BaseNode, { HandleConfig } from './BaseNode';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePipelineStore } from '@/store/pipelineStore';

const handles: HandleConfig[] = [
  { type: 'source', position: Position.Right, id: 'output' },
];

const InputNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNodeData = usePipelineStore((s) => s.updateNodeData);

  return (
    <BaseNode
      icon={LogIn}
      title="Input"
      subtitle={data.inputName || 'input'}
      colorClass="bg-node-input text-background"
      handles={handles}
      selected={selected}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Name</Label>
          <Input
            value={data.inputName || ''}
            onChange={(e) => updateNodeData(id, { inputName: e.target.value })}
            placeholder="Variable name"
            className="h-8 text-sm bg-secondary border-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Type</Label>
          <Select
            value={data.inputType || 'Text'}
            onValueChange={(value) => updateNodeData(id, { inputType: value })}
          >
            <SelectTrigger className="h-8 text-sm bg-secondary border-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Text">Text</SelectItem>
              <SelectItem value="Number">Number</SelectItem>
              <SelectItem value="File">File</SelectItem>
              <SelectItem value="Image">Image</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </BaseNode>
  );
});

InputNode.displayName = 'InputNode';

export default InputNode;
