
var width = $(window).width() / 3 * 2,
    height = $(window).height() - 90;
var centered = null;


var drag = d3.behavior.drag()
    .origin(function (d) { return { x: d[0], y: d[1] }; })
    .on("drag", dragHandler);

$("#extent-button").click(function () {
    print("good")
    x = width * 2;
    y = height * 2;
    k = 1;
    centered = null;
    svg.transition()
        .duration(750)
        .attr("transform", "translate(" + width * 2 + "," + height * 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");

    __del_state__();

    setTimeout(function () {
        __init__();
    }, 1000);

})


__init__();