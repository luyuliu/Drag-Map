function __init_state__(id) {

    d3.json("https://luyuliu.github.io/Drag-Map/data/ohio.json", function (states) {

        width = $(window).width() / 3 * 2,
            height = $(window).height() - 90;

        svg = d3.select("#plot-container").append("svg:svg")
            .attr("width", width)
            .attr("height", height);

        g = svg.append("g")
            .attr("id", "state-plot")


            var center = d3.geo.centroid(states)
        var projection = d3.geo.mercator()
            .scale(10000)
            .center(center)
            //.translate([-width * 3 / 2, height]);

        print([-width * 3 / 2, height])
        path = d3.geo.path().projection(projection);

        var nodes = [],
            links = [];
        print(states)
        states.features.forEach(function (d, i) {
            if (d.id == "02" || d.id == "15" || d.id == "72") return; // lower 48
            var centroid = path.centroid(d);
            centroid.x = centroid[0];
            centroid.y = centroid[1];

            print({ centroid })
            centroid.feature = d;
            nodes.push(centroid);
        });






        d3.geom.delaunay(nodes).forEach(function (d) {
            links.push(edge(d[0], d[1]));
            links.push(edge(d[1], d[2]));
            links.push(edge(d[2], d[0]));
        });

        var force = d3.layout.force().size([width / 100, height / 100]);

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
        print("deleted")
    }, 750);

}