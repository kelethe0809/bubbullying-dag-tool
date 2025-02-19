import { useState, useEffect, useRef } from "react";
import Cytoscape from "cytoscape";
//import nodeHtmlLabel from "cytoscape-node-html-label";
import edgehandles from "cytoscape-edgehandles";
import "cytoscape-panzoom";

Cytoscape.use(edgehandles);

const DagEditor = () => {
    const cyRef = useRef(null);
    const containerRef = useRef(null);
    const [nodeId, setNodeId] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        if (cyRef.current) return;

        cyRef.current = Cytoscape({
            container: containerRef.current,
            elements: [],
            style: [
                {
                    selector: "node",
                    style: {
                        shape: "roundrectangle",
                        label: (node) => {
                            return `${node.data("id")}\n\n${node.data("content")}`
                        },
                        "background-color": "#307092",
                        color: "#ffffff",
                        "text-valign": "center",
                        "text-halign": "center",
                        "font-size": "14px",
                        "font-family":"verdana",
                        "border-width": 1,
                        "border-color": "#87ceeb",
                        width: "150px",
                        height: "60px",
                        padding: "10px",
                        "text-wrap": "wrap",
                        "text-max-width": "120px",
                    },
                },
                {
                    selector: "edge",
                    style: {
                        width: 2,
                        "line-color": "#cccccc",
                        "target-arrow-color": "#cccccc",
                        "target-arrow-shape": "triangle",
                        "curve-style": "bezier",
                    },
                },
            ],
        });

        cyRef.current.ready(() => {
            const eh = cyRef.current.edgehandles({
                handleNodes: "node",
                handleSize: 10,
                handleColor: "#ff0000",
                snap: true,
                edgeType: () => "flat",
                loopAllowed: () => false,
            });

            eh.disableDrawMode();

            document.addEventListener("keydown", (event) => {
                if (event.key === "Shift" || event.key === "Control") {
                    eh.enableDrawMode();
                }
            });

            document.addEventListener("keyup", (event) => {
                if (event.key === "Shift" || event.key === "Control") {
                    eh.disableDrawMode();
                }
            });

            cyRef.current.nodes().grabify();

            cyRef.current.on("add", () => {
                cyRef.current.nodes().grabify();
            });
        });

        return () => {
            if (cyRef.current) {
                cyRef.current.destroy();
                cyRef.current = null;
            }
        };
    }, []);

    const getRandomPosition = (axisMax) => {
        const padding = 50;
        return Math.random() * (axisMax - padding * 2) + padding;
    }

    const addNode = () => {
        if (!nodeId.trim() || !content.trim()) return;
        if (!cyRef.current) {
            console.error("Cytoscape is not initialized yet!");
            return;
        }
        cyRef.current.add({
            group: "nodes",
            data: { id: nodeId, content: content },
            position: { x: getRandomPosition(1366), y: getRandomPosition(768) },
        });
        setNodeId("");
        setContent("");
    };

    const addEdge = (sourceId, targetId) => {
        if (!cyRef.current.$(`#${sourceId}`).length || !cyRef.current.$(`#${targetId}`).length) {
            alert("Source or target node does not exist!");
            return;
        }
        cyRef.current.add({
            group: "edges",
            data: { id: `${sourceId}-${targetId}`, source: sourceId, target: targetId },
        });

        cyRef.current.nodes().grabify();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "20px" }}>
            <div style={{ marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Node No."
                    value={nodeId}
                    onChange={(e) => setNodeId(e.target.value)}
                    style={{ width: "100px", height: "30px", marginRight: "10px", padding: "5px", "font-family":"verdana" }}
                />
                <input
                    type="text"
                    placeholder="Node Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ width: "1100px", height: "30px", padding: "5px" , "font-family":"verdana"}}
                />
                <button onClick={addNode} style={{ width: "120px", height: "44px", marginLeft: "10px", color: "#000000", "background-color": "#c9f7ff", "font-family":"verdana", "font-size": "14px" }}><b>Add Node</b></button>
            </div>
            <div
                ref={containerRef}
                style={{
                    width: "1366px",
                    height: "768px",
                    "background-color": "#111111",
                    border: "1px grey solid",
                    marginTop: "10px",
                }}
            />
        </div>
    );
};

export default DagEditor;