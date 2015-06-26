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
            this.doDraw(JSON.parse(response.responseJSON));
        }.bind(this));
    };

    this.doDraw = function(data) {
        console.log(data);

        var timeline = document.getElementById('timeline');
        timeline.innerHTML = '';

        var min = d3.min(data, function(d) {
            return d.start;
        });

        var max = d3.max(data, function(d) {
            return d.end;
        });

        var width = timeline.clientWidth;

        var colours = ["red", "purple", "green", "teal", "pink", "yellow", "orange", "blue", "maroon"];
        var scaleX = d3.time.scale().domain([new Date(min), new Date(max)]).range([0, width]);
        var xAxis = d3.svg.axis().scale(scaleX).ticks(20);

        var svg = d3
            .select("#timeline")
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
                .ticks(20)
        }

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(0,450)")
            .call(make_x_axis()
                .tickSize(-450, 0, 0)
                .tickFormat(""));
    };
}