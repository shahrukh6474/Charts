
function renderstatesbarchart(data, initial, first) {

    var margin = { top: 20, right: 80, bottom: 150, left: 80, front: 0, back: 0 };

    width = 600 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;
    var depth = 50 - margin.front - margin.back;

    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], .2);

    var yScale = d3.scale.linear()
        .range([height, 0]);

    var yScale2 = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.category20();

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
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(10);


    var yAxis2 = d3.svg.axis()
        .scale(yScale2)
        .orient('right')
        .ticks(5)

    if (d3.selectAll('.mainbarGelement_daws') && d3.selectAll('.mainbarGelement_daws')[0][0]) {
        d3.selectAll('.mainbarGelement_daws').remove();
    }

    var chart = d3.select('.dualaxiswithstate')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('class', 'mainbarGelement_daws')
        .attr('transform', svgHelp.translate(margin.left, margin.right));

    if (!initial) {
        calldaterangepicker_das(first);
    }

    xScale.domain(_.sortBy(_.uniq(_.map(data, 'state'))));
    yScale.domain([0, _.max(data, 'users').users]);
    yScale2.domain([0, _.max(data, 'avg_score').avg_score]);

    function x(d) { return xScale(d.state); }
    function y(d) { return yScale(d.users); }

    var camera = [width / 2, height / 2, -500];
    var barGen = bar3d(height)
        .camera(camera)
        .x(x)
        .y(y)
        .z(zScale(0))
        .width(xScale.rangeBand())
        .height(function (d) { return height - y(d); })
        .depth(xScale.rangeBand());

    chart.append('g')
        .attr('class', 'x-axis-daws')
        .attr('transform', svgHelp.translate(0, height))
        .call(xAxis)
        .append('text')
        .attr("transform", "translate(" + (width / 2) + "," + (margin.bottom - 60) + ")")
        .style('font-weight', 'bold')
        .text('States')

    chart.append('g')
        .attr('class', 'y-axis-daws')
        .call(yAxis)
        // .append('text')
        .append('text')
        .attr("transform", "translate(" + (-(margin.left / 2)) + "," + (height / 2) + ")rotate(-90)")
        .style('font-weight', 'bold')
        .text('User')

    chart.append('g')
        .attr('class', 'y-axis-daws2')
        .call(yAxis2)
        .attr('transform', 'translate(' + width + ',0)')
        .append('text')
        .attr("transform", "translate(" + ((margin.left / 2)) + "," + (height / 2) + ")rotate(-90)")
        .style('font-weight', 'bold')
        .text('Average Rating')
    var extent = xScale.rangeExtent();
    var middle = (extent[1] - extent[0]) / 2;
    chart.selectAll('g.Mainbar_daws').data(data)
        .enter().append('g')
        .attr('class', 'Mainbar_daws')
        // sort based on distance from center, so we draw outermost
        // bars first. otherwise, bars drawn later might overlap bars drawn first
        .sort(function (a, b) {
            return Math.abs(x(b) - middle) - Math.abs(x(a) - middle);
        })
        .attr('fill', function (d, i) {
            return color(i);
        })
        .call(barGen);
    // });

    // height - y2(d.avg)
    chart.selectAll(".barforAvg_daws")
        .data(data)
        .enter().append("rect")
        .attr("class", "barforAvg_daws")
        .attr("x", function (d) { return xScale(d.state); })
        .attr("y", function (d) { return yScale2(d.avg_score); })
        .attr("height", function (d) { return 2; })
        .attr("width", xScale.rangeBand());



    d3.selectAll('.Mainbar_daws')
        .on('click', function (d) {

            var drillColor = $(this).attr('fill');
            d3.selectAll('.mainbarGelement_daws').style('opacity', 0);
            d3.select('.backbutton_daws').style('display', 'block');
            var url = 'http://192.168.1.138:3000/sub-range-users?rangeVal=' + d.state;

            var data = [{
                "total": 1,
                "trip_driving_score": "2 to 3"
            }, {
                "total": 5,
                "trip_driving_score": "3 to 4"
            }, {
                "total": 23,
                "trip_driving_score": "4 to 5"
            }];
            // d3.json(url, function (error, data) {
            renderstatesdrilldown(data, drillColor);
            // })
        })



    chart.selectAll('.avgValue_daws')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'avgValue_daws')
        .attr("x", function (d) { return xScale(d.state) + (xScale.rangeBand() / 2); })
        .attr("y", function (d) { return yScale2(d.avg_score) - 2; })
        .text(function (d) {
            return d.avg_score;
        })
        .style('font-weight', 'bold')
        .style('font-weight', '12px')


    d3.select('.backbutton_daws')
        .on('click', function (d) {
            d3.selectAll('.Mainbar_daws').attr("y", height)
                .attr("height", 0)
                .transition()
                .duration(1000)
                .attr("x", function (d) { return xScale(d.state); })
                .attr("y", function (d) { return xScale(d.users); })
                .attr("height", function (d) { return height - yScale(d.users); })
                .attr("width", xScale.rangeBand());
            d3.selectAll('.mainbarGelement_daws').style('opacity', 1);
            d3.select('.backbutton_daws').style('display', 'none');
            d3.selectAll('.drillelement_daws').remove();

        });


    d3.selectAll('.x-axis-daws .tick text')
        .attr('font-size', '12px')
        .attr('transform', 'translate(30,25) rotate(45)')
        .each(function (d) {
            if (d.length > 7) {
                var str = d.slice(0, 7);
                str = str + '..';
                $(this).text(str);
            }
        });

}


function renderstatesdrilldown(data, drillColor) {

    var margin = {
        top: 20, right: 30, bottom: 50, left: 80, front: 0,
        back: 0
    };
    // width = 800 - margin.left - margin.right,
    // height = 500 - margin.top - margin.bottom;

    data.forEach(function (d, i) {

        if (d.trip_driving_score == null) {
            d.trip_driving_score = "1 to 2";
            // d.id = 1;
        }
    });
    var width = 600 - margin.left - margin.right;
    var height = 450 - margin.top - margin.bottom;
    var depth = 50 - margin.front - margin.back;

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

    // .ticks(10, '%');

    var chart = d3.select('.dualaxiswithstate')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('class', 'drillelement_daws')
        .attr('transform', svgHelp.translate(margin.left, margin.right));

    // d3.tsv('data.tsv', type, function (err, data) {
    // if (err) return;

    // xScale.domain(_.sortBy(_.uniq(_.map(data, 'trip_driving_score'))));
    // yScale.domain([0, _.max(data, 'total').total]);
    xScale.domain(data.map(function (d) { return d.trip_driving_score; }));
    yScale.domain([0, d3.max(data, function (d) { return d.total; })]);

    function x(d) { return xScale(d.trip_driving_score); }
    function y(d) { return yScale(d.total); }

    var camera = [width / 2, height / 2, -500];
    var barGen = bar3d(height)
        .camera(camera)
        .x(x)
        .y(y)
        .z(zScale(0))
        .width(xScale.rangeBand())
        .height(function (d) { return height - y(d); })
        .depth(xScale.rangeBand());

    chart.append('g')
        .attr('class', 'x-axis-drill-daws')
        .attr('transform', svgHelp.translate(0, height))
        .call(xAxis)
        .append('text')
        .attr("transform", "translate(" + (width / 2) + "," + (margin.bottom - 10) + ")")
        .style('font-weight', 'bold')
        .text('Score Range')

    chart.append('g')
        .attr('class', 'y-axis-drill-daws')
        .call(yAxis)
        .append('text')
        .attr("transform", "translate(" + (-(margin.left / 2)) + "," + ((height / 2)) + ")rotate(-90)")
        .style('font-weight', 'bold')
        .text('User')

    var extent = xScale.rangeExtent();
    var middle = (extent[1] - extent[0]) / 2;
    chart.selectAll('g.drill-bar-daws').data(data)
        .enter().append('g')
        .attr('class', 'drill-bar-daws')
        // sort based on distance from center, so we draw outermost
        // bars first. otherwise, bars drawn later might overlap bars drawn first
        .sort(function (a, b) {
            return Math.abs(x(b) - middle) - Math.abs(x(a) - middle);
        })
        .style('fill', drillColor)
        .call(barGen);


};


//eclaring global variable
function calldaterangepicker_das(first) {
    var start = moment().subtract(29, 'days');
    var end = moment();
    function cb_das(start, end, range, first) {
        stDate = start;
        enDate = end;
        $('#reportrange_das span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        callChart_das(start, end, first);
    }

    //clall date range picker
    $('#reportrange_das').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],

        },
        id: 'donut_drill_with_state'
    }, cb_das);

    cb_das(start, end, '', first);

};

function callChart_das(start, end, first) {

    var url = '/state-chart?from_time_stamp=' + stDate.format('YYYY-MM-D') + '&to_time_stamp=' + enDate.format('YYYY-MM-D') + '';
    d3.json(url, function (data) {
        if (!first)
            renderstatesbarchart(data, 'initial');
    })
}