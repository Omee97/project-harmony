import { create } from 'zustand';
import {
  Node,
  Edge,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';

export interface PipelineState {
  nodes: Node[];
  edges: Edge[];
  nodeIdCounter: number;
  addNode: (type: string, position?: { x: number; y: number }) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  getNodes: () => Node[];
  getEdges: () => Edge[];
}

const initialNodes: Node[] = [
  {
    id: 'input-1',
    type: 'inputNode',
    position: { x: 100, y: 150 },
    data: { label: 'Input', inputName: 'user_input', inputType: 'Text' },
  },
  {
    id: 'llm-1',
    type: 'llmNode',
    position: { x: 400, y: 100 },
    data: { label: 'LLM', model: 'gpt-4', temperature: 0.7, maxTokens: 1024 },
  },
  {
    id: 'output-1',
    type: 'outputNode',
    position: { x: 700, y: 150 },
    data: { label: 'Output', outputName: 'result', outputType: 'Text' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'input-1', target: 'llm-1', animated: true },
  { id: 'e2-3', source: 'llm-1', target: 'output-1', animated: true },
];

export const usePipelineStore = create<PipelineState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  nodeIdCounter: 10,

  addNode: (type, position) => {
    const nodeTypes: Record<string, { type: string; data: Record<string, unknown> }> = {
      input: { type: 'inputNode', data: { label: 'Input', inputName: 'input', inputType: 'Text' } },
      output: { type: 'outputNode', data: { label: 'Output', outputName: 'output', outputType: 'Text' } },
      llm: { type: 'llmNode', data: { label: 'LLM', model: 'gpt-4', temperature: 0.7, maxTokens: 1024 } },
      text: { type: 'textNode', data: { label: 'Text', text: '' } },
      api: { type: 'apiNode', data: { label: 'API', url: '', method: 'GET' } },
      transform: { type: 'transformNode', data: { label: 'Transform', operation: 'uppercase' } },
      filter: { type: 'filterNode', data: { label: 'Filter', condition: '' } },
      merge: { type: 'mergeNode', data: { label: 'Merge', strategy: 'concat' } },
      condition: { type: 'conditionNode', data: { label: 'Condition', expression: '' } },
    };

    const nodeConfig = nodeTypes[type] || nodeTypes.text;
    const { nodeIdCounter, nodes } = get();
    const newNode: Node = {
      id: `${type}-${nodeIdCounter}`,
      type: nodeConfig.type,
      position: position || { x: 250, y: 250 },
      data: { ...nodeConfig.data },
    };

    set({
      nodes: [...nodes, newNode],
      nodeIdCounter: nodeIdCounter + 1,
    });
  },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    set({ edges: addEdge({ ...connection, animated: true }, get().edges) });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },

  getNodes: () => get().nodes,
  getEdges: () => get().edges,
}));
