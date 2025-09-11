import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//merci à https://observablehq.com/@kevinfjbecker/d3-flower
export default class chaoticumFlower {
    constructor(params) {
        var me = this;
        this.id = params.id ? params.id : "flowerSvg";
        this.width = params.width ? params.width : 400;
        this.height = params.height ? params.height : 400;
        this.numberOfPetals = params.numberOfPetals ? params.numberOfPetals : 6;
        this.scaleColors = params.scaleColors ? params.scaleColors : d3.scaleSequential(d3.interpolateRainbow);
        this.modelesPetal = params.modelesPetal ? params.modelesPetal : [
            'M0 0 C50 40 50 70 20 100 L0 85 L-20 100 C-50 70 -50 40 0 0'
        ];
        let svg;
        this.init = function () {
            svg = d3.create("svg")
                .attr("xmlns","http://www.w3.org/2000/svg")
                .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
                .attr("width", me.width)
                .attr("height", me.height)
                .attr("id", me.id)
                .attr("class","chaoticumFlower");

            let flower = svg.append('g')
                .attr('transform', `translate(${width / 2}, ${height / 2})`),
                color = getRndRGBColor(me.numberOfPetals)[0],
                opacity = 1;
            
            flower
                .selectAll(".petal")
                .data(getAngles(me.numberOfPetals))
                .join("path")
                .attr("d", me.modelesPetal[0])
                .attr('stroke', d3.color(color).darker())
                .attr('stroke-width', 4)
                .attr("fill",  color)
                .attr('fill-opacity', opacity)
                .attr('transform', d => `rotate(${d})scale(0.5)`);
            return svg.node();
        }            
            
        this.toString = function(){
            return svg.node().outerHTML;
        }
        function getAngles(numberOfPetals){return(
            d3.range(0, 360, 360 / numberOfPetals)
        )}
        this.toString = function(){
            return svg.node().outerHTML;
        }
        function getRndRGBColor(nb)
        {
            //initialise le random
            let colors = [];
            for (let i = 0; i < nb; i++) {
                colors.push(me.scaleColors ? me.scaleColors(Math.random()) : '#' + (Math.random() * 0xffffff | 0).toString(16));
            }
            return colors;
        }        
        me.init();
    }

}