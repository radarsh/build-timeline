var data = [
    {name: "Alpha", start: 10, end: 85},
    {name: "Beta", start: 15, end: 75},
    {name: "Gamma", start: 20, end: 40},
    {name: "Delta", start: 40, end: 150},
    {name: "Epsilon", start: 20, end: 60}
];

var colours = [
    {bg: "red", fg: "white"},
    {bg: "purple", fg: "white"},
    {bg: "green", fg: "white"},
    {bg: "teal", fg: "white"},
    {bg: "pink", fg: "black"},
    {bg: "yellow", fg: "black"},
    {bg: "orange", fg: "black"},
    {bg: "blue", fg: "black"},
    {bg: "maroon", fg: "black"}
];

var scaleX = d3.scale.linear().domain([0, 150]).range([0, 700]);
var xAxis = d3.svg.axis().scale(scaleX);

var svg = d3
    .select("#timeline")
    .append("svg")
    .attr("width", 800)
    .attr("height", 250);

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + 200 + ")")
    .call(xAxis);

var rect = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect");


rect.attr("x", function(d) {
        return scaleX(d.start);
    })
    .attr("y", function(d, i) {
        return (i + 1) * 25;
    })
    .attr("width", function(d) {
        return scaleX(d.end - d.start);
    })
    .attr("height", 20)
    .attr("fill", function(d, i) {
        return colours[i].bg;
    });

var text = svg.selectAll("text.label")
    .data(data)
    .enter()
    .append("text");

text.attr("x", function(d) {
        return scaleX(d.end) - 10;
    })
    .attr("y", function(d, i) {
        return (i + 1) * 25 + 13;
    })
    .attr("class", "label")
    .attr("text-anchor", "end")
    .attr("fill", function(d, i) {
        return colours[i].fg;
    })
    .text(function(d) {
        return d.name;
    });

function make_x_axis() {
    return d3.svg.axis()
        .scale(scaleX)
        .orient("bottom")
        .ticks(10)
}

svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0,200)")
    .call(make_x_axis()
        .tickSize(-200, 0, 0)
        .tickFormat("")
);
