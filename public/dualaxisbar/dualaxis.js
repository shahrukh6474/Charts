
function renderbarchart(data, initial, first) {
    // alert('renderbar');


    var margin = {
        top: 40,
        right: 80,
        bottom: 100,
        left: 80,
        front: 0,
        back: 0
    };


    var width = 600 - margin.left - margin.right;
    var height = 450 - margin.top - margin.bottom;
    var depth = 50 - margin.front - margin.back;

    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], .2);

    var yScale = d3.scale.linear()
        .range([height, 0]);

    var format = d3.format("d");

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
        .tickFormat(format)
    // .ticks(10, '%');
    if (d3.selectAll('.mainbarGelement') && d3.selectAll('.mainbarGelement')[0][0]) {
        d3.selectAll('.mainbarGelement').remove();
    }
    var chart = d3.select('.dualaxischart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('class', 'mainbarGelement')
        .attr('transform', svgHelp.translate(margin.left, margin.right));
    if (!initial)
        calldatepickerda(first);

    xScale.domain(_.sortBy(_.uniq(_.map(data, 'Distancerange'))));
    yScale.domain([0, _.max(data, 'users').users]);
    yScale2.domain([0, _.max(data, 'avg_score').avg_score]);

    function x(d) { return xScale(d.Distancerange); }
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
        .attr('class', 'x-axis-bardrilldown')
        .attr('transform', svgHelp.translate(0, height))
        .call(xAxis)
        .append('text')
        .attr("transform", "translate(" + (width / 2) + "," + (margin.bottom - 40) + ")")
        .style('font-weight', 'bold')
        .text('Driving Range')

    chart.append('g')
        .attr('class', 'y-axis-bardrilldown')
        .call(yAxis)
        .append('text')
        .attr('transform', svgHelp.rotate(-90))
        .attr('y', -(margin.left / 2))
        .attr('x', -(height / 2))
        .attr('dy', '.71em')
        // .append('text')
        // .attr("transform", "translate(" + (-(margin.left / 2)) + "," + (-(height / 2)) + ")rotate(-90)")
        .style('font-weight', 'bold')
        .text('Number of Users')
    chart.append('g')
        .attr('class', 'y-axis-2')
        .call(yAxis2)
        .attr('transform', 'translate(' + width + ',0)')
        .append('text')
        .attr("transform", "translate(" + ((margin.left / 2)) + "," + (height / 2) + ")rotate(-90)")
        .style('font-weight', 'bold')
        .text('Average Rating')
    // .attr('transform', svgHelp.rotate(45))

    var extent = xScale.rangeExtent();
    var middle = (extent[1] - extent[0]) / 2;
    chart.selectAll('g.Mainbar').data(data)
        .enter().append('g')
        .attr('class', 'Mainbar')
        // sort based on distance from center, so we draw outermost
        // bars first. otherwise, bars drawn later might overlap bars drawn first
        .sort(function (a, b) {
            return Math.abs(x(b) - middle) - Math.abs(x(a) - middle);
        })
        .attr('fill', function (d, i) {
            return color(i)
        })
        .call(barGen);

    chart.selectAll(".barforAvg")
        .data(data)
        .enter().append("rect")
        .attr("class", "barforAvg")
        .attr("x", function (d) { return xScale(d.Distancerange); })
        .attr("y", function (d) { return yScale2(d.avg_score); })
        .attr("height", function (d) { return 2; })
        .attr("width", xScale.rangeBand());

    d3.selectAll('.Mainbar')
        .on('click', function (d) {
            // d3.selectAll('.mainbarGelement').style('opacity', 0);
            console.log($(this).attr('fill'))
            var drillColor = $(this).attr('fill');
            d3.selectAll('.mainbarGelement').style('display', 'none');
            d3.select('.backbutton').style('display', 'block');
            var url = '/sub-range-users?rangeVal=' + d.Distancerange;
            d3.json(url, function (error, data) {
                renderdrilldownchart(data, drillColor);
            })
        })
    chart.selectAll('.avgValue')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'avgValue')
        .attr("x", function (d) { return xScale(d.Distancerange) + (xScale.rangeBand() / 2); })
        .attr("y", function (d) { return yScale2(d.avg_score) - 2; })
        .text(function (d) {
            return d.avg_score;
        })
        .style('font-weight', 'bold')
        .style('font-weight', '12px')


    d3.select('.backbutton')
        .on('click', function (d) {
            d3.selectAll('.Mainbar').attr("y", height)
                .attr("height", 0)
                .transition()
                .duration(1000)
                .attr("x", function (d) { return x(d.Distancerange); })
                .attr("y", function (d) { return y(d.users); })
                .attr("height", function (d) { return height - y(d.users); })
                .attr("width", xScale.rangeBand());
            // d3.selectAll('.mainbarGelement').style('opacity', 1);
            d3.selectAll('.mainbarGelement').style('display', 'block');
            d3.select('.backbutton').style('display', 'none');
            d3.selectAll('.drillelement').remove();

        });

    d3.selectAll('.x-axis-bardrilldown .tick text')
        .attr('transform', 'translate(-20,15) rotate(-45)')


}


function renderdrilldownchart(data, drillColor) {


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

    var chart = d3.select('.dualaxischart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('class', 'drillelement')
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
        .attr('class', 'x-axis-drill')
        .attr('transform', svgHelp.translate(0, height))
        .call(xAxis)
        .append('text')
        .attr("transform", "translate(" + (width / 2) + "," + (margin.bottom - 10) + ")")
        .style('font-weight', 'bold')
        .text('Score Range')

    chart.append('g')
        .attr('class', 'y-axis-drill')
        .call(yAxis)
        .append('text')
        .attr("transform", "translate(" + (-(margin.left / 2)) + "," + ((height / 2)) + ")rotate(-90)")
        .style('font-weight', 'bold')
        .text('User')

    var extent = xScale.rangeExtent();
    var middle = (extent[1] - extent[0]) / 2;
    chart.selectAll('g.drill-bar').data(data)
        .enter().append('g')
        .attr('class', 'drill-bar')
        // sort based on distance from center, so we draw outermost
        // bars first. otherwise, bars drawn later might overlap bars drawn first
        .sort(function (a, b) {
            return Math.abs(x(b) - middle) - Math.abs(x(a) - middle);
        })
        .style('fill', drillColor)
        .call(barGen);


};

function calldatepickerda(first) {
    var start_da = moment().subtract(29, 'days');
    var end_da = moment();
    function cbda(start_da, end_da, range, first) {
        $('#reportrange_da span').html(start_da.format('MMMM D, YYYY') + ' - ' + end_da.format('MMMM D, YYYY'));
        callChartda(start_da, end_da, first);
    }

    //clall date range picker
    $('#reportrange_da').daterangepicker({
        startDate: start_da,
        endDate: end_da,
        ranges: {
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],

        },
        id: 'dual_axis'
    }, cbda);

    cbda(start_da, end_da, '', first);

};

function callChartda(start, end, first) {
    var url = '/user-travelled-avg-data?from_time_stamp=' + start.format('YYYY-MM-D') + '&to_time_stamp=' + end.format('YYYY-MM-D') + '';
    d3.json(url, function (data) {
        if (!first)
            renderbarchart(data, 'initial');
    });
}