(function (scope) {
    "use strict";

    var initialised = false;

    scope.Timeline = function (options) {
        this.options = options;
    };

    scope.Timeline.prototype = {
        _setupAutoRefresh: function () {
            if (!initialised) {
                setInterval(function(){
                    this.draw();
                }.bind(this), 10000);
                initialised = true;
            }
        },

        draw: function () {
            this._setupAutoRefresh();
        }
    };
})(window);


function Timeline(handle) {
    "use strict";

    this.handle = handle;
    this.initialised = false;

    this.setupAutoRefresh = function() {
        if (!this.initialised) {
            setInterval(function(){
                this.draw()
            }.bind(this), 10000);
            this.initialised = true;
        }
    };

    this.draw = function() {
        this.setupAutoRefresh();

        this.handle.getTimelineData(function(response) {
            var painter = new Painter(JSON.parse(response.responseJSON), 'timeline');
            painter.drawChart();
        }.bind(this));
    };

    function Painter(data, containerId) {
        this.data = data;
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth;
        this.min = d3.min(this.data, function(d) {return d.start;});
        this.max = d3.max(this.data, function(d) {return d.end;});
        this.colours = ["red", "purple", "green", "teal", "pink", "yellow", "orange", "blue", "maroon"];
        this.scaleX = d3.time.scale().domain([new Date(this.min), new Date(this.max)]).range([0, this.width]);
        this.xAxis = d3.svg.axis().scale(scaleX).ticks(20);
        this.svg = d3
            .select("#" + containerId)
            .append("svg")
            .attr("width", this.width)
            .attr("height", 500);


        this.reset = function() {
            this.container.innerHTML = '';
        };

        this.drawChart = function() {
            this.svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + 450 + ")")
                .call(xAxis);

            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "Took " + moment.duration(new Date(d.end) - new Date(d.start)).humanize();
                });

            this.svg.call(tip);

            var rect = this.svg.selectAll("rect")
                .data(this.data)
                .enter()
                .append("rect");


            rect.attr("x", function(d) {
                return this.scaleX(new Date(d.start));
            })
                .attr("y", function(d, i) {
                    return (i + 1) * 40;
                })
                .attr("width", function(d) {
                    return this.scaleX(new Date(d.end)) - this.scaleX(new Date(d.start));
                })
                .attr("height", 20)
                .attr("fill", function(d, i) {
                    return this.colours[i];
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            var text = this.svg.selectAll("text.label")
                .data(this.data)
                .enter()
                .append("text");

            text.attr("x", function(d) {
                return this.scaleX(new Date(d.start));
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
                    .scale(this.scaleX)
                    .orient("bottom")
                    .ticks(20)
            }

            this.svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0,450)")
                .call(make_x_axis()
                    .tickSize(-450, 0, 0)
                    .tickFormat(""));
        };
    }
}