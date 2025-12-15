export class PipelineEngine {
  constructor(onNodeOutput) {
    this.nodes = [];
    this.edges = [];
    this.values = {};
    this.onNodeOutput = onNodeOutput;
  }

  update(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
  }

  getNode(id) {
    return this.nodes.find(n => n.id === id);
  }

  getInputs(nodeId) {
    const inputs = {};
    this.edges
      .filter(e => e.target === nodeId)
      .forEach(e => {
        inputs[e.targetHandle] = this.values[e.source];
      });
    return inputs;
  }

  compute(node, inputs) {
    // If node has a custom compute function, use it
    if (node.data && typeof node.data.compute === 'function') {
      return node.data.compute({ inputs, data: node.data });
    }

    switch (node.type) {
      case "input":
        return node.data.value ?? "";

      case "template": {
        let out = node.data.value ?? "";
        Object.entries(inputs).forEach(([k, v]) => {
          out = out.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), v ?? "");
        });
        return out;
      }

      case "merge":
        return inputs;

      case "llm":
        return `AI Response: "${inputs.prompt ?? ""}"`;

      case "output":
        return Object.values(inputs)[0] ?? "";

      case "validator":
        return {
          num_nodes: this.nodes.length,
          num_edges: this.edges.length,
          is_dag: true,
        };

      case "explain":
        return "This pipeline takes input, processes it, and produces output.";

      default:
        return "";
    }
  }

  runAll() {
    const executed = new Set();

    const runNode = (id) => {
      if (executed.has(id)) return;
      executed.add(id);

      const node = this.getNode(id);
      if (!node) return;

      const inputs = this.getInputs(id);
      const result = this.compute(node, inputs);

      this.values[id] = result;
      this.onNodeOutput(id, result);

      this.edges
        .filter(e => e.source === id)
        .forEach(e => runNode(e.target));
    };

    // start only from source nodes
    const targets = new Set(this.edges.map(e => e.target));
    this.nodes
      .filter(n => !targets.has(n.id))
      .forEach(n => runNode(n.id));
  }
}
