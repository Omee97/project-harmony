import { memo } from 'react';
import { Position, NodeProps } from 'reactflow';
import { GitBranch } from 'lucide-react';
import BaseNode, { HandleConfig } from './BaseNode';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePipelineStore } from '@/store/pipelineStore';

const handles: HandleConfig[] = [
  { type: 'target', position: Position.Left, id: 'input' },
  { type: 'source', position: Position.Right, id: 'true', style: { top: '35%' } },
  { type: 'source', position: Position.Right, id: 'false', style: { top: '65%' } },
];

const ConditionNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNodeData = usePipelineStore((s) => s.updateNodeData);

  return (
    <BaseNode
      icon={GitBranch}
      title="Condition"
      subtitle="if/else branch"
      colorClass="bg-node-condition text-background"
      handles={handles}
      selected={selected}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Expression</Label>
          <Input
            value={data.expression || ''}
            onChange={(e) => updateNodeData(id, { expression: e.target.value })}
            placeholder="e.g., input === 'yes'"
            className="h-8 text-sm bg-secondary border-none font-mono text-xs"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            True
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            False
          </span>
        </div>
      </div>
    </BaseNode>
  );
});

ConditionNode.displayName = 'ConditionNode';

export default ConditionNode;
