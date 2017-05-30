function renderdontdrillchart(data, parent, drillColor) {

    var margin = { top: 20, right: 30, bottom: 50, left: 80, front: 0, back: 0 },
        width = 600 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;
    var depth = 50 - margin.front - margin.back;

    var format = d3.format("d");

    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], .2);

    var yScale = d3.scale.linear()
        .range([height, 0]);
    var format = d3.format("d");
    var zScale = d3.scale.ordinal()
        .domain([0, 1, 2])
        .rangeRoundBands([0, depth], .4);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickPadding(10);


    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .tickFormat(format)
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(10);

    var chart = d3.select(parent)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr('class', 'bargelement')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style('opacity', 0)
    xScale.domain(data.map(function (d) {
        return (d.trip_driving_score);
    }));
    yScale.domain([0, d3.max(data, function (d) { return d.count; })]);

    function x(d) { return xScale(d.trip_driving_score); }
    function y(d) { return yScale(d.count); }

    var camera = [width / 2, height / 2, -500];
    var barGen = bar3d(height)
        .camera(camera)
        .x(x)
        .y(y)
        .z(zScale(0))
        .width(xScale.rangeBand())
        .height(function (d) { return height - y(d); })
        .depth(xScale.rangeBand());

    chart.append("g")
        .attr("class", "x-axis-drilldown")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append('text')
        .attr("transform", "translate(" + (width / 2) + "," + (margin.bottom - 10) + ")")
        .style('font-weight', 'bold')
        .text('Driving Score')

    chart.append("g")
        .attr("class", "y-axis-drilldown")
        .call(yAxis)
        .append('text')
        .attr("transform", "translate(" + (-(margin.left / 2)) + "," + (height / 2) + ")rotate(-90)")
        .style('font-weight', 'bold')
        .text('Number of Users')

    var extent = xScale.rangeExtent();
    var middle = (extent[1] - extent[0]) / 2;
    chart.selectAll('g.bar-drilldown').data(data)
        .enter().append('g')
        .attr('class', 'bar-drilldown')
        // sort based on distance from center, so we draw outermost
        // bars first. otherwise, bars drawn later might overlap bars drawn first
        .sort(function (a, b) {
            return Math.abs(x(b) - middle) - Math.abs(x(a) - middle);
        })
        .attr('fill', drillColor)
        .call(barGen);

    d3.selectAll('.x-axis-drilldown text').each(function (d) {
        if (d)
            $(this).text(Math.round(d * 100) / 100)
    })
    // .attr('transform','rotate(-90)')

};

function renderpiechart(data, initial, first) {

    data.forEach(function (d, i) {

        if (d.trip_driving_score == "1 to 2") {
            d.color = '#FE2401',
                d.value = 0;
        };
        if (d.trip_driving_score == "2 to 3") {
            d.color = '#FF3B00',
                d.value = 0;
        };
        if (d.trip_driving_score == "3 to 4") {
            d.color = '#FF5300';
            d.value = 0;
        };
        if (d.trip_driving_score == "4 to 5") {
            d.color = '#0AB04C',
                d.value = 0;
        };
    });

    for (var i = 0; i < data.length; i++) {
        var obj = data[i];

        if (obj.trip_driving_score == null) {
            data.splice(i, 1);
        }
    };

    console.log(data)

    var piesvg = d3.select(".drilldownchart"),
        width = 300,
        height = 300;
    var xposition = piesvg.attr("width");
    var yposition = piesvg.attr("height");

    if (d3.selectAll('.piegelement') && d3.selectAll('.piegelement')[0][0]) {
        d3.selectAll('.piegelement').remove();
    }

    radius = Math.min(width, height) / 2,
        g = piesvg.append("g").attr('class', 'piegelement')
    // .attr("transform", "translate(" + xposition / 2 + "," + yposition / 2 + ")");

    var color = d3.scale.ordinal()
        .range(['#5E4FA2', '#3288BD', '#66C2A5', '#ABDDA4', '#E6F598', '#F6FAAA', '#FEE08B', '#FDAE61', '#F46D43', '#D53E4F', '#9E0142']);

    //call date range picker
    if (!initial) {
        calldatepicker(first);
    }

    var tooltip = d3.select("body").append("div")
        .attr("class", "tool-tip-pie");
    draw("piegelement", data, xposition / 2, yposition / 2, 130, 100, 30, 0.4, tooltip, piesvg);
    transition("piegelement", data, 150, 100, 30, 0.4, tooltip);

};

function draw(id, data, x /*center x*/, y/*center y*/,
    rx/*radius x*/, ry/*radius y*/, h/*height*/, ir/*inner radius*/, tooltip/*tool-tip*/, piesvg /*pie chart svg*/) {

    var _data = d3.layout.pie().sort(null).value(function (d) { return d.value; })(data);

    var slices = d3.select("." + id).append("g").attr("transform", "translate(" + x + "," + y + ")")
        .attr("class", "slices");

    slices.selectAll(".innerSlice").data(_data).enter().append("path").attr("class", "innerSlice")
        .style("fill", function (d) { return d3.hsl(d.data.color).darker(0.7); })
        .attr("d", function (d) { return pieInner(d, rx + 0.5, ry + 0.5, h, ir); })
        .each(function (d) { this._current = d; })
        .on('mouseover', function (d) {
            mouseoverOnArc(tooltip, d);
        })
        .on('mouseout', function (d) {
            mouseoutAonArc(tooltip, d)
        })
        .on('click', function (d) {
            clickonArc(d, tooltip);
        })

    slices.selectAll(".topSlice").data(_data).enter().append("path").attr("class", "topSlice")
        .style("fill", function (d) { return d.data.color; })
        .style("stroke", function (d) { return d.data.color; })
        .attr("d", function (d) { return pieTop(d, rx, ry, ir); })
        .each(function (d) { this._current = d; })
        .on('mouseover', function (d) {
            mouseoverOnArc(tooltip, d, $(this));
        })
        .on('mouseout', function (d) {
            mouseoutAonArc(tooltip, d);
        })
        .on('click', function (d) {
            clickonArc(d, tooltip);
        });
    slices.selectAll(".outerSlice").data(_data).enter().append("path").attr("class", "outerSlice")
        .style("fill", function (d) { return d3.hsl(d.data.color).darker(0.7); })
        .attr("d", function (d) { return pieOuter(d, rx - .5, ry - .5, h); })
        .each(function (d) { this._current = d; })
        .on('mouseover', function (d) {
            mouseoverOnArc(tooltip, d);
        })
        .on('mouseout', function (d) {
            mouseoutAonArc(tooltip, d);
        })
        .on('click', function (d) {
            clickonArc(d, tooltip);
        })

    clickonToggleButton(tooltip);
    plotlegends(data, piesvg, x, y);
};

//plot top arc of pie
function pieTop(d, rx, ry, ir) {
    if (d.endAngle - d.startAngle == 0) return "M 0 0";
    var sx = rx * Math.cos(d.startAngle),
        sy = ry * Math.sin(d.startAngle),
        ex = rx * Math.cos(d.endAngle),
        ey = ry * Math.sin(d.endAngle);

    var ret = [];
    ret.push("M", sx, sy, "A", rx, ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "1", ex, ey, "L", ir * ex, ir * ey);
    ret.push("A", ir * rx, ir * ry, "0", (d.endAngle - d.startAngle > Math.PI ? 1 : 0), "0", ir * sx, ir * sy, "z");
    return ret.join(" ");
};

//plot outer arc of pie
function pieOuter(d, rx, ry, h) {
    var startAngle = (d.startAngle > Math.PI ? Math.PI : d.startAngle);
    var endAngle = (d.endAngle > Math.PI ? Math.PI : d.endAngle);

    var sx = rx * Math.cos(startAngle),
        sy = ry * Math.sin(startAngle),
        ex = rx * Math.cos(endAngle),
        ey = ry * Math.sin(endAngle);

    var ret = [];
    ret.push("M", sx, h + sy, "A", rx, ry, "0 0 1", ex, h + ey, "L", ex, ey, "A", rx, ry, "0 0 0", sx, sy, "z");
    return ret.join(" ");
};

//plot inner arc of pie
function pieInner(d, rx, ry, h, ir) {
    var startAngle = (d.startAngle < Math.PI ? Math.PI : d.startAngle);
    var endAngle = (d.endAngle < Math.PI ? Math.PI : d.endAngle);

    var sx = ir * rx * Math.cos(startAngle),
        sy = ir * ry * Math.sin(startAngle),
        ex = ir * rx * Math.cos(endAngle),
        ey = ir * ry * Math.sin(endAngle);

    var ret = [];
    ret.push("M", sx, sy, "A", ir * rx, ir * ry, "0 0 1", ex, ey, "L", ex, h + ey, "A", ir * rx, ir * ry, "0 0 0", sx, h + sy, "z");
    return ret.join(" ");
};



//function for call date range picker
function calldatepicker(first) {
    var start = moment().subtract(29, 'days');
    var end = moment();
    function cb(start, end, range, first) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        callChart(start, end, first);

    };

    //call date range picker
    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],

        },
        id: 'donut_drill'
    }, cb);

    cb(start, end, '', first);

};

//function to re render the chart when user selects Date
function callChart(start, end, first) {
    var url = '/pie-chart?from_time_stamp=' + start.format('YYYY-MM-D') + '&to_time_stamp=' + end.format('YYYY-MM-D') + '';
    d3.json(url, function (data) {
        if (!first)
            renderpiechart(data, 'initial');
    });
};

//function called when mouse hover on pie

function mouseoverOnArc(tooltip, data, that) {
    tooltip.style("left", d3.event["pageX"] + 10 + "px");
    tooltip.style("top", d3.event["pageY"] - 25 + "px");
    tooltip.style("display", "inline-block");
    tooltip.html('Users : ' + data.data.count)
        .style("font-weight", "bold");
    // console.log( that)
    //     that.addClass('mouseonClass')
    // .css('stroke','white')
    // .css('stoke-width','2px')
}

//function is called when mouseout on pie

function mouseoutAonArc(tooltip, data) {
    tooltip.style("display", "none");
    $('.slices').removeClass('mouseonClass');

};

//function is called when click on arc

function clickonArc(d, tooltip) {
    $('.piegelement').css('opacity', 0);
    $('.pieLegend').css('opacity', 0);
    $('.togglebutton').css('display', 'block');
    var eachpiebarData = d.data.barData;
    var url = 'bar-graph?id=' + d.data.id;

    d3.json(url, function (data) {

        renderdontdrillchart(data, '.drilldownchart', d.data.color);
        $('.bargelement').css('opacity', 1);
    })
    tooltip.style("opacity", "0");
    $('.bargelement').css('opacity', 1);
};

//function fires when click on toggle button
function clickonToggleButton(tooltip) {
    d3.select('.togglebutton').on('click', function (d) {
        $('.piegelement').css('opacity', 1);
        $('.pieLegend').css('opacity', 1)
        $('.bargelement').remove();
        $('.togglebutton').css('display', 'none')
        tooltip.style("opacity", "1");
    });
};

//function for transitions of arcs
function transition(id, data, rx, ry, h, ir) {
    function arcTweenInner(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) { return pieInner(i(t), rx + 0.5, ry + 0.5, h, ir); };
    }
    function arcTweenTop(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) { return pieTop(i(t), rx, ry, ir); };
    }
    function arcTweenOuter(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) { return pieOuter(i(t), rx - .5, ry - .5, h); };
    }
    function textTweenX(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) { return 0.6 * rx * Math.cos(0.5 * (i(t).startAngle + i(t).endAngle)); };
    }
    function textTweenY(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function (t) { return 0.6 * rx * Math.sin(0.5 * (i(t).startAngle + i(t).endAngle)); };
    }

    var _data = d3.layout.pie().sort(null).value(function (d) { return d.count; })(data);

    d3.select("." + id).selectAll(".innerSlice").data(_data)
        .transition().duration(750).attrTween("d", arcTweenInner);

    d3.select("." + id).selectAll(".topSlice").data(_data)
        .transition().duration(750).attrTween("d", arcTweenTop);

    d3.select("." + id).selectAll(".outerSlice").data(_data)
        .transition().duration(750).attrTween("d", arcTweenOuter);

    d3.select("." + id).selectAll(".percent").data(_data).transition().duration(750)
        .attrTween("x", textTweenX).attrTween("y", textTweenY).text('');
};

function plotlegends(data, parent, x, y) {

    if (d3.selectAll('.pieLegend') && d3.selectAll('.pieLegend')[0][0]) {
        d3.selectAll('.pieLegend').remove();
    }
    var legend = parent.selectAll("g.pieLegend")
        .data(data)
        .enter().append("g")
        .attr("class", "pieLegend")
        .attr("transform", function (d, i) { return "translate(-50," + i * 20 + ")"; });
    var topOffset = 25;
    legend.append("rect")
        .attr("x", (1.8 * x))
        .attr("y", y - topOffset)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d) {
            return d.color;
        });

    legend.append("text")
        .attr("x", (1.8 * x) + 20)
        .attr("y", y - topOffset + 10)
        .attr("dy", ".35em")
        .text(function (d) { return d.trip_driving_score; });

}

