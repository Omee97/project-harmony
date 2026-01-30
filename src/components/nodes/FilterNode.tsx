import { memo } from 'react';
import { Position, NodeProps } from 'reactflow';
import { Filter } from 'lucide-react';
import BaseNode, { HandleConfig } from './BaseNode';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePipelineStore } from '@/store/pipelineStore';

const handles: HandleConfig[] = [
  { type: 'target', position: Position.Left, id: 'input' },
  { type: 'source', position: Position.Right, id: 'passed', style: { top: '35%' } },
  { type: 'source', position: Position.Right, id: 'failed', style: { top: '65%' } },
];

const FilterNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNodeData = usePipelineStore((s) => s.updateNodeData);

  return (
    <BaseNode
      icon={Filter}
      title="Filter"
      subtitle="condition check"
      colorClass="bg-node-filter text-background"
      handles={handles}
      selected={selected}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Condition</Label>
          <Input
            value={data.condition || ''}
            onChange={(e) => updateNodeData(id, { condition: e.target.value })}
            placeholder="e.g., value.length > 0"
            className="h-8 text-sm bg-secondary border-none font-mono text-xs"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Passed
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Failed
          </span>
        </div>
      </div>
    </BaseNode>
  );
});

FilterNode.displayName = 'FilterNode';

export default FilterNode;
