import { memo } from 'react';
import { Position, NodeProps } from 'reactflow';
import { GitMerge } from 'lucide-react';
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
  { type: 'target', position: Position.Left, id: 'input1', style: { top: '35%' } },
  { type: 'target', position: Position.Left, id: 'input2', style: { top: '65%' } },
  { type: 'source', position: Position.Right, id: 'output' },
];

const MergeNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNodeData = usePipelineStore((s) => s.updateNodeData);

  return (
    <BaseNode
      icon={GitMerge}
      title="Merge"
      subtitle={data.strategy || 'concat'}
      colorClass="bg-node-merge text-primary-foreground"
      handles={handles}
      selected={selected}
    >
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Strategy</Label>
        <Select
          value={data.strategy || 'concat'}
          onValueChange={(value) => updateNodeData(id, { strategy: value })}
        >
          <SelectTrigger className="h-8 text-sm bg-secondary border-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="concat">Concatenate</SelectItem>
            <SelectItem value="array">Array</SelectItem>
            <SelectItem value="object">Object Merge</SelectItem>
            <SelectItem value="first">First Non-Empty</SelectItem>
            <SelectItem value="last">Last Non-Empty</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </BaseNode>
  );
});

MergeNode.displayName = 'MergeNode';

export default MergeNode;
