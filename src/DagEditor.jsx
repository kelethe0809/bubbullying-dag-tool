import { useState, useEffect, useRef } from "react";
import Cytoscape from "cytoscape";
import edgehandles from "cytoscape-edgehandles";
import "cytoscape-panzoom";

Cytoscape.use(edgehandles);

const DagEditor = () => {
    const cyRef = useRef(null);
    const containerRef = useRef(null);
    const [nodeId, setNodeId] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        cyRef.current = Cytoscape({
            container: containerRef.current,
            elements: [],
            style: [
                {
                    selector: "node",
                    style: {
                        shape: "roundrectangle",
                        label: function (node)
                        {
                            return `${node.data("id")}n\n${node.data("content")}`
                        },
                        "background-color": "#307092",
                        color: "#fff",
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
                        "line-color": "#ccc",
                        "target-arrow-color": "#ccc",
                        "target-arrow-shape": "triangle",
                    },
                },
            ],
        });
    }, []);

    const addNode = () => {
        if (!nodeId.trim() || !content.trim()) return;
        cyRef.current.add({
            group: "nodes",
            data: { id: nodeId, content: content },
            position: { x: Math.random() * 1300, y: Math.random() * 700 },
        });
        setNodeId("");
        setContent("");
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
                <button onClick={addNode} style={{ width: "120px", height: "44px", marginLeft: "10px", color: "#000", "background-color": "#c9f7ff", "font-family":"verdana", "font-size": "14px" }}><b>Add Node</b></button>
            </div>
            <div
                ref={containerRef}
                style={{
                    width: "1366px",
                    height: "768px",
                    border: "1px grey solid",
                    marginTop: "10px",
                }}
            />
        </div>
    );
};

export default DagEditor;