import { ReactNode, memo } from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface HandleConfig {
  type: 'source' | 'target';
  position: Position;
  id: string;
  label?: string;
  style?: React.CSSProperties;
}

export interface BaseNodeProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  colorClass: string;
  handles: HandleConfig[];
  children?: ReactNode;
  className?: string;
  selected?: boolean;
}

const BaseNode = memo(({
  icon: Icon,
  title,
  subtitle,
  colorClass,
  handles,
  children,
  className,
  selected,
}: BaseNodeProps) => {
  return (
    <div
      className={cn(
        'relative min-w-[200px] rounded-xl border border-border bg-card shadow-node transition-all duration-200',
        selected && 'ring-2 ring-primary shadow-node-hover',
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center gap-2 rounded-t-xl px-3 py-2.5',
        colorClass
      )}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/20">
          <Icon className="h-4 w-4 text-inherit" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate">{title}</h3>
          {subtitle && (
            <p className="text-xs opacity-80 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      {children && (
        <div className="p-3 space-y-2">
          {children}
        </div>
      )}

      {/* Handles */}
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          className={cn(
            'transition-all duration-200',
            handle.type === 'target'
              ? 'bg-accent border-accent-foreground'
              : 'bg-primary border-primary-foreground'
          )}
          style={handle.style}
        />
      ))}
    </div>
  );
});

BaseNode.displayName = 'BaseNode';

export default BaseNode;
