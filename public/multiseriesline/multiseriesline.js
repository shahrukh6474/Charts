function renderlinechart(data, initial, first) {
    // Set the dimensions of the canvas / graph
    var margin = { top: 40, right: 150, bottom: 80, left: 80 },
        width = 600 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    var color = d3.scale.category10();
    if (!initial) {
        calldaterangepicker_msl(first)
    }
    var format = d3.format("d");
    var nestedData = d3.nest()
        .key(function (d) {
            return d.identity;
        })
        .entries(data);
    // console.log(data,'data')
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Define the axes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickPadding(10);

    var yAxis = d3.svg.axis().scale(y)
        .orient("left")
        .tickFormat(format)
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(10);


    //claculate last six month names for x - domain
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var today = new Date();
    var d;
    var month;
    var xDomain = [];
    for (var i = 6; i > 0; i -= 1) {
        d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        month = monthNames[d.getMonth() + 1];
        if (month == undefined) {
            month = 'january'
        }
        xDomain.push(month);
    };

    x.domain(xDomain.map(function (d) { return d; }));

    if (d3.selectAll('.lineGelement') && d3.selectAll('.lineGelement')[0][0]) {
        d3.selectAll('.lineGelement').remove();
    };
    if (d3.selectAll('.lineSvg') && d3.selectAll('.lineSvg')[0][0]) {
        d3.selectAll('.lineSvg').remove();
    }
    //plot svg
    var svg = d3.select("#line_chart")
        .append("svg")
        .attr('class', 'lineSvg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr('class', 'lineGelement')
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // Add the X Axis
    svg.append("g")
        .attr("class", "x-axis-line")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append('text')
        .attr("transform", "translate(" + (width / 2) + "," + (margin.bottom / 2) + ")")
        .style('font-weight', 'bold')
        .text('Months')

    // console.log(data,'data');
    // console.log(nestedData,'nestedData');debugger;
    // nestedData.forEach((element,key)=>{
    //     let count = 0;
    //     element.values.forEach((elem,k)=>{
    //         count += elem.registered_count;
    //         elem.registered_count = count;
    //     });
    // });
    // console.log(nestedData);debugger

    var arrayMax = [];
    var maxofY
    for (var i = 0; i < nestedData.length; i++) {
        var maxYdomain = nestedData[i].values;
        maxofY = d3.max(data, function (d) { return d.registered_count; });
        arrayMax.push(maxofY)
    };

    var ydomain = [0, d3.max(arrayMax)];
    y.domain(ydomain);
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y-axis-line")
        .call(yAxis)
        .append('text')
        .attr("transform", "translate(" + (-(margin.left / 2)) + "," + (height / 2) + ")rotate(-90)")
        .style('font-weight', 'bold')
        .text('Number of Users')


    //add line
    var valueline = d3.svg.line()
        .x(function (d) {
            return x(d.month)
        })
        .y(function (d) {
            return y(d.registered_count);
        });


    //plot multi lines
    for (var j = 0; j < nestedData.length; j++) {

        var data = nestedData[j].values;
        var LineG = svg.append('g').datum(nestedData[j].values).attr('class', 'LineGelement')
        // Add the valueline path.
        LineG.append("path")
            .attr("class", "line")
            .attr("d", valueline(data))
            .attr("transform", "translate(" + margin.left / 2 + "," + 0 + ")")
            .attr('fill', 'none')
            .attr('stroke-width', '2px')
            .attr('stroke', function (d) {
                return color(j);
            });

        //plot points
        LineG.selectAll('.data-point')
            .data(nestedData[j].values)
            .enter()
            .append('circle')
            .attr('class', 'data-point')
            .attr('cx', function (d) {
                return x(d.month) + margin.left / 2;
            })
            .attr('cy', function (d) {
                return y(d.registered_count);
            })
            .attr('r', function (d, i) {
                return 2.5;
            })
            .style('fill', function (d, i) {
                return color(j);
            })
            .style('opacity', 1)
            .style('stroke', function (d, i) {
                return "none";
            })
            .style('stroke-width', function (d, i) {
                return 0;
            })
            .style('cursor', 'pointer')

    };

    plotlinechartlegends(nestedData, svg, width, margin);
}

function calldaterangepicker_msl(first) {


    // var start = moment().subtract(29, 'days');
    var start = moment().subtract(5, 'months');
    var end = moment();
    function cb_msl(start, end, range, first) {
        stDate = start;
        enDate = end;
        $('#reportrange_msl span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        callChart_msl(start, end, first);
    }

    //clall date range picker
    $('#reportrange_msl').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],

        },
        id: 'multi_series_line'
    }, cb_msl);

    cb_msl(start, end, '', first);

};

//function to re render the chart when user selects Date
function callChart_msl(start, end, first) {
    var url = '/pie-chart?from_time_stamp=' + start.format('YYYY-MM-D') + '&to_time_stamp=' + end.format('YYYY-MM-D') + '';
    d3.json(url, function (data) {
        if (!first)
            renderlinechart(data, 'initial');
    });
}

function plotlinechartlegends(data, parent, width, margin) {

    // if (d3.selectAll('.pieLegend') && d3.selectAll('.pieLegend')[0][0]) {
    //     d3.selectAll('.pieLegend').remove();
    // };

    var color = d3.scale.category10();
    var legend = parent.selectAll("g.lineLegend")
        .data(data)
        .enter().append("g")
        .attr("class", "lineLegend")
        .attr("transform", function (d, i) { return "translate(-50," + i * 20 + ")"; });
    var topOffset = 15;
    var legendX = width + margin.right / 2 + topOffset;
    legend.append("rect")
        .attr("x", legendX)
        .attr("y", 20)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d, i) {
            return color(i);
        });

    legend.append("text")
        .attr("x", legendX + 20)
        .attr("y", 20 + 10)
        .attr("dy", ".35em")
        .text(function (d,i) {
            if(i ==0)
            {
                return 'Registered Users'
            }else{
                return 'Active Users'
            }
            // return d.key;
        })
        .style('font-size', '11px')
        .style('font-weight', 'bold');

}