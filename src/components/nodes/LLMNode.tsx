import { memo } from 'react';
import { Position, NodeProps } from 'reactflow';
import { Bot } from 'lucide-react';
import BaseNode, { HandleConfig } from './BaseNode';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePipelineStore } from '@/store/pipelineStore';

const handles: HandleConfig[] = [
  { type: 'target', position: Position.Left, id: 'prompt' },
  { type: 'source', position: Position.Right, id: 'response' },
];

const LLMNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNodeData = usePipelineStore((s) => s.updateNodeData);

  return (
    <BaseNode
      icon={Bot}
      title="LLM"
      subtitle={data.model || 'gpt-4'}
      colorClass="bg-node-llm text-primary-foreground"
      handles={handles}
      selected={selected}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Model</Label>
          <Select
            value={data.model || 'gpt-4'}
            onValueChange={(value) => updateNodeData(id, { model: value })}
          >
            <SelectTrigger className="h-8 text-sm bg-secondary border-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="claude-3">Claude 3</SelectItem>
              <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Temperature</Label>
            <span className="text-xs font-mono text-muted-foreground">
              {(data.temperature ?? 0.7).toFixed(2)}
            </span>
          </div>
          <Slider
            value={[data.temperature ?? 0.7]}
            min={0}
            max={2}
            step={0.01}
            onValueChange={([value]) => updateNodeData(id, { temperature: value })}
            className="w-full"
          />
        </div>
      </div>
    </BaseNode>
  );
});

LLMNode.displayName = 'LLMNode';

export default LLMNode;
