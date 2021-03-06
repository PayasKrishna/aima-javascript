$(document).ready(function() {
  var w = 600,
    h = 350;
  var DELAY = 2000;

  function init() {
    var graph = new DefaultGraph();
    var graphProblem = new GraphProblem(graph.nodes, graph.edges, 'A', 'A');
    var graphAgent = new GraphAgent(graphProblem);
    var options = new DefaultOptions();
    options.nodes.next.fill = 'hsla(126, 100%, 69%, 1)';
    var graphDrawAgent = new GraphDrawAgent(graphProblem, 'depthFirstSearchCanvas', options, h, w);
    var queueDrawAgent = new QueueDrawAgent('lifoQueueCanvas', h, w, graphProblem, options);
    var updateFunction = function() {
      if (graphProblem.frontier.length > 0) {
        var nextNode = depthFirstSearch(graphProblem);
        graphAgent.expand(nextNode);
        if (graphProblem.frontier.length > 0) {
          graphProblem.nextToExpand = depthFirstSearch(graphProblem);
        } else {
          graphProblem.nextToExpand = null;
        }
        graphDrawAgent.iterate();
        queueDrawAgent.iterate();
      } else {
        clearInterval(intervalFunction, DELAY);
      }
    }
    var intervalFunction = setInterval(updateFunction, DELAY);
  };
  $('#dfsRestartButton').click(init);
  $('#lifoWaiting').css('background-color', 'hsl(200,50%,70%)');
  $('#lifoNextNode').css('background-color', 'hsla(126, 100%, 69%, 1)');
  init();
});
