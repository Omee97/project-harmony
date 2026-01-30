import { memo } from 'react';
import { Position, NodeProps } from 'reactflow';
import { Shuffle } from 'lucide-react';
import BaseNode, { HandleConfig } from './BaseNode';
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
  { type: 'source', position: Position.Right, id: 'output' },
];

const TransformNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNodeData = usePipelineStore((s) => s.updateNodeData);

  return (
    <BaseNode
      icon={Shuffle}
      title="Transform"
      subtitle={data.operation || 'uppercase'}
      colorClass="bg-node-transform text-primary-foreground"
      handles={handles}
      selected={selected}
    >
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Operation</Label>
        <Select
          value={data.operation || 'uppercase'}
          onValueChange={(value) => updateNodeData(id, { operation: value })}
        >
          <SelectTrigger className="h-8 text-sm bg-secondary border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uppercase">Uppercase</SelectItem>
            <SelectItem value="lowercase">Lowercase</SelectItem>
            <SelectItem value="capitalize">Capitalize</SelectItem>
            <SelectItem value="trim">Trim</SelectItem>
            <SelectItem value="reverse">Reverse</SelectItem>
            <SelectItem value="json_parse">JSON Parse</SelectItem>
            <SelectItem value="json_stringify">JSON Stringify</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </BaseNode>
  );
});

TransformNode.displayName = 'TransformNode';

export default TransformNode;
