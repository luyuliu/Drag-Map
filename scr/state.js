function __init_state__(id) {
    print("https://luyuliu.github.io/Drag-Map/data/states/jsoncounties-"+id+".min.js")
    d3.json("https://luyuliu.github.io/Drag-Map/data/states/jsoncounties-"+id+".min.js", function (states) {
    
        //states.features=[]
        states.features=states.features.counties;
        width = $(window).width() / 3 * 2,
            height = $(window).height() - 90;

        svg = d3.select("#plot-container").append("svg:svg")
            .attr("width", width)
            .attr("height", height);

        g = svg.append("g")
            .attr("id", "state-plot")


            var center = d3.geo.centroid(states)
        var projection = d3.geo.mercator()
            .scale(5000)
            .center(center)
            //.translate([-width * 3 / 2, height]);

        path = d3.geo.path().projection(projection);

        var nodes = [],
            links = [];
        states.features.forEach(function (d, i) {
            d.type="Feature"
            var centroid = path.centroid(d);
            centroid.x = centroid[0];
            centroid.y = centroid[1];
            centroid.feature = d;
            nodes.push(centroid);
        });


        print(states)



        d3.geom.delaunay(nodes).forEach(function (d) {
            links.push(edge(d[0], d[1]));
            links.push(edge(d[1], d[2]));
            links.push(edge(d[2], d[0]));
        });

        var force = d3.layout.force().size([width, height]);

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
            .attr("class", "state-line")
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
            .attr("class", "state-shape")
            .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
            .attr("d", function (d) { return path(d.feature); })
            .on("click", function (d, i) {
                $("#tag").html(d.feature.geographicRegion)
              })


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
}


function __del_state__() {
    d3.selectAll(".state-line")
        .transition()
        .duration(750)
        .style("fill-opacity", 0)
        .style("stroke-opacity", 0)


    d3.selectAll(".state-shape")
        .transition()
        .duration(750)
        .style("fill-opacity", 0)
        .style("stroke-opacity", 0);

    setTimeout(function () {
        $("svg").remove();
        
    }, 750);

}