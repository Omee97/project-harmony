from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from collections import deque

app = FastAPI(title="Pipeline API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Position(BaseModel):
    x: float
    y: float


class Node(BaseModel):
    id: str
    type: str
    position: Position
    data: Dict[str, Any] = {}


class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """Check if the graph is a DAG using Kahn's algorithm (topological sort)"""
    if len(nodes) == 0:
        return True

    # Build adjacency list and in-degree count
    adjacency_list: Dict[str, List[str]] = {node.id: [] for node in nodes}
    in_degree: Dict[str, int] = {node.id: 0 for node in nodes}

    # Build the graph
    for edge in edges:
        if edge.source in adjacency_list:
            adjacency_list[edge.source].append(edge.target)
        if edge.target in in_degree:
            in_degree[edge.target] = in_degree.get(edge.target, 0) + 1

    # Find all nodes with no incoming edges
    queue = deque([node_id for node_id, degree in in_degree.items() if degree == 0])

    visited_count = 0

    # Process nodes in topological order
    while queue:
        current = queue.popleft()
        visited_count += 1

        for neighbor in adjacency_list.get(current, []):
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If all nodes were visited, the graph is a DAG
    return visited_count == len(nodes)


@app.get("/")
async def root():
    return {"message": "Pipeline API is running"}


@app.post("/pipelines/parse", response_model=PipelineResponse)
async def parse_pipeline(request: PipelineRequest):
    """
    Parse the pipeline and return:
    - num_nodes: number of nodes in the pipeline
    - num_edges: number of edges in the pipeline
    - is_dag: whether the pipeline is a valid DAG (Directed Acyclic Graph)
    """
    try:
        num_nodes = len(request.nodes)
        num_edges = len(request.edges)
        is_dag_result = is_dag(request.nodes, request.edges)

        response = PipelineResponse(
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=is_dag_result
        )

        print(f"Pipeline analysis: {response}")

        return response

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
