(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
///<reference path="./d3.d.ts" />
var Project = require('./Project');
var Projects = (function () {
    function Projects(parentSvgElement, data) {
        this.nodes = [];
        for (var i = 0; i < data.length; i++) {
            var newProject = new Project(parentSvgElement, data[i]);
            //console.log(newProject);
            this.nodes.push(newProject);
        }
    }
    Projects.prototype.FindByName = function (name) {
        for (var i = 0; i < this.nodes.length; i++) {
            var node_index = -1;
            if (this.nodes[i].name === name)
                node_index = i;
            if (node_index !== -1)
                return this.nodes[i];
        }
    };
    Projects.prototype.FindWithParentsByName = function (name) {
        var output = [];
        var projectName = name;
        var currentProject = this.FindByName(projectName);
        do {
            output.push(currentProject);
            currentProject = this.FindByName(currentProject.parent);
        } while (currentProject != undefined);
        return output;
    };
    Projects.prototype.Filter = function (types, statuses) {
        var output = [];
        for (var i = 0; i < this.nodes.length; i++) {
            if ((types.indexOf(this.nodes[i].type) || statuses.indexOf(this.nodes[i].status)) >= 0) {
                output.push(this.nodes[i]);
            }
        }
        return output;
    };
    return Projects;
})();
var SVG_graph = (function () {
    function SVG_graph(width, height, parentTag) {
        this.a = 5;
        this.a = 5;
        this.svg = d3.select(parentTag).append("div").classed("svg-yNamecontainer", true).append("svg").attr("preserveAspectRatio", "xMaxYMin slice").attr("viewBox", "0 0 " + width + " " + height).classed("svg-content-responsive", true).append("g").call(d3.behavior.zoom().scaleExtent([0.1, 8]).on("zoom", this.zoom.bind(this))).append("g");
    }
    SVG_graph.prototype.zoom = function () {
        this.svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    };
    return SVG_graph;
})();
// инициализируем данные
d3.json("json.json", function (error, data) {
    if (error)
        return console.warn(error);
    if (data) {
        console.log(data);
        var Vis = new SVG_graph(15000, 15000, ".vis");
        var NanoProjects = new Projects(Vis.svg, data);
        console.log(NanoProjects);
    }
});

},{"./Project":2}],2:[function(require,module,exports){
var Render = require('./Render');
var Project = (function () {
    function Project(parent, data) {
        this.name = data.name;
        this.parent = data.parent;
        this.type = data.type;
        this.status = data.status;
        // создаем вершину
        this.svgElement = parent.append("g").attr("class", "project").attr("name", this.name).attr("parent", this.parent).attr("type", this.type).attr("status", this.status).attr("transform", "translate(" + (data.position.cx) + "," + (data.position.cy) + ")");
        // создаем pie
        this.svgShares = new Render.ProjectPieChart(this.svgElement, data.share, data.position.r);
        // создаем кольцо статуса
        this.statusRing = new Render.ProjectStatusRing(this.svgElement, data.position.r, 1.05 * data.position.r, this.status);
        // создаем текстовое поле
        this.textLabel = new Render.ProjectLabel(this.svgElement, data.position.r, data);
    }
    Project.prototype.Hide = function () {
        this.svgElement = this.svgElement.style("visibility", "visible");
    };
    Project.prototype.Show = function () {
        this.svgElement = this.svgElement.style("visibility", "hidden");
    };
    Project.prototype.SetMode = function (labelMode) {
    };
    return Project;
})();
module.exports = Project;

},{"./Render":3}],3:[function(require,module,exports){
// Сюда скидываем функции, которые отвечают за перерисовку графических элементов проекта
// Классы предоставляют только интерфейс и данных о проектах не хранят!
var Sys = require('./Sys');
var ProjectStatusRing = (function () {
    function ProjectStatusRing(parentSvgElement, innerR, outerR, cssClass) {
        this.svgElement = parentSvgElement.append("g").attr("class", "statusRing").append("g").attr("class", "status " + Sys.excludeSpaces(cssClass)).append("path").attr("d", Sys.ringGenerator(innerR, outerR));
    }
    ProjectStatusRing.prototype.SetSize = function (innerR, outerR) {
        this.svgElement.attr("d", Sys.ringGenerator(innerR, outerR));
    };
    return ProjectStatusRing;
})();
exports.ProjectStatusRing = ProjectStatusRing;
var ProjectLabel = (function () {
    function ProjectLabel(parentSvgElement, r, data) {
        this.name = data.name;
        this.money = data.money;
        this.xDim = 1.4 * r;
        this.yDim = 1.4 * r;
        this.svgElement = parentSvgElement.append("g").append('foreignObject').attr('x', -0.5 * this.xDim).attr('y', -0.5 * this.yDim).attr('width', this.xDim).attr('height', this.yDim).append("xhtml:div").style("height", this.xDim + "px").style("text-align", "center").style("font-family", "Ubuntu").style("display", "flex").style("align-items", "center").style("justify-content", "center").append("xhtml:div");
        this.svgElement.append("p").attr("class", "text name").style("font-size", Sys.getFontSize(this.xDim, 3, this.name) + "px").html(this.name);
        this.svgElement.append("p").attr("class", "text money").html(this.money);
    }
    return ProjectLabel;
})();
exports.ProjectLabel = ProjectLabel;
var ProjectPieChart = (function () {
    function ProjectPieChart(parentSvgElement, shares, r) {
        var names = ["UCTT", "TK", "partner", "partner", "partner", "partner", "partner"];
        this.sharesSvgElement = parentSvgElement.append("g").attr("class", "shares").selectAll(".arc").data(Sys.pieGenerator()(shares)).enter().append("g").attr("class", function (d, i) {
            return "shares " + names[i];
        });
        this.sharesSvgElement.append("path").attr("d", Sys.arcGenerator(r));
    }
    return ProjectPieChart;
})();
exports.ProjectPieChart = ProjectPieChart;

},{"./Sys":4}],4:[function(require,module,exports){
///<reference path="./d3.d.ts" />
// Сюда мы пишем просто вспомогательные функции, которые нам не нужны в других местах
function maxWordLength(string) {
    var maxLength = 0;
    var lateIndex = 0;
    for (var i = 0; i < string.length; i++) {
        if (string[i] === " " || (i === (string.length - 1))) {
            if ((i - lateIndex) > maxLength)
                maxLength = i - lateIndex;
            lateIndex = i;
        }
    }
    return maxLength;
}
function getFontSize(stringLength, maxStringNumber, text) {
    var longestWord = maxWordLength(text);
    var textLength = text.length;
    return Math.round(Math.min(((stringLength * maxStringNumber) / textLength), (stringLength / longestWord)));
}
exports.getFontSize = getFontSize;
function excludeSpaces(string) {
    var output = "";
    for (var i = 0; i < string.length; i++) {
        if (string[i] != " " && string[i] != "&")
            output += string[i];
    }
    return output;
}
exports.excludeSpaces = excludeSpaces;
function ringGenerator(innerR, outerR) {
    return d3.svg.arc().outerRadius(outerR).innerRadius(innerR).startAngle(0).endAngle(2 * Math.PI);
}
exports.ringGenerator = ringGenerator;
function arcGenerator(outerR) {
    return d3.svg.arc().outerRadius(outerR).innerRadius(0);
}
exports.arcGenerator = arcGenerator;
function pieGenerator() {
    return d3.layout.pie().sort(null).value(function (d) {
        return d;
    });
}
exports.pieGenerator = pieGenerator;

},{}]},{},[1]);
