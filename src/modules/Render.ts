// Сюда скидываем функции, которые отвечают за перерисовку графических элементов проекта
// Классы предоставляют только интерфейс и данных о проектах не хранят!

import Sys = require('./Sys');

    export class ProjectStatusRing {
        svgElement;
        constructor(parentSvgElement, innerR, outerR, cssClass) {
            this.svgElement = parentSvgElement
                .append("g")
                .attr("class", "statusRing")
                .append("g")
                .attr("class", "status " + Sys.excludeSpaces(cssClass))
                .append("path")
                .attr("d", Sys.ringGenerator(innerR, outerR));
        }
        SetRadius(innerR, outerR) {
            this.svgElement
                .transition()
                .attr("d", Sys.ringGenerator(innerR, outerR));
        }
        Remove() {
            this.svgElement = this.svgElement
                .remove();
        }
    }

    export class ProjectLabel {

        private foreignObject;
        private outerDiv;
        private innerDiv;

        private text;

        private xDim;
        private yDim;

        constructor(parentSvgElement, r, data) {

            this.xDim = 1.4 * r;
            this.yDim = 1.4 * r;

            this.foreignObject = parentSvgElement
                .append("g")
                .append('foreignObject');

            this.outerDiv = this.foreignObject
                .append("xhtml:div");


            this.innerDiv= this.outerDiv

                .style("text-align","center")
                .style("font-family","Ubuntu")
                .style("display","flex")
                .style("align-items","center")
                .style("justify-content","center")
                .append("xhtml:div");

            this.text = [data.name];
            this.SetRadius(r);
        }

        private SetRadius(r) {
            this.xDim = 1.4 * r;
            this.yDim = 1.4 * r;

            this.foreignObject
                .transition()
                .attr('x',  - 0.5 * this.xDim)
                .attr('y', - 0.5 * this.yDim)
                .attr('width', this.xDim)
                .attr('height', this.yDim);

            this.outerDiv
                .transition()
                .style("height", this.xDim + "px");

            this.SetText(this.text);
        }

        Remove() {
            this.foreignObject = this.foreignObject
                .remove();
        }

        SetText(text) {
            var xDim = this.xDim;
            var svgElement = this.innerDiv
            svgElement.selectAll("p").remove();
            text.forEach(function(sentence) {
                svgElement
                    .append("p")
                    .style("margin", "0px")
                    .attr("class","text name")
                    .style("font-size", Sys.getFontSize(xDim, 3, sentence) + "px")
                    .html(sentence);
            })
        }

    }

    export class ProjectPieChart {
        svgElement;
        shares;
        names;
        r;

        constructor(parentSvgElement, shares, names, r) {
            this.r = r;
            this.shares = shares;
            this.names = names;

            this.svgElement = parentSvgElement
                .append("g")
                .attr("class","shares");

            this.svgElement
                .selectAll(".arc")
                .data(Sys.pieGenerator()(shares))
                .enter().append("g")
                .attr("class", function(d,i){ return names[i] })
                    .append("path")
                    .attr("d",Sys.arcGenerator(r));
        }
        Remove() {
            this.svgElement = this.svgElement
                .remove();
        }
        SetProperty(shares, names) {
            this.shares = shares;
            this.names = names;

            var svgElement = this.svgElement;
            console.log(svgElement);
            console.log("Hooray!!!\n", shares, names);
            svgElement.selectAll("g").remove();
            svgElement
                .selectAll(".arc")
                .data(Sys.pieGenerator()(shares))
                .enter().append("g")
                .attr("class", function(d,i){ return names[i] })
                    .append("path")
                    .attr("d",Sys.arcGenerator(this.r));

        }
        SetRadius(r) {
            this.r = r;
            var svgElement = this.svgElement;
            var names = this.names;
            svgElement.selectAll("path")
                .transition()
                .attr("d",Sys.arcGenerator(r));
        }



    }