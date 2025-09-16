import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//merci à https://observablehq.com/@kevinfjbecker/d3-flower
export default class chaoticumFlower {
    constructor(params) {
        var me = this;
        this.id = params.id ? params.id : "flowerSvg";
        this.width = params.width ? params.width : 400;
        this.height = params.height ? params.height : 400;
        this.docs = params.docs ? params.docs : false;
        this.numberOfPetals = params.numberOfPetals ? params.numberOfPetals : me.docs ? me.docs[1].length : 6;
        this.scaleColors = params.scaleColors ? params.scaleColors : d3.scaleSequential(d3.interpolateRainbow);
        this.modelesPetal = params.modelesPetal ? params.modelesPetal : [
            {'path':'M0 0 C50 40 50 70 20 100 L0 85 L-20 100 C-50 70 -50 40 0 0','viewBox':"-53 -50 106 100"},
        ];
        let svg;
        this.init = function () {
            svg = d3.create("svg")
                .attr("xmlns","http://www.w3.org/2000/svg")
                .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
                .attr("width", me.width)
                .attr("height", me.height)
                .attr("id", me.id)
                .attr("viewBox", me.modelesPetal[0].viewBox)
                .attr("class","chaoticumFlower");
            //définition du style
            let angles = getAngles(me.numberOfPetals),
                color = getRndRGBColor(1)[0],
                opacity = 0.8;
            svg.append("style").text("path { stroke:"+d3.color(color).darker()+";stroke-width:0;fill-opacity:"+opacity+"}");

            //construction des pattern avec les images
            if(me.docs){
                let patterns = svg.append('defs')
                    .selectAll("pattern")
                    .data(me.docs[1])
                    .join("pattern")
                    .attr("id", (d,i) => "img"+i)
                    .attr("patternUnits", "userSpaceOnUse")
                    .attr("preserveAspectRatio","xMidYMid")
                    //.attr("patternTransform",(d,i)=>d.photo ? `rotate(${angles[i]})translate(-${d.photo.width/10/2},10)`:"")
                    .attr("width", d=>d.photo ? d.photo.width : 0)
                    .attr("height", d=>d.photo ? d.photo.height : 0);
                
                patterns.append("image")
                    .attr("href", d => {
                        return d.photo ? d.photo.data : ""
                    })
                    .attr("preserveAspectRatio","none")
                    .attr("width", d=>d.photo ? d.photo.width/10 : 0)
                    .attr("height", d=>d.photo ? d.photo.height/10 : 0);
            }
            

            let flower = svg.append('g')
                .selectAll(".petal")
                .data(getAngles(me.numberOfPetals))
                .join("path")
                .attr("d", me.modelesPetal[0].path)
                /*défini dans le style
                .attr('stroke', d3.color(color).darker())
                .attr('stroke-width', 4)
                .attr('fill-opacity', opacity)
                */
                .attr("fill", (d,i) => {
                    return me.docs[1][i] && me.docs[1][i].photo ? "url(#img"+i+")" : color
                })
                .attr('transform', d => `rotate(${d})scale(0.5)`);

            //place le thème au centre de la fleur
            if(me.docs){
                let theme = svg.append('text')
                    .attr("text-anchor","middle")
                    .attr("y",10)
                    .attr("font-size",20)
                    .attr("font-family","Arial, Helvetica, sans-serif")
                    .attr("fill",d3.color(color).darker().darker())
                    .text(me.docs[0] ? me.docs[0] : "");
            }
        }            
            
        this.toString = function(){
            return svg.node().outerHTML;
        }
        function getAngles(numberOfPetals){return(
            d3.range(0, 360, 360 / numberOfPetals)
        )}
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