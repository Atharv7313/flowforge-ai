// src/ui.js
import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";

import { useStore } from "./store";
import { shallow } from "zustand/shallow";

import { PipelineEngine } from "./pipelineEngine";
import InputNode from "./nodes/inputNode";
import TemplateNode from "./nodes/TemplateNode";
import MergeNode from "./nodes/MergeNode";
import { LLMNode } from "./nodes/llmNode";
import ExplainNode from "./nodes/ExplainNode";
import OutputNode from "./nodes/outputNode";
import PipelineValidator from "./nodes/PipelineValidator";

import { SubmitButton } from "./submit";
import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  input: InputNode,
  template: TemplateNode,
  merge: MergeNode,
  llm: LLMNode,
  validator: PipelineValidator,
  explain: ExplainNode,
  output: OutputNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  /* ================= PIPELINE ENGINE ================= */

  const onNodeOutput = useCallback((nodeId, output) => {
    useStore.setState((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === nodeId && n.data.displayValue !== output
          ? { ...n, data: { ...n.data, displayValue: output } }
          : n
      ),
    }));
  }, []);

  const engineRef = useRef(new PipelineEngine(onNodeOutput));

  /* ONLY update graph structure here — NEVER execute */
  useEffect(() => {
    engineRef.current.update(nodes, edges);
  }, [nodes, edges]);

  /* ================= NODE INITIAL DATA ================= */

  const getInitNodeData = (nodeID, type) => ({
    id: nodeID,
    nodeType: type,
    value: "",
    displayValue: "",
  onChange: (val) => {
  useStore.setState(state => ({
    nodes: state.nodes.map(n =>
      n.id === nodeID
        ? { ...n, data: { ...n.data, value: val } }
        : n
    ),
  }));

  requestAnimationFrame(() => {
    engineRef.current.runAll();
  });
},


  });

  /* ================= DRAG & DROP ================= */

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const payload = event.dataTransfer.getData("application/reactflow");
      if (!payload) return;

      const { nodeType } = JSON.parse(payload);
      if (!nodeType) return;

      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const nodeID = getNodeID(nodeType);

      addNode({
        id: nodeID,
        type: nodeType,
        position,
        data: getInitNodeData(nodeID, nodeType),
      });

      setTimeout(() => engineRef.current.runAll(), 0);
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /* ================= CONNECT ================= */

  const handleConnect = useCallback(
    (params) => {
      onConnect(params);
      setTimeout(() => engineRef.current.runAll(), 0);
    },
    [onConnect]
  );

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!reactFlowInstance) return;

    try {
      const res = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodes: reactFlowInstance.getNodes(),
          edges: reactFlowInstance.getEdges(),
        }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      alert(
        `Pipeline Submitted!\n\nNodes: ${data.num_nodes}\nEdges: ${data.num_edges}\nIs DAG: ${
          data.is_dag ? "Yes" : "No"
        }`
      );
    } catch {
      alert("Submission failed");
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-[#120018] to-[#1a0033]">
      <ReactFlowProvider>
        <div className="p-4 h-[75vh]">
          <div
            ref={reactFlowWrapper}
            className="h-full w-full rounded-xl border border-purple-900/40 bg-black/40 backdrop-blur-md shadow-lg"
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={handleConnect}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              proOptions={proOptions}
              snapGrid={[gridSize, gridSize]}
              connectionLineType="smoothstep"
              fitView
              defaultEdgeOptions={{
                style: {
                  stroke: "rgba(168, 85, 247, 0.6)",
                  strokeWidth: 2,
                },
              }}
            >
              <Background
                variant="dots"
                gap={24}
                size={1}
                color="rgba(168, 85, 247, 0.25)"
              />

              <Controls position="bottom-left" className="vs-controls" />

              <MiniMap
                position="bottom-right"
                pannable
                zoomable
                className="vs-minimap"
                nodeColor={(n) => {
                  switch (n.type) {
                    case "input":
                      return "#22c55e";
                    case "template":
                      return "#a855f7";
                    case "llm":
                      return "#6366f1";
                    case "merge":
                      return "#f59e0b";
                    case "validator":
                      return "#ef4444";
                    case "explain":
                      return "#06b6d4";
                    case "output":
                      return "#10b981";
                    default:
                      return "#64748b";
                  }
                }}
              />
            </ReactFlow>
          </div>
        </div>

        <div className="flex justify-center pb-6">
          <SubmitButton onSubmit={handleSubmit} />
        </div>
      </ReactFlowProvider>
    </div>
  );
};
