import { 
  LogIn, 
  LogOut, 
  Bot, 
  Type, 
  Globe, 
  Shuffle, 
  Filter, 
  GitMerge, 
  GitBranch,
  LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePipelineStore } from '@/store/pipelineStore';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NodeTypeConfig {
  type: string;
  icon: LucideIcon;
  label: string;
  colorClass: string;
}

const nodeTypeConfigs: NodeTypeConfig[] = [
  { type: 'input', icon: LogIn, label: 'Input', colorClass: 'hover:bg-node-input/20 hover:text-node-input' },
  { type: 'output', icon: LogOut, label: 'Output', colorClass: 'hover:bg-node-output/20 hover:text-node-output' },
  { type: 'llm', icon: Bot, label: 'LLM', colorClass: 'hover:bg-node-llm/20 hover:text-node-llm' },
  { type: 'text', icon: Type, label: 'Text', colorClass: 'hover:bg-node-text/20 hover:text-node-text' },
  { type: 'api', icon: Globe, label: 'API', colorClass: 'hover:bg-node-api/20 hover:text-node-api' },
  { type: 'transform', icon: Shuffle, label: 'Transform', colorClass: 'hover:bg-node-transform/20 hover:text-node-transform' },
  { type: 'filter', icon: Filter, label: 'Filter', colorClass: 'hover:bg-node-filter/20 hover:text-node-filter' },
  { type: 'merge', icon: GitMerge, label: 'Merge', colorClass: 'hover:bg-node-merge/20 hover:text-node-merge' },
  { type: 'condition', icon: GitBranch, label: 'Condition', colorClass: 'hover:bg-node-condition/20 hover:text-node-condition' },
];

const Toolbar = () => {
  const addNode = usePipelineStore((s) => s.addNode);

  const handleAddNode = (type: string) => {
    // Add node at a random position within the viewport
    const x = 100 + Math.random() * 400;
    const y = 100 + Math.random() * 300;
    addNode(type, { x, y });
  };

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 rounded-xl border border-border bg-card/95 p-2 shadow-node backdrop-blur-sm">
      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Nodes
      </div>
      <div className="flex flex-col gap-1">
        {nodeTypeConfigs.map(({ type, icon: Icon, label, colorClass }) => (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`justify-start gap-2 ${colorClass} transition-all duration-200`}
                onClick={() => handleAddNode(type)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Add {label} node</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
