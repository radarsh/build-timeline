var data = [
    {name: "unstable-test-phase", start: 1435144688995, end: 1435144689448},
    {name: "test-functional", start: 1435144698997, end: 1435144759854},
    {name: "publish-rpm", start: 1435144769001, end: 1435144797254},
    {name: "deploy-to-qa", start: 1435144804005, end: 1435144902780},
    {name: "e2e", start: 1435144909013, end: 1435144923492},
    {name: "promote-to-stable", start: 1435144929017, end: 1435144936001},
    {name: "deploy-to-uat", start: 1435144944019, end: 1435145040276}
];

data = [
    {"name":"functional-phase","start":1434458939111,"end":1434458949140},{"name":"test-job-1","start":1434458956922,"end":1434458996947},{"name":"test-job-1","start":1434458956922,"end":1434458996947},{"name":"test-job-2","start":1434458956922,"end":1434459006958},{"name":"test-job-2","start":1434458956922,"end":1434459006958},{"name":"test-job-3","start":1434458996952,"end":1434459046981},{"name":"test-job-3","start":1434458996952,"end":1434459046981}
];

var min = d3.min(data, function(d) {
    return d.start;
});

var max = d3.max(data, function(d) {
    return d.end;
});

var colours = ["red", "purple", "green", "teal", "pink", "yellow", "orange", "blue", "maroon"];
var scaleX = d3.time.scale().domain([new Date(min), new Date(max)]).range([0, 1500]);
var xAxis = d3.svg.axis().scale(scaleX);

console.log("min is " + min);

var svg = d3
    .select("#timeline")
    .append("svg")
    .attr("width", 1600)
    .attr("height", 500);

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + 450 + ")")
    .call(xAxis);


var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "Took " + moment.duration(new Date(d.end) - new Date(d.start)).humanize();
    });

svg.call(tip);

var rect = svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect");


rect.attr("x", function(d) {
        return scaleX(new Date(d.start));
    })
    .attr("y", function(d, i) {
        return (i + 1) * 40;
    })
    .attr("width", function(d) {
        return scaleX(new Date(d.end)) - scaleX(new Date(d.start));
    })
    .attr("height", 20)
    .attr("fill", function(d, i) {
        return colours[i];
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

var text = svg.selectAll("text.label")
    .data(data)
    .enter()
    .append("text");

text.attr("x", function(d) {
        return scaleX(new Date(d.start));
    })
    .attr("y", function(d, i) {
        return (i + 1) * 40 - 2;
    })
    .attr("class", "label")
    .attr("text-anchor", "start")
    .attr("fill", "black")
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
    .attr("transform", "translate(0,450)")
    .call(make_x_axis()
        .tickSize(-450, 0, 0)
        .tickFormat("")
);
