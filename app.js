

/**
 * ====> Customize Your Spin Wheel Behaviro Here:
 *
 */
var ANIMATION_TIME = 4000 // Use to for more spinning the wheel for longer or shorter duration
var MIN_ROTATIONS = 2 // Don't change to to less than one
var MAX_ROTATIONS = 4 // Maximum number of rotations for wheel (Note rotation for selection will go beyond that)


/**
 * ====> Customize Your Spin Wheel Options Here:
 * All the possible options and winning prizes
 *
 * Data:
 *  - label : label for the option
 *  - won : true/false used to determine whether user has won something or not
 *  - chances : the likelihood of picking this option (a chance of 5 is 5x more likely to be picked than an option with chance 1)
 *              Note: chance won't work if you have not purchased chance based template
 *  - description : used to provide more details on the winning/losing popup
 *  - coupon : coupon code than can be used to avail the winnings (only in case of won is true)
 * 
 * Note: Keep number of options even
 * 
 */
var data = [
    { label: "No luck", won: false, chances: 1, description: "No Luck"  },
    { label: "25% off", won: true, chances: 1, description: "20% off", code: "STEAL25",  },
    { label: "50% off", won: true, chances: 1, description: "50% off", code: "STEAL50",  },
    { label: "75% off", won: true, chances: 1, description: "75% off", code: "STEAL75",  },
    { label: "80% off", won: true, chances: 1, description: "80% off", code: "STEAL80",  },
    { label: "Free shipping", won: true, chances: 1, description: "Free shipping", code: "FREE_SHIP",  },
    { label: "Try again", won: false, chances: 1, description: "Try again"  },
    { label: "100% off", won: true, chances: 1, description: "100% off", code: "STEAL_ALL",  },
];

/**
 * ====> Customize Your Spin Wheel Here:
 * Color are used as a the background for the options
 * 
 */
var color = ["#FD820A", "#DB3633", "#299F51", "#1374F3"];


// On Window Load
$(window).on("load", function () {
    
    // Showing spin the wheel, can be done on custom trigger
    $("#game_Modal").modal("show");


    // Win Screen Coupon copy (You won't need to edit this)
    var cpnBtn = document.getElementById("cpnBtn");
    var cpnCode = document.getElementById("cpnCode");
    cpnBtn.onclick = function () {
        navigator.clipboard.writeText(cpnCode.innerHTML);
        cpnBtn.innerHTML = "COPIED";
        setTimeout(function () {
            cpnBtn.innerHTML = "COPY CODE";
        }, 3000);
    };

});

/**
 * (You won't need to edit this)
 * UI Interactions 
 */
function onReward(data) {
    $("#game_Modal").modal("hide");
    if (data.won === false) {
        $("#losing_modal").modal("show");
    }
    else {
        $("#cpnLabel").text(data.label);
        $("#cpnCode").text(data.code);
        $("#coupon_Modal").modal("show");
    }
}

function onCloseAll(data) {
    $("#coupon_Modal").modal("hide");
    $("#game_Modal").modal("hide");
    $("#losing_modal").modal("hide");
}

function pickOne(data) {
    var isDefined = typeof chanceBasedPickOne;
    console.log(isDefined)
    if(isDefined !== "undefined") {
        return chanceBasedPickOne(data)
    }

    data.forEach((d, i) => {
        d._gamificationId = i + 1
    })
    random = Math.floor(Math.random() * data.length)
    picked = data[random % data.length]
    return picked;
}



function pickOneNormaizedForRotation(data) {
    var picked = pickOne(data)

    const randomizedRotations = (MIN_ROTATIONS + Math.floor(Math.random() * (MAX_ROTATIONS - MIN_ROTATIONS)))
    
    var normalized = (data.length * randomizedRotations - picked._gamificationId + (data.length/2))
    return [picked, normalized ];
}

/**
 * (You won't need to edit this function)
 * Picks a random reward based on chance in data
 * If no chance is provided in data all options are equal chance i.e. 1
 *
 */
function chanceBasedPickOne(data) {
    weightedArray = []
    data.forEach((d, i) => {
        if (!d.chances) {
            d.chances = 1
        }
        d.chancesLeft = d.chances
        d._gamificationId = i + 1
    })
    while (true) {
        var nonZero = false
        data.forEach((d, i) => {
            if (d.chancesLeft > 0) {
                nonZero = true
                d.chancesLeft -= 1
                weightedArray.push(i)
            }
        })
        if (nonZero == false) {
            break;
        }
    }
    n = weightedArray.length
    random = Math.floor(Math.random() * n)
    picked = data[weightedArray[random % weightedArray.length]]
    return picked;
}


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
