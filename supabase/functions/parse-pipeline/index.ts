import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

interface PipelineRequest {
  nodes: Node[];
  edges: Edge[];
}

interface PipelineResponse {
  num_nodes: number;
  num_edges: number;
  is_dag: boolean;
}

// Check if the graph is a DAG using Kahn's algorithm (topological sort)
function isDAG(nodes: Node[], edges: Edge[]): boolean {
  if (nodes.length === 0) return true;

  // Build adjacency list and in-degree count
  const adjacencyList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  // Initialize all nodes
  for (const node of nodes) {
    adjacencyList.set(node.id, []);
    inDegree.set(node.id, 0);
  }

  // Build the graph
  for (const edge of edges) {
    const neighbors = adjacencyList.get(edge.source);
    if (neighbors) {
      neighbors.push(edge.target);
    }
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  }

  // Find all nodes with no incoming edges
  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }

  let visitedCount = 0;

  // Process nodes in topological order
  while (queue.length > 0) {
    const current = queue.shift()!;
    visitedCount++;

    const neighbors = adjacencyList.get(current) || [];
    for (const neighbor of neighbors) {
      const newDegree = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  // If all nodes were visited, the graph is a DAG
  return visitedCount === nodes.length;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nodes, edges }: PipelineRequest = await req.json();

    // Validate input
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      throw new Error("Invalid input: nodes and edges must be arrays");
    }

    // Calculate pipeline metrics
    const num_nodes = nodes.length;
    const num_edges = edges.length;
    const is_dag = isDAG(nodes, edges);

    const response: PipelineResponse = {
      num_nodes,
      num_edges,
      is_dag,
    };

    console.log("Pipeline analysis:", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error parsing pipeline:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
