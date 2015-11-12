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
        SetSize(innerR, outerR) {
            this.svgElement
                .attr("d", Sys.ringGenerator(innerR, outerR));
        }
    }

    export class ProjectLabel {
        name;
        money;
        svgElement;
        xDim:number;
        yDim:number;

        constructor(parentSvgElement, r, data) {
            this.name = data.name;
            this.money = data.money;

            this.xDim = 1.4 * r;
            this.yDim = 1.4 * r;

            this.svgElement = parentSvgElement
                .append("g")
                .append('foreignObject')
                .attr('x',  - 0.5 * this.xDim)
                .attr('y', - 0.5 * this.yDim)
                .attr('width', this.xDim)
                .attr('height', this.yDim)
                .append("xhtml:div")
                .style("height", this.xDim + "px")
                .style("text-align","center")
                .style("font-family","Ubuntu")
                .style("display","flex")
                .style("align-items","center")
                .style("justify-content","center")
                .append("xhtml:div");
            this.svgElement
                .append("p")
                .attr("class","text name")
                .style("font-size", Sys.getFontSize(this.xDim, 3, this.name) + "px")
                .html(this.name);
            this.svgElement
                .append("p")
                .attr("class","text money")
                .html(this.money);
        }



    }

    export class ProjectPieChart {
        sharesSvgElement;

        constructor(parentSvgElement, shares, r) {
            var names = ["UCTT","TK","partner","partner","partner","partner","partner"];

            this.sharesSvgElement = parentSvgElement
                .append("g")
                .attr("class","shares")
                .selectAll(".arc")
                .data(Sys.pieGenerator()(shares))
                .enter().append("g")
                .attr("class", function(d,i){ return "shares " + names[i] });

            this.sharesSvgElement
                .append("path")
                .attr("d",Sys.arcGenerator(r));
        }

    }