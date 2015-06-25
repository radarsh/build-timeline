function Timeline(handle) {
    "use strict";

    this.handle = handle;
    this.initialised = false;

    this.init = function() {
        if (!this.initialised) {
            setInterval(this.draw, 10000);
            this.initialised = true;
        }
    };

    this.draw = function() {
        this.init();
        this.handle.getRows(function(response) {
            var timeline = document.getElementById('timeline');
            timeline.innerHTML = '';

            var data = JSON.parse(response.responseJSON);

            console.log(data);

            var min = d3.min(data, function(d) {
                return d.start;
            });

            var max = d3.max(data, function(d) {
                return d.end;
            });


            var colours = ["red", "purple", "green", "teal", "pink", "yellow", "orange", "blue", "maroon"];
            var scaleX = d3.time.scale().domain([new Date(min), new Date(max)]).range([0, 1500]);
            var xAxis = d3.svg.axis().scale(scaleX);

            var svg = d3
                .select("#timeline")
                .append("svg")
                .attr("width", timeline.clientWidth)
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
                    .tickFormat(""));

        });
    };
}