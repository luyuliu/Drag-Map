function print(a){
  console.log(a)
}

var w = 1280,
    h = 800;

var projection = d3.geo.albersUsa()
    .scale(1200)
    .translate([0, 400]);

var path = d3.geo.path().projection(projection),
    force = d3.layout.force().size([w, h]);

var svg = d3.select("#container").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

d3.json("https://luyuliu.github.io/Drag-Map/data/ohio.json", function(states) {
  svg.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
  var nodes = [],
      links = [];
  print(states)
  states.features.forEach(function(d, i) {
    //if (d.id == "02" || d.id == "15" || d.id == "72") return; // lower 48
    var centroid = path.centroid(d);
    centroid.x = centroid[0];
    centroid.y = centroid[1];
    centroid.feature = d;
    nodes.push(centroid);
  });

  
  d3.geom.delaunay(nodes).forEach(function(d) {
    links.push(edge(d[0], d[1]));
    links.push(edge(d[1], d[2]));
    links.push(edge(d[2], d[0]));
  });

  force
      .gravity(0)
      .nodes(nodes)
      .links(links)
      .linkDistance(function(d) { 
        print(d)
        return d.distance; })
      .start();

  var link = svg.selectAll("line")
      .data(links)
    .enter().append("svg:line")
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  var node = svg.selectAll("g")
      .data(nodes)
    .enter().append("svg:g")
      .attr("transform", function(d) { return "translate(" + -d.x + "," + -d.y + ")"; })
      .call(force.drag)
    .append("svg:path")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("d", function(d) { return path(d.feature); });

  force.on("tick", function(e) {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) {
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

    