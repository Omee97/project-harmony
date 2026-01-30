import { memo, useMemo, useEffect, useRef } from 'react';
import { Position, NodeProps, Handle } from 'reactflow';
import { Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { usePipelineStore } from '@/store/pipelineStore';

// Extract variables from text: {{ variableName }}
const extractVariables = (text: string): string[] => {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const variables: string[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  return variables;
};

const TextNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNodeData = usePipelineStore((s) => s.updateNodeData);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const text = data.text || '';
  
  // Extract variables from text
  const variables = useMemo(() => extractVariables(text), [text]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(60, textareaRef.current.scrollHeight)}px`;
    }
  }, [text]);

  // Calculate node height based on content and variables
  const minHeight = Math.max(120, 80 + variables.length * 24 + (text.split('\n').length * 20));

  return (
    <div
      className={cn(
        'relative rounded-xl border border-border bg-card shadow-node transition-all duration-200',
        selected && 'ring-2 ring-primary shadow-node-hover'
      )}
      style={{ minWidth: 240, minHeight }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 rounded-t-xl px-3 py-2.5 bg-node-text text-background">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/20">
          <Type className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold">Text</h3>
          <p className="text-xs opacity-80">
            {variables.length > 0 ? `${variables.length} variable${variables.length > 1 ? 's' : ''}` : 'Static text'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => updateNodeData(id, { text: e.target.value })}
          placeholder="Enter text... Use {{ variable }} for inputs"
          className="min-h-[60px] resize-none bg-secondary border-none text-sm"
          style={{ height: 'auto' }}
        />
        
        {variables.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {variables.map((v) => (
              <span
                key={v}
                className="inline-flex items-center rounded-full bg-node-text/20 px-2 py-0.5 text-xs font-medium text-node-text"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic input handles for variables */}
      {variables.map((variable, index) => (
        <Handle
          key={`input-${variable}`}
          type="target"
          position={Position.Left}
          id={variable}
          className="bg-accent border-accent-foreground transition-all duration-200"
          style={{ top: 80 + index * 24 }}
        />
      ))}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="bg-primary border-primary-foreground transition-all duration-200"
      />
    </div>
  );
});

TextNode.displayName = 'TextNode';

export default TextNode;
