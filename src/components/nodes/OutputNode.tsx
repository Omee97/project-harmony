import { memo } from 'react';
import { Position, NodeProps } from 'reactflow';
import { LogOut } from 'lucide-react';
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
  { type: 'target', position: Position.Left, id: 'input' },
];

const OutputNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNodeData = usePipelineStore((s) => s.updateNodeData);

  return (
    <BaseNode
      icon={LogOut}
      title="Output"
      subtitle={data.outputName || 'output'}
      colorClass="bg-node-output text-primary-foreground"
      handles={handles}
      selected={selected}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Name</Label>
          <Input
            value={data.outputName || ''}
            onChange={(e) => updateNodeData(id, { outputName: e.target.value })}
            placeholder="Output name"
            className="h-8 text-sm bg-secondary border-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Type</Label>
          <Select
            value={data.outputType || 'Text'}
            onValueChange={(value) => updateNodeData(id, { outputType: value })}
          >
            <SelectTrigger className="h-8 text-sm bg-secondary border-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Text">Text</SelectItem>
              <SelectItem value="Number">Number</SelectItem>
              <SelectItem value="JSON">JSON</SelectItem>
              <SelectItem value="Image">Image</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </BaseNode>
  );
});

OutputNode.displayName = 'OutputNode';

export default OutputNode;
