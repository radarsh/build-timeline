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
            var height = data.length * 45 + 80;
            var min = d3.min(data, function(d) {return d.start;});
            var max = d3.max(data, function(d) {return d.end;});
            var colours = [
                "#4D4D4D", // gray
                "#5DA5DA", // blue
                "#FAA43A", // orange
                "#60BD68", // green
                "#F17CB0", // pink
                "#B2912F", // brown
                "#B276B2", // purple
                "#DECF3F", // yellow
                "#F15854"  // red
            ];

            var scaleX = d3.time.scale().domain([new Date(min), new Date(max)]).range([0, width]);
            var xAxis = d3.svg.axis().scale(scaleX).ticks(20);

            var svg = d3
                .select("#" + this.container)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (height - 25) + ")")
                .call(xAxis);

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    var duration = moment.duration(new Date(d.end) - new Date(d.start)).humanize();
                    return "Took " + duration;
                });

            svg.call(tip);

            function make_x_axis() {
                return d3.svg.axis()
                    .scale(scaleX)
                    .orient("bottom")
                    .ticks(20)
            }

            svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0,"+ (height - 25) + ")")
                .call(make_x_axis()
                    .tickSize(-(height - 25), 0, 0)
                    .tickFormat(""));

            var rect = svg.selectAll("rect")
                .data(data)
                .enter()
                .append("rect");

            rect.attr("x", function(d) {
                    return scaleX(new Date(d.start));
                })
                .attr("y", function(d, i) {
                    return (i + 1) * 45;
                })
                .attr("width", function(d) {
                    return scaleX(new Date(d.end)) - scaleX(new Date(d.start));
                })
                .attr("height", 23)
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
                    return (i + 1) * 45 - 5;
                })
                .attr("class", "label")
                .attr("text-anchor", "start")
                .attr("fill", "black")
                .text(function(d) {
                    return d.name;
                });
        }
    };
})(window);
