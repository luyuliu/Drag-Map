function print(a) {
  console.log(a)
}

var width = 1280,
  height = 800;
var centered = null;

var projection = d3.geo.albersUsa()
  .scale(1070)
  .translate([width / 2, height / 2]);

var path = d3.geo.path().projection(projection),
  force = d3.layout.force().size([width, height]);

var svg = d3.select("#container").append("svg:svg")
  .attr("width", width)
  .attr("height", height);

var zoom = d3.behavior.zoom()
  .translate(projection.translate())
  .scale(projection.scale())
  .scaleExtent([height, 8 * height])
  .on("zoom", zoomHandler);
var g = svg.append("g")
  .call(zoom);

function clickHandler(d) {
  d = d.feature;
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width *2;
    y = height *2;
    k = 1;
    centered = null;
  }

  svg.transition()
    .duration(750)
    .attr("transform", "translate(" + width*2  + "," + height*2   + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px");
}

function zoomHandler() {
  projection.translate(d3.event.translate).scale(d3.event.scale);
}


d3.json("https://luyuliu.github.io/Drag-Map/data/us.json", function (states) {




  var nodes = [],
    links = [];
  print(states)
  states.features.forEach(function (d, i) {
    if (d.id == "02" || d.id == "15" || d.id == "72") return; // lower 48
    var centroid = path.centroid(d);
    centroid.x = centroid[0];
    centroid.y = centroid[1];
    centroid.feature = d;
    nodes.push(centroid);
  });


  d3.geom.delaunay(nodes).forEach(function (d) {
    links.push(edge(d[0], d[1]));
    links.push(edge(d[1], d[2]));
    links.push(edge(d[2], d[0]));
  });

  force
    .gravity(0)
    .nodes(nodes)
    .links(links)
    .linkDistance(function (d) {
      return d.distance;
    })
    .start();

  var link = g.selectAll("line")
    .data(links)
    .enter().append("svg:line")
    .attr("x1", function (d) { return d.source.x; })
    .attr("y1", function (d) { return d.source.y; })
    .attr("x2", function (d) { return d.target.x; })
    .attr("y2", function (d) { return d.target.y; });

  var node = g.selectAll("g")
    .data(nodes)
    .enter().append("svg:g")
    .attr("transform", function (d) { return "translate(" + -d.x + "," + -d.y + ")"; })
    .call(force.drag)
    .append("svg:path")
    .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
    .attr("d", function (d) { return path(d.feature); })
    .on("click", clickHandler);


  force.on("tick", function (e) {
    link.attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    node.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });

});

function edge(a, b) {
  var dx = a[0] - b[0], dy = a[1] - b[1];
  return {
    source: a,
    target: b,
    distance: Math.sqrt(dx * dx + dy * dy)
  };
}

