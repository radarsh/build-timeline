(function (scope) {
    "use strict";

    scope.Timeline = function (options) {
        this.view = options.view;
        this.container = options.container;
    };

    scope.Timeline.prototype = {
        init: function() {
            this.refresh();

            setInterval(this.refresh.bind(this), 10000);
        },

        refresh: function () {
            this.view.getTimelineData(this.draw.bind(this));
        },

        draw: function(response) {
            var data = JSON.parse(response.responseJSON);
            var containerElement = document.getElementById(this.container);
            containerElement.innerHTML = '';

            var width = containerElement.clientWidth;
            var min = d3.min(data, function(d) {return d.start;});
            var max = d3.max(data, function(d) {return d.end;});
            var colours = ["red", "purple", "green", "teal", "pink", "yellow", "orange", "blue", "maroon"];
            var scaleX = d3.time.scale().domain([new Date(min), new Date(max)]).range([0, width]);
            var xAxis = d3.svg.axis().scale(scaleX).ticks(20);

            var svg = d3
                .select("#" + this.container)
                .append("svg")
                .attr("width", width)
                .attr("height", 500);

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + 450 + ")")
                .call(xAxis);

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    var duration = moment.duration(new Date(d.end) - new Date(d.start)).humanize();
                    return "Took " + duration + ", started " + new Date(d.start);
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
                    .ticks(20)
            }

            svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0,450)")
                .call(make_x_axis()
                    .tickSize(-450, 0, 0)
                    .tickFormat(""));
        }
    };
})(window);
