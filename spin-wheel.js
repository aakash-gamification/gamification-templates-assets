containerWidth = 400;
      isMobile = false;

      if (window.innerWidth < window.innerHeight) {
        isMobile = true;
        containerWidth = window.innerWidth * 0.9;
      }

      // -----wheel-spin-js------
      var padding = { top: 0, right: 0, bottom: 0, left: 0 },
        w = containerWidth - padding.left - padding.right,
        h = containerWidth - padding.top - padding.bottom,
        r = Math.min(w, h) / 2,
        rotation = 0,
        oldrotation = 0,
        picked = 100000,
        oldpick = [];
      // color = d3.scale.category20();//category20c()
      //randomNumbers = getRandomNumbers();

      var svg = d3
        .select("#spinwheel")
        .append("svg")
        .data([data])
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .attr("viewBox", "0 0 " + w + " " + w + "")
        .attr("width", w)
        .attr("height", h + padding.top + padding.bottom)
        .attr("transform", "rotate(" + 360 / data.length / 2 + ")");
      var container = svg
        .append("g")
        .attr("class", "chartholder")
        .attr(
          "transform",
          "translate(" +
            (w / 2 + padding.left) +
            "," +
            (h / 2 + padding.top) +
            ")"
        );
      var vis = container.append("g");

      var pie = d3.layout
        .pie()
        .sort(null)
        .value(function (d) {
          return 1;
        });
      // declare an arc generator function
      var arc = d3.svg.arc().outerRadius(r);
      // select paths, use arc generator to draw
      var arcs = vis
        .selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "slice");

      arcs
        .append("path")
        .attr("fill", function (d, i) {
          var c = color[i % color.length];
          return c;
        })
        .attr("d", function (d) {
          return arc(d);
        });
      // add the text
      arcs
        .append("text")
        .attr("transform", function (d) {
          d.innerRadius = 0;
          d.outerRadius = r;
          d.angle = (d.startAngle + d.endAngle) / 2;
          return (
            "rotate(" +
            ((d.angle * 180) / Math.PI - 90) +
            ")translate(" +
            (d.outerRadius - 60) +
            ")"
          );
        })
        .attr("dy", 5)
        .attr("dx", !isMobile ? 30 : 40)
        .attr("font-size", !isMobile ? "16px" : "13px")
        .attr("fill", "#ffffff")
        .attr("text-anchor", "end")
        .text(function (d, i) {
          return data[i].label;
        });
      $("#spin_button").on("click", spin);
      function spin(d) {
        $("#spin_button").on("click", null);
        //all slices have been seen, all done
        //console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
        if (oldpick.length == data.length) {
          $("#spin_button").on("click", null);
          return;
        }

        
        var ps = 360 / data.length,
        pieslice = Math.round(1440 / data.length)

        var [pickedOption, randomNumber] = pickOneNormaizedForRotation(data)
        rotation = Math.round(randomNumber * ps);

        picked = Math.round(data.length - (rotation % 360) / ps) + 2;

        picked = picked >= data.length ? picked % data.length : picked;
        if (oldpick.indexOf(picked) !== -1) {
          d3.select(this).call(spin);
          return;
        } else {
          oldpick.push(picked);
        }
        var interval = setInterval(function () {
          $(".wheeldots").addClass("active-dots");
          setTimeout(function () {
            $(".wheeldots").removeClass("active-dots");
          }, 100);
        });
        vis
          .transition()
          .duration(ANIMATION_TIME)
          .attrTween("transform", rotTween)
          .each("end", function () {
            clearInterval(interval);
            d3.select(".slice:nth-child(" + (picked + 1) + ") path");
            d3.select("#question h1").text(data[picked].question);
            oldrotation = rotation;
            onReward(data[picked]);
          });
      }
      container
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 30)
        .style({ fill: "#ffffff" });
  

      function rotTween(to) {
        var i = d3.interpolate(oldrotation % 360, rotation);
        return function (t) {
          return "rotate(" + i(t) + ")";
        };
      }