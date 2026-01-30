import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { usePipelineStore } from '@/store/pipelineStore';
import { nodeTypes } from '@/components/nodes';
import Toolbar from '@/components/Toolbar';
import SubmitButton from '@/components/SubmitButton';

const PipelineEditor = () => {
  const nodes = usePipelineStore((s) => s.nodes);
  const edges = usePipelineStore((s) => s.edges);
  const onNodesChange = usePipelineStore((s) => s.onNodesChange);
  const onEdgesChange = usePipelineStore((s) => s.onEdgesChange);
  const onConnect = usePipelineStore((s) => s.onConnect);

  const proOptions = { hideAttribution: true };

  return (
    <div className="h-screen w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: 'hsl(250 90% 65%)', strokeWidth: 2 },
        }}
        connectionLineStyle={{ stroke: 'hsl(250 90% 65%)', strokeWidth: 2 }}
        className="bg-background"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(220 15% 25%)"
        />
        <Controls className="!border-border !bg-card" />
        <MiniMap
          nodeColor={(node) => {
            const colorMap: Record<string, string> = {
              inputNode: 'hsl(145 70% 50%)',
              outputNode: 'hsl(350 80% 55%)',
              llmNode: 'hsl(250 90% 65%)',
              textNode: 'hsl(200 70% 55%)',
              apiNode: 'hsl(35 90% 55%)',
              transformNode: 'hsl(280 70% 60%)',
              filterNode: 'hsl(175 70% 50%)',
              mergeNode: 'hsl(320 70% 55%)',
              conditionNode: 'hsl(45 90% 55%)',
            };
            return colorMap[node.type || ''] || 'hsl(220 15% 40%)';
          }}
          maskColor="hsl(220 20% 10% / 0.8)"
          className="!border-border !bg-card/80"
        />
      </ReactFlow>
      
      <Toolbar />
      
      {/* Header */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          VectorShift Pipeline Builder
        </h1>
      </div>
      
      {/* Submit Button */}
      <div className="absolute bottom-6 right-6 z-10">
        <SubmitButton />
      </div>
    </div>
  );
};

export default PipelineEditor;
