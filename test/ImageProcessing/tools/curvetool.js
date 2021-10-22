let CurveTool = function() {
    let width = 255,
        height = 255;

    let points = [[0, height], [width, 0]];

    let dragged = null,
        selected = points[0];

    let line = d3.svg.line();
    let svg;

    this.resetCurveTool = function() {
        while( points.length > 2)
            points.splice(1, 1);

        selected = null;

        redraw();
    };

    this.getLUT = function() {
        // get the point coordinates using the points in the SVG
        let pts = [];
        for(let i=0;i<points.length;i++) {
            // need to flip y coordinates
            pts.push({x: points[i][0], y: 255 - points[i][1]});
        }
        //console.log(pts);

        let crCurve = new CatmullRomCurve(pts);

        // generate lut using catmull-rom curve
        let lut = [0];
        for( let i=1;i<255;i++) {
            lut[i] = crCurve.getValue(i);
        }
        lut.push(255);

        return lut;
    };

    function redraw() {
        //console.log('redrawing...');

        svg.select("path").attr("d", line);

        // display the dots
        let circle = svg.selectAll("circle")
            .data(points, function(d) { return d; });

        circle.enter().append("circle")
            .attr("r", 1e-6)
            .on("mousedown", function(d) { selected = dragged = d; redraw(); })
            .transition()
            .duration(750)
            .ease("elastic")
            .attr("r", 6.5);

        circle
            .classed("selected", function(d) { return d === selected; })
            .attr("cx", function(d) { return d[0]; })
            .attr("cy", function(d) { return d[1]; });

        circle.exit().remove();

        if (d3.event) {
            d3.event.preventDefault();
            d3.event.stopPropagation();
        }
    }

    this.init = function( target )
    {
        if( !target ) {
            throw "failed to initialize curve tool";
        }

        // add the curve tool
        svg = d3.select(target).append("svg")
            .attr("id", "curvetool")
            .attr("width", width)
            .attr("height", height)
            .attr("tabindex", 1);

        svg.append("rect")
            .attr("id", "rect")
            .attr("width", width)
            .attr("height", height)
            .on("mousedown", mousedown);

        svg.append("path")
            .datum(points)
            .attr("class", "line")
            .call(redraw);

        d3.select(window)
            .on("mousemove", mousemove)
            .on("mouseup", mouseup)
            .on("keydown", keydown);

        line.interpolate("cardinal");
        redraw();
    };

    function sortpoints()
    {
        points.sort(function(a, b){
            if( a[0] == b[0] ) return b[1] - a[1];
            else return a[0] - b[0];
        });


        //console.log('updating path');
        //svg.select("path").attr("d", line(points));
    }

    function change() {
        console.log(this.value);
        line.interpolate(this.value);
        redraw();
    }

    function mousedown() {
        points.push(selected = dragged = d3.mouse(svg.node()));
        sortpoints();
        redraw();
    }

    function pathPos( x )
    {
        let pathEl = svg.select("path").node();
        let pathLength = pathEl.getTotalLength();

        let svgcanvas = document.getElementById("rect");
        let offsetLeft = svgcanvas.getBoundingClientRect().left;
        let beginning = x, end = pathLength, target;
        let pos;
        while (true) {
            target = Math.floor((beginning + end) / 2);
            pos = pathEl.getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== x) {
                break;
            }
            if (pos.x > x)      end = target;
            else if (pos.x < x) beginning = target;
            else                break; //position found
        }
        return pos;
    }

    function trackMouse()
    {
        let pathEl = svg.select("path").node();
        let pathLength = pathEl.getTotalLength();

        let svgcanvas = document.getElementById("rect");
        let offsetLeft = svgcanvas.getBoundingClientRect().left;
        let x = d3.event.pageX - offsetLeft;
        let beginning = x, end = pathLength, target;
        return pathPos( x );
    }

    function mousemove() {
        if (!dragged)
        {
            //let pos = trackMouse();
            //console.log(pos);
            return;
        }

        let m = d3.mouse(svg.node());
        dragged[0] = Math.max(0, Math.min(width, m[0]));
        dragged[1] = Math.max(0, Math.min(height, m[1]));

        sortpoints();

        redraw();

        $(document).trigger('curvechanged');
    }

    function mouseup() {
        if (!dragged) return;
        mousemove();
        dragged = null;

        $(document).trigger('curvechanged');
    }

    function keydown() {
        if (!selected) return;
        switch (d3.event.keyCode) {
            case 8: // backspace
            case 46: { // delete
                let i = points.indexOf(selected);
                points.splice(i, 1);
                selected = points.length ? points[i > 0 ? i - 1 : 0] : null;
                redraw();
                break;
            }
        }
    }
}
