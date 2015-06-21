var data = [
    {name: "Alpha", start: 10, end: 20},
    {name: "Beta", start: 15, end: 25},
    {name: "Gamma", start: 20, end: 30},
    {name: "Delta", start: 40, end: 50},
    {name: "Epsilon", start: 20, end: 35}
];

var colours = ["red", "purple", "green", "teal", "pink", "yellow", "orange", "blue", "maroon"];

var scaleX = d3.scale.linear().domain([0, 50]).range([0, 700]);
//var scaleY = d3.scale.linear().domain([0, 50]).range([0, 400]);

var svg = d3
    .select("#timeline")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 400);


svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) {
        return scaleX(d.start);
    })
    .attr("y", function(d, i) {
        return (i + 1) * 25;
    })
    .attr("width", function(d) {
        return scaleX(d.start + d.end);
    })
    .attr("height", 20)
    .attr("fill", function(d, i) {
        return colours[i];
    });
