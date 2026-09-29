var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    tabFormat:[
      "main-display",
        ["display-text", function() {
return "<div style='margin-top: -73px; margin-bottom: 73px; font-size: 17px; color: #ffffff;'>Event: x1.5 Rune Luck, x1.25 Rune Speed!</div>"
        }],
    ["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "",
    leftTab: true,
})