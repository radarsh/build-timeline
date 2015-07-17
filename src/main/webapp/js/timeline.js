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
        this.refreshInterval = options.refreshInterval;
        this.autoRefresh = options.autoRefresh;
    };

    scope.Timeline.prototype = {
        init: function() {
            this._refresh();

            if (this.autoRefresh) {
                setInterval(this._refresh.bind(this), this.refreshInterval);
            }
        },

        _refresh: function () {
            this.view.getTimelineData(this._draw.bind(this));
        },

        _draw: function(response) {
            var data = JSON.parse(response.responseJSON);
            this.container.innerHTML = '';

            var metadata = this._getChartMetadata(data);
            var svg = this._createSvgContainer(metadata);
            this._createStripedBackground(svg, data, metadata);
            this._createLinks(svg, data, metadata);
            this._createClipArea(svg, metadata);
            var chart = this._createChartArea(svg, data, metadata);
            var grid = this._drawGrid(chart, metadata);
            var rect = this._createTimelineBars(chart, data, metadata);
            this._enableZooming(svg, rect, grid, metadata);
        },

        _getChartMetadata: function(data) {
            var width = this.container.clientWidth;
            var height = data.length * 45 + 80;
            var min = d3.min(data, function(d) {return d.start;});
            var max = d3.max(data, function(d) {return d.end;});
            var xScale = d3.time.scale().domain([new Date(min), new Date(max)]).range([0, width]);
            var xAxis = d3.svg.axis().scale(xScale).ticks(20);

            return {
                width: width,
                height: height,
                min: min,
                max: max,
                xScale: xScale,
                xAxis: xAxis
            };
        },

        _createSvgContainer: function(metadata) {
            return d3.select(this.container)
                .append("svg")
                .attr("width", metadata.width)
                .attr("height", metadata.height);
        },

        _createStripedBackground: function(svg, data, metadata) {
            svg.selectAll("rect.bg")
                .data(data)
                .enter()
                .append("rect")
                .attr("class", "bg")
                .attr("x", 0)
                .attr("y", function(d, i) {return (i + 1) * 45 - 15;})
                .attr("width", metadata.width)
                .attr("height", 23)
                .attr("fill", "#FAFAFA");
        },

        _createLinks: function(svg, data, metadata) {
            svg.selectAll("a")
                .data(data)
                .enter()
                .append("a")
                .attr("class", "link")
                .attr("xlink:href", function(d) {return d.link;})
                .attr("x", 10)
                .attr("y", function(d, i) {return (i + 1) * 45;})
                .append("text")
                .attr("x", 10)
                .attr("y", function(d, i) {return (i + 1) * 45;})
                .attr("class", "label")
                .attr("text-anchor", "start")
                .attr("fill", function(d) {
                    if (d.status == "success" || d.status == "building") {
                        return "blue";
                    } if (d.status == "failure") {
                        return "red";
                    }
                })
                .text(function(d) {return d.name;});
        },

        _createClipArea: function(svg, metadata) {
            svg.append("clipPath")
                .attr("id", "chartClip")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", metadata.height)
                .attr("width", metadata.width);
        },

        _createChartArea: function(svg, data, metadata) {
            var chart = svg.append("g")
                .attr("class", "chart")
                .attr("transform", "translate(" + this._getMaxTextWidth(data) + ",0)");

            chart.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + (metadata.height - 25) + ")")
                .call(metadata.xAxis);

            chart.call(tip);

            return chart;
        },

        _getMaxTextWidth: function(data) {
            return 50 + d3.max(data, function(d) {
                    var computedStyles = window.getComputedStyle(this.container.querySelector("text.label"));
                    var font = computedStyles.getPropertyValue("font-weight") + " "
                        + computedStyles.getPropertyValue("font-size") + " "
                        + computedStyles.getPropertyValue("font-family");

                    return getTextWidth(d.name, font);
                }.bind(this));

            function getTextWidth(text, font) {
                var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
                var context = canvas.getContext("2d");
                context.font = font;
                var metrics = context.measureText(text);
                return metrics.width;
            }
        },

        _drawGrid: function(chart, metadata) {
            return chart.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0,"+ (metadata.height - 25) + ")")
                .call(make_x_axis()
                    .tickSize(-(metadata.height - 25), 0, 0)
                    .tickFormat(""));

            function make_x_axis() {
                return d3.svg.axis()
                    .scale(metadata.xScale)
                    .orient("bottom")
                    .ticks(20)
            }
        },

        _createTimelineBars: function(chart, data, metadata) {
            var rect = chart.append("g")
                .attr("clip-path", "url(#chartClip)")
                .attr("transform", "translate(0,0)")
                .selectAll("rect")
                .data(data)
                .enter()
                .append("rect");

            rect.attr("x", function(d) {return metadata.xScale(new Date(d.start));})
                .attr("y", function(d, i) {return (i + 1) * 45 - 15;})
                .attr("width", function(d) {return metadata.xScale(new Date(d.end)) - metadata.xScale(new Date(d.start));})
                .attr("height", 23)
                .attr("fill", function(d, i) {return COLOURS[i];})
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide);

            return rect;
        },

        _enableZooming: function(svg, rect, grid, metadata) {
            var zoom = d3.behavior.zoom()
                .x(metadata.xScale)
                .scaleExtent([0.1, 16])
                .on("zoom", zoomed);

            svg.call(zoom);

            function zoomed() {
                svg.select(".x-axis").call(metadata.xAxis);
                rect.attr("x", function(d) {return metadata.xScale(new Date(d.start));})
                    .attr("width", function(d) {return metadata.xScale(new Date(d.end)) - metadata.xScale(new Date(d.start));});

                grid.call(make_x_axis()
                    .tickSize(-(metadata.height - 25), 0, 0)
                    .tickFormat(""));

                function make_x_axis() {
                    return d3.svg.axis()
                        .scale(metadata.xScale)
                        .orient("bottom")
                        .ticks(20);
                }
            }
        }
    };
})(window);
