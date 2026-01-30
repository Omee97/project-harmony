import { useState } from 'react';
import { Play, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePipelineStore } from '@/store/pipelineStore';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const FASTAPI_URL = 'http://localhost:8000/pipelines/parse';

interface PipelineResult {
  num_nodes: number;
  num_edges: number;
  is_dag: boolean;
}

const SubmitButton = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const getNodes = usePipelineStore((s) => s.getNodes);
  const getEdges = usePipelineStore((s) => s.getEdges);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const nodes = getNodes();
    const edges = getEdges();

    try {
      const response = await fetch(FASTAPI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze pipeline');
      }

      const data = await response.json();
      setResult(data);
      setDialogOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="gap-2 bg-primary hover:bg-primary/90 shadow-lg"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Submit Pipeline
          </>
        )}
      </Button>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {error ? (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  Error
                </>
              ) : result?.is_dag ? (
                <>
                  <CheckCircle className="h-5 w-5 text-node-input" />
                  Pipeline Analysis Complete
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-node-condition" />
                  Pipeline Analysis Complete
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              {error ? (
                <p className="text-destructive">{error}</p>
              ) : result ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-secondary p-4 text-center">
                      <p className="text-2xl font-bold text-foreground">{result.num_nodes}</p>
                      <p className="text-xs text-muted-foreground">Nodes</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-4 text-center">
                      <p className="text-2xl font-bold text-foreground">{result.num_edges}</p>
                      <p className="text-xs text-muted-foreground">Edges</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-4 text-center">
                      <div className="flex items-center justify-center">
                        {result.is_dag ? (
                          <CheckCircle className="h-6 w-6 text-node-input" />
                        ) : (
                          <XCircle className="h-6 w-6 text-destructive" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">Valid DAG</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {result.is_dag
                      ? 'Your pipeline is a valid Directed Acyclic Graph (DAG) and can be executed.'
                      : 'Warning: Your pipeline contains cycles and cannot be executed. Please remove circular connections.'}
                  </p>
                </div>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SubmitButton;
