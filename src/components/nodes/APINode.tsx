import { memo } from 'react';
import { Position, NodeProps } from 'reactflow';
import { Globe } from 'lucide-react';
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
  { type: 'target', position: Position.Left, id: 'body' },
  { type: 'source', position: Position.Right, id: 'response' },
];

const APINode = memo(({ id, data, selected }: NodeProps) => {
  const updateNodeData = usePipelineStore((s) => s.updateNodeData);

  return (
    <BaseNode
      icon={Globe}
      title="API"
      subtitle={data.method || 'GET'}
      colorClass="bg-node-api text-background"
      handles={handles}
      selected={selected}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Method</Label>
          <Select
            value={data.method || 'GET'}
            onValueChange={(value) => updateNodeData(id, { method: value })}
          >
            <SelectTrigger className="h-8 text-sm bg-secondary border-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">URL</Label>
          <Input
            value={data.url || ''}
            onChange={(e) => updateNodeData(id, { url: e.target.value })}
            placeholder="https://api.example.com/..."
            className="h-8 text-sm bg-secondary border-none font-mono text-xs"
          />
        </div>
      </div>
    </BaseNode>
  );
});

APINode.displayName = 'APINode';

export default APINode;
