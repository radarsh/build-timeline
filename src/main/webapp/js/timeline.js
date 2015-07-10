(function (scope) {
    "use strict";

    var COLOURS = [
        "#4D4D4D",
        "#5DA5DA",
        "#FAA43A",
        "#60BD68",
        "#F2A9A2",
        "#89FFC8",
        "#B276B2",
        "#F7E967",
        "#F15854",
        "#3E6DB2",
        "#AECE5C",
        "#B73E26",
        "#256629",
        "#727BC6",
        "#878A94"
    ];

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            var duration = moment.duration(new Date(d.end) - new Date(d.start)).humanize();
            return "<div>"
                + "<h3>" + d.name + "</h3>"
                + "<hr/>"
                + "<p><strong>Started: </strong>" + new Date(d.start).toLocaleDateString() + " at " + new Date(d.start).toLocaleTimeString() + "</p>"
                + "<p><strong>Duration: </strong>" + duration + "</p>"
                + "<p><strong>Result: </strong>" + d.status + "</p>"
                + "</div>"
        });

    scope.Timeline = function (options) {
        this.view = options.view;
        this.container = document.querySelector(options.containerSelector);
    };

    scope.Timeline.prototype = {
        init: function() {
            this._refresh();

            setInterval(this._refresh.bind(this), 10000);
        },

        _refresh: function () {
            this.view.getTimelineData(this._draw.bind(this));
        },

        _draw: function(response) {
            var data = JSON.parse(response.responseJSON);
            this.container.innerHTML = '';

            var width = this.container.clientWidth;
            var height = data.length * 45 + 80;
            var min = d3.min(data, function(d) {return d.start;});
            var max = d3.max(data, function(d) {return d.end;});
            var xScale = d3.time.scale().domain([new Date(min), new Date(max)]).range([0, width]);
            var xAxis = d3.svg.axis().scale(xScale).ticks(20);

            var svg = d3
                .select(this.container)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (height - 25) + ")")
                .call(xAxis);

            svg.call(tip);

            function make_x_axis() {
                return d3.svg.axis()
                    .scale(xScale)
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
                    return xScale(new Date(d.start));
                })
                .attr("y", function(d, i) {
                    return (i + 1) * 45;
                })
                .attr("width", function(d) {
                    return xScale(new Date(d.end)) - xScale(new Date(d.start));
                })
                .attr("height", 23)
                .attr("fill", function(d, i) {
                    return COLOURS[i];
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            var text = svg.selectAll("text.label")
                .data(data)
                .enter()
                .append("text");

            text.attr("x", function(d) {
                    return xScale(new Date(d.start));
                })
                .attr("y", function(d, i) {
                    return (i + 1) * 45 - 5;
                })
                .attr("class", "label")
                .attr("text-anchor", "start")
                .attr("fill", function(d) {
                    if (d.status == "success" || d.status == "building") {
                        return "black";
                    } if (d.status == "failure") {
                        return "red";
                    }
                })
                .text(function(d) {
                    return d.name;
                });
        }
    };
})(window);
