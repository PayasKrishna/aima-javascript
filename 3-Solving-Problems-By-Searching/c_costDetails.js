$(document).ready(function() {
  var w = 600,
    h = 350;
  var DELAY = 2000;
  var bfsPathCanvas = null,
    ucsPathCanvas = null;
  var bfsTwo = null,
    ucsTwo = null;
  var colorPathInGraph = function(graphDrawAgent, path) {
    let nodeGroups = graphDrawAgent.nodeGroups;
    for (var i = 0; i < path.path.length; i++) {
      nodeKey = path.path[i].node;;
      for (var j = 0; j < nodeGroups.length; j++) {
        if ($(nodeGroups[j]._renderer.elem).attr('nodeKey') == nodeKey) {
          nodeGroups[j]._collection[0].fill = 'hsl(108, 96%, 80%)';
          break;
        }
      }
    }
    let edges = graphDrawAgent.edges;
    for (var i = 0; i < path.path.length - 1; i++) {
      nodeKey1 = path.path[i].node;
      nodeKey2 = path.path[i + 1].node;
      for (var j = 0; j < edges.length; j++) {
        let edge = edges[j];
        let fnode1 = $(edge._renderer.elem).attr("node1");
        let fnode2 = $(edge._renderer.elem).attr("node2");
        if ((fnode1 == nodeKey1 && fnode2 == nodeKey2) || (fnode2 == nodeKey1 && fnode1 == nodeKey2)) {
          edge.stroke = 'hsla(202, 100%, 56%, 1)';
          edge.linewidth = 5;
        }
      }
    }
    graphDrawAgent.two.update();

  }

  var drawCostPath = function(two, path) {
    two.clear();
    path.path = path.path.reverse();
    let runningCost = 0;
    var i, x1, x2, y;
    for (i = 0; i < path.path.length - 1; i++) {
      x1 = i * 65 + 20;
      x2 = (i + 1) * 65 + 20;
      y = 20;
      line = two.makeLine(x1, y, x2, y);
      line.stroke = 'hsla(202, 100%, 56%, 1)';
      line.linewidth = 5;
      edgeText = two.makeText(path.path[i + 1].cost, (x1 + x2) / 2, 10);
      rect = two.makeRectangle(x1, y, 30, 30);
      rect.fill = 'hsl(108, 96%, 80%)';
      nodeText = two.makeText(path.path[i].node, x1, y);
      nodeCost = two.makeText(runningCost, x1, y + 40);
      nodeCost.size = 17;
      runningCost += path.path[i + 1].cost;
    }
    x1 = i * 65 + 20;
    rect = two.makeRectangle(x1, y, 40, 40);
    rect.fill = 'hsl(108, 96%, 80%)';
    nodeText = two.makeText(path.path[i].node, x1, y);
    nodeText.size = 22;
    nodeText.stroke = 'hsla(202, 100%, 56%, 1)';
    nodeCost = two.makeText(runningCost, x1, y + 40);
    nodeCost.size = 22;
    nodeCost.stroke = 'hsla(202, 100%, 56%, 1)';
    two.update();
  }

  function init() {
    var graph = new DefaultGraph();
    var graphProblem = new GraphProblem(graph.nodes, graph.edges, 'A', null);
    var options = new DefaultOptions();
    var bfsGraphDrawAgent, ucsGraphDrawAgent;
    ucsPathCanvas = document.getElementById('lowestCostDetailCanvas');
    bfsPathCanvas = document.getElementById('bfsCostDetailCanvas');
    bfsTwo = new Two({
      height: h,
      width: w
    }).appendTo(bfsPathCanvas);
    ucsTwo = new Two({
      height: h,
      width: w
    }).appendTo(ucsPathCanvas);

    var onMouseEnter = function() {
      let nodeKey = $(this).attr('nodeKey');
      bfsShortestPath = findShortestPath(breadthFirstSearch, nodeKey);
      ucsShortestPath = findShortestPath(uniformCostSearch, nodeKey);
      colorPathInGraph(bfsGraphDrawAgent, bfsShortestPath);
      colorPathInGraph(ucsGraphDrawAgent, ucsShortestPath);
      drawCostPath(bfsTwo, bfsShortestPath);
      drawCostPath(ucsTwo, ucsShortestPath);
    };
    var onMouseLeave = function() {
      bfsGraphDrawAgent.iterate();
      ucsGraphDrawAgent.iterate();
      bfsTwo.clear();
      ucsTwo.clear();
      bfsTwo.update();
      ucsTwo.update();
    };
    options.nodes.unexplored.onMouseEnter = onMouseEnter;
    options.nodes.explored.onMouseEnter = onMouseEnter;
    options.nodes.frontier.onMouseEnter = onMouseEnter;
    options.nodes.next.onMouseEnter = onMouseEnter;
    options.nodes.unexplored.onMouseLeave = onMouseLeave;
    options.nodes.explored.onMouseLeave = onMouseLeave;
    options.nodes.frontier.onMouseLeave = onMouseLeave;
    options.nodes.next.onMouseLeave = onMouseLeave;
    options.edges.showCost = true;
    options.nodes.unexplored.clickHandler = function() {};
    bfsGraphDrawAgent = new GraphDrawAgent(graphProblem, 'no-costGraphCanvas', options, h, w);
    ucsGraphDrawAgent = new GraphDrawAgent(graphProblem, 'costGraphCanvas', options, h, w);
  };
  $('#ucsRestartButton').click(init);
  init();
});
