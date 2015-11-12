///<reference path="./d3.d.ts" />

import Sys = require('./Sys');
import Render = require('./Render');



// определяем свойства и методы узла - проекта Наноцентра
interface ProjectTemplate {
    name: string;
    parent: string;
    type:string;
    status:string;
}

class Project implements ProjectTemplate {
    name: string;
    parent: string;
    type:string;
    status:string;
    position: number[];

    // ссылка на d3 представление
    svgElement;
    // ссылка на кольцо статуса
    statusRing;
    // ссылка на текстовую информацию
    textLabel;
    // ссылка на доли
    svgShares;

    constructor(parent, data){
        this.name = data.name;
        this.parent = data.parent;
        this.type = data.type;

        this.status = data.status;

        // создаем вершину
        this.svgElement = parent
            .append("g")
            .attr("class", "project")
            .attr("name", this.name)
            .attr("parent", this.parent)
            .attr("type", this.type)
            .attr("status", this.status)
            .attr("transform", "translate(" + (data.position.cx) + "," + (data.position.cy) + ")");

        // создаем pie
        this.svgShares = new Render.ProjectPieChart(this.svgElement, data.share, data.position.r);

        // создаем кольцо статуса
        this.statusRing = new Render.ProjectStatusRing(this.svgElement,data.position.r, 1.05 * data.position.r, this.status);

        // создаем текстовое поле
        this.textLabel = new Render.ProjectLabel(this.svgElement, data.position.r, data);

    }

    Hide() {
        this.svgElement = this.svgElement.style("visibility", "visible");
    }

    Show() {
        this.svgElement = this.svgElement.style("visibility", "hidden");
    }

    Move(cx:number, cy:number) {

    }
}

// определяем свойства и методы структуры, в которой храним данные - массиве проектов
interface NodeArray {
    nodes: Project[];
    FindByName(name:string);
    FindWithParentsByName(name:string);
    Filter(types:string[], statuses:string[]);
}

class Projects implements NodeArray {
    nodes: Project[];

    FindByName(name){
        for (var i = 0; i < this.nodes.length; i++) {
            var node_index = -1;
            if (this.nodes[i].name === name) node_index = i;
            if (node_index !== -1) return this.nodes[i];
        }
    }

    FindWithParentsByName(name){
        var output:Project[] = [];
        var projectName = name;
        var currentProject = this.FindByName(projectName) ;
        do {
            output.push(currentProject);
            currentProject = this.FindByName(currentProject.parent)
        } while (currentProject != undefined);
        return output;
    }

    Filter(types:string[], statuses:string[]) {
        var output:Project[] = [];
        for (var i = 0; i < this.nodes.length; i++) {
            if ((types.indexOf(this.nodes[i].type) || statuses.indexOf(this.nodes[i].status)) >= 0) {
                output.push(this.nodes[i])
            }
        }
        return output;
    }

    constructor(parentSvgElement, data) {
        this.nodes = [];
        for (var i = 0; i < data.length; i++) {
            var newProject = new Project(parentSvgElement, data[i]);
            //console.log(newProject);
            this.nodes.push( newProject );
        }
    }

}

class SVG_graph {
    svg;
    a = 5;
    constructor(width:number, height:number, parentTag:string) {

        this.a = 5;

        this.svg = d3.select(parentTag)
            .append("div")
            .classed("svg-yNamecontainer", true) // container class to make it responsive
            .append("svg")
            .attr("preserveAspectRatio", "xMaxYMin slice")
            .attr("viewBox", "0 0 " + width + " " + height)
            .classed("svg-content-responsive", true)
            .append("g")
            .call(d3.behavior.zoom().scaleExtent([0.1, 8]).on("zoom", this.zoom.bind(this)))
            .append("g");
    }

    private zoom() {
        this.svg.attr("transform", "translate(" + (<any> d3.event).translate + ")scale(" + (<any> d3.event).scale + ")");
    }
}

// инициализируем данные
d3.json("json.json", function(error, data) {
    if (error) return console.warn(error);
    if (data) {
        console.log(data);
        var Vis = new SVG_graph(15000,15000,".vis");
        var NanoProjects = new Projects(Vis.svg, data)
        console.log(NanoProjects);
    }
});



