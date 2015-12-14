(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
///<reference path="./definitions/d3.d.ts" />
var Projects = require('./modules/ProjectArray');
var SVG_graph = (function () {
    function SVG_graph(width, height, parentTag) {
        this.preSvg = d3.select(parentTag).append("div").classed("svg-yNamecontainer", true).append("svg").attr("preserveAspectRatio", "xMaxYMin slice").attr("viewBox", "0 0 " + width + " " + height).classed("svg-content-responsive", true).append("g").call(d3.behavior.zoom().scaleExtent([0.01, 20]).on("zoom", this.zoom.bind(this))).append("g");
        this.svg = this.preSvg.append("g").attr("class", "Bastard");
        /*.append("g")
            .attr("class", "scaleG")
        .append("g")
            .attr("class", "translateG");*/
    }
    SVG_graph.prototype.zoom = function () {
        /*this.svg.select(".scaleG")
            .attr("transform", "scale(" + (<any> d3.event).scale + ")");
        this.svg.select(".translateG")
            .attr("transform", "translate(" + (<any> d3.event).translate + ")");*/
        this.preSvg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    };
    return SVG_graph;
})();
function Init(data) {
    var Vis = new SVG_graph(15000, 15000, ".vis");
    console.log(Vis);
    var NanoProjects = new Projects(Vis.svg, data);
    return NanoProjects;
}
window.Init = Init;
var ProjectManager = (function () {
    function ProjectManager(projects) {
        this.projects = projects;
        this.projects.nodes.forEach(function (node) {
            node.svgElement.on("dblclick", function (d) {
                alert(node.currentPosition.cx);
                projects.parentSvgElement.transition().attr("transform", "translate(" + (-node.currentPosition.cx + 7500.0) + "," + (-node.currentPosition.cy + 1500) + ")");
            });
        });
    }
    ProjectManager.prototype.ChangeState = function (types, statuses, text, sharesMode) {
        var projects = this.projects;
        var currentSelection = projects.Filter(types, statuses);
        projects.nodes.forEach(function (entry) {
            entry.Hide();
        });
        currentSelection.forEach(function (entry) {
            //console.log(entry);
            var entryWithParents = projects.FindWithParentsByName(entry.name);
            entryWithParents.forEach(function (node) {
                node.Show();
                node.SetMode(text, sharesMode);
            });
        });
    };
    ProjectManager.prototype.UpdateLayout = function (Mode) {
        this.projects.nodes.forEach(function (entry) {
            entry.UpdateLayout(Mode);
        });
        var mainNode = this.projects.FindByName("ULNANOTECH").currentPosition;
        this.projects.parentSvgElement.transition().attr("transform", "translate(" + (-mainNode.cx + 7500.0) + "," + (-mainNode.cy + 1500) + ")");
    };
    return ProjectManager;
})();
window.ProjectManager = ProjectManager;

},{"./modules/ProjectArray":3}],2:[function(require,module,exports){
var Render = require('./Render');
var Sys = require('./Sys');
var Project = (function () {
    function Project(parent, data) {
        // инициализируем данные
        this.data = data;
        this.name = data.name;
        this.parent = data.parent;
        this.type = Sys.excludeSpaces(data.type);
        this.status = Sys.excludeSpaces(data.status);
        this.currentPosition = { "cx": data.position[0], "cy": data.position[1], "r": data.position[2] };
        // создаем вершину
        this.svgElement = parent.append("g").attr("class", "project").attr("name", this.name).attr("parent", this.parent).attr("type", this.type).attr("status", this.status).attr("transform", "translate(" + (this.currentPosition.cx) + "," + (this.currentPosition.cy) + ")");
        // создаем pie
        this.svgShares = new Render.ProjectPieChart(this.svgElement, data.share, Sys.SHARES_NAMES.share, this.currentPosition.r);
        // создаем кольцо статуса
        this.statusRing = new Render.ProjectStatusRing(this.svgElement, this.currentPosition.r, 1.05 * this.currentPosition.r, this.status);
        // создаем текстовое поле
        this.textLabel = new Render.ProjectLabel(this.svgElement, this.currentPosition.r, data);
        var this_name = this.name;
        /*this.svgElement
            .on("dblclick", function(d) {
                    alert(this_name);
            });*/
    }
    Project.prototype.GetPersentFromMode = function (sharesMode) {
        var persent;
        if (sharesMode === "Доли") {
            persent = (this.data.share[0] + this.data.share[1]) / (this.data.share.reduce(function (a, b) {
                return a + b;
            }));
        }
        if (sharesMode === "Деньги") {
            persent = (this.data.money[0]) / (this.data.money.reduce(function (a, b) {
                return a + b;
            }));
        }
        if (sharesMode === "CapexOpex") {
            persent = (this.data.capexopex[0]) / (this.data.capexopex.reduce(function (a, b) {
                return a + b;
            }));
        }
        console.log(persent);
        if ((persent == 0) || (isNaN(persent)))
            persent = "";
        else
            persent = (persent * 100.0).toFixed(2).toString() + "%";
        return persent;
    };
    Project.prototype.GetSharesFromMode = function (sharesMode) {
        var output = { names: [], data: [] };
        if (sharesMode === "Доли") {
            output.names = Sys.SHARES_NAMES.share;
            output.data = this.data.share;
        }
        if (sharesMode === "Деньги") {
            output.names = Sys.SHARES_NAMES.money;
            output.data = this.data.money;
        }
        if (sharesMode === "CapexOpex") {
            output.names = Sys.SHARES_NAMES.capexopex;
            output.data = this.data.capexopex;
        }
        if (sharesMode === "ТипыПроектов") {
            output.names = ["type " + this.type];
            output.data = [1];
        }
        return output;
    };
    Project.prototype.SetCurrentPositionFromMode = function (positionMode) {
        if (positionMode === 1) {
            this.currentPosition = {
                "cx": this.data.position[0],
                "cy": this.data.position[1],
                "r": this.data.position[2]
            };
        }
        if (positionMode === 2) {
            this.currentPosition = {
                "cx": this.data.position[3],
                "cy": this.data.position[4],
                "r": this.data.position[5]
            };
        }
    };
    Project.prototype.Hide = function () {
        this.svgElement = this.svgElement.style("visibility", "hidden");
    };
    Project.prototype.Show = function () {
        this.svgElement = this.svgElement.style("visibility", "visible");
    };
    Project.prototype.Remove = function () {
        this.svgElement = this.svgElement.remove();
    };
    Project.prototype.SetMode = function (textMode, sharesMode) {
        // обновляем текст
        var text = new Array;
        text.push(this.name);
        if (textMode.indexOf("Сумма") >= 0) {
            var moneyAmount = this.data.money.reduce(function (a, b) {
                return a + b;
            });
            if (moneyAmount == 0)
                text.push(" --- ");
            else
                text.push(this.data.money.reduce(function (a, b) {
                    return a + b;
                }).toFixed(2).toString());
        }
        ;
        if (textMode.indexOf("Процент") >= 0) {
            text.push(this.GetPersentFromMode(sharesMode));
        }
        ;
        this.textLabel.SetText(text);
        // обновляем доли
        var newShares = this.GetSharesFromMode(sharesMode);
        this.svgShares.SetProperty(newShares.data, newShares.names);
    };
    Project.prototype.UpdateLayout = function (Mode) {
        // обновляем координату ноды
        this.SetCurrentPositionFromMode(Mode);
        this.svgElement.transition().attr("transform", "translate(" + (this.currentPosition.cx) + "," + (this.currentPosition.cy) + ")");
        // обновляем радиусы
        this.statusRing.SetRadius(this.currentPosition.r, this.currentPosition.r * 1.05);
        this.svgShares.SetRadius(this.currentPosition.r);
        this.textLabel.SetRadius(this.currentPosition.r);
    };
    return Project;
})();
module.exports = Project;

},{"./Render":4,"./Sys":5}],3:[function(require,module,exports){
var Project = require('./Project');
var Projects = (function () {
    function Projects(parentSvgElement, data) {
        this.nodes = [];
        this.parentSvgElement = parentSvgElement;
        for (var i = 0; i < data.length; i++) {
            var newProject = new Project(parentSvgElement, data[i]);
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
    Projects.prototype.FindWithChildrensByName = function (name) {
    };
    Projects.prototype.FindWithParentsByName = function (name) {
        var output = [];
        var currentProject = this.FindByName(name);
        do {
            output.push(currentProject);
            currentProject = this.FindByName(currentProject.parent);
        } while (currentProject != undefined);
        return output;
    };
    Projects.prototype.Filter = function (types, statuses) {
        var output = [];
        for (var i = 0; i < this.nodes.length; i++) {
            if ((types.indexOf(this.nodes[i].type) >= 0) && (statuses.indexOf(this.nodes[i].status) >= 0)) {
                output.push(this.nodes[i]);
            }
        }
        console.log(output);
        return output;
    };
    return Projects;
})();
module.exports = Projects;

},{"./Project":2}],4:[function(require,module,exports){
// Сюда скидываем функции, которые отвечают за перерисовку графических элементов проекта
// Классы предоставляют только интерфейс и данных о проектах не хранят!
var Sys = require('./Sys');
var ProjectStatusRing = (function () {
    function ProjectStatusRing(parentSvgElement, innerR, outerR, cssClass) {
        this.svgElement = parentSvgElement.append("g").attr("class", "statusRing").append("g").attr("class", "status " + Sys.excludeSpaces(cssClass)).append("path").attr("d", Sys.ringGenerator(innerR, outerR));
    }
    ProjectStatusRing.prototype.SetRadius = function (innerR, outerR) {
        this.svgElement.transition().attr("d", Sys.ringGenerator(innerR, outerR));
    };
    ProjectStatusRing.prototype.Remove = function () {
        this.svgElement = this.svgElement.remove();
    };
    return ProjectStatusRing;
})();
exports.ProjectStatusRing = ProjectStatusRing;
var ProjectLabel = (function () {
    function ProjectLabel(parentSvgElement, r, data) {
        this.xDim = 1.4 * r;
        this.yDim = 1.4 * r;
        this.foreignObject = parentSvgElement.append("g").append('foreignObject');
        this.outerDiv = this.foreignObject.append("xhtml:div");
        this.innerDiv = this.outerDiv.style("text-align", "center").style("font-family", "Ubuntu").style("display", "flex").style("align-items", "center").style("justify-content", "center").append("xhtml:div");
        this.text = [data.name];
        this.SetRadius(r);
    }
    ProjectLabel.prototype.SetRadius = function (r) {
        this.xDim = 1.4 * r;
        this.yDim = 1.4 * r;
        this.foreignObject.transition().attr('x', -0.5 * this.xDim).attr('y', -0.5 * this.yDim).attr('width', this.xDim).attr('height', this.yDim);
        this.outerDiv.transition().style("height", this.xDim + "px");
        this.SetText(this.text);
    };
    ProjectLabel.prototype.Remove = function () {
        this.foreignObject = this.foreignObject.remove();
    };
    ProjectLabel.prototype.SetText = function (text) {
        var xDim = this.xDim;
        var svgElement = this.innerDiv;
        svgElement.selectAll("p").remove();
        text.forEach(function (sentence) {
            svgElement.append("p").style("margin", "0px").attr("class", "text name").style("font-size", Sys.getFontSize(xDim, 3, sentence) + "px").html(sentence);
        });
    };
    return ProjectLabel;
})();
exports.ProjectLabel = ProjectLabel;
var ProjectPieChart = (function () {
    function ProjectPieChart(parentSvgElement, shares, names, r) {
        this.r = r;
        this.shares = shares;
        this.names = names;
        this.svgElement = parentSvgElement.append("g").attr("class", "shares");
        this.svgElement.selectAll(".arc").data(Sys.pieGenerator()(shares)).enter().append("g").attr("class", function (d, i) {
            return names[i];
        }).append("path").attr("d", Sys.arcGenerator(r));
    }
    ProjectPieChart.prototype.Remove = function () {
        this.svgElement = this.svgElement.remove();
    };
    ProjectPieChart.prototype.SetProperty = function (shares, names) {
        this.shares = shares;
        this.names = names;
        var svgElement = this.svgElement;
        console.log(svgElement);
        console.log("Hooray!!!\n", shares, names);
        svgElement.selectAll("g").remove();
        svgElement.selectAll(".arc").data(Sys.pieGenerator()(shares)).enter().append("g").attr("class", function (d, i) {
            return names[i];
        }).append("path").attr("d", Sys.arcGenerator(this.r));
    };
    ProjectPieChart.prototype.SetRadius = function (r) {
        this.r = r;
        var svgElement = this.svgElement;
        var names = this.names;
        svgElement.selectAll("path").transition().attr("d", Sys.arcGenerator(r));
    };
    return ProjectPieChart;
})();
exports.ProjectPieChart = ProjectPieChart;

},{"./Sys":5}],5:[function(require,module,exports){
///<reference path="./../definitions/d3.d.ts" />
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
exports.SHARES_NAMES = {
    share: ["UCTT share", "TK share", "partner share", "partner share", "partner share", "partner share", "partner share"],
    money: ["UCTT money", "TK money", "MULT money"],
    capexopex: ["CAPEX capexopex", "OPEX capexopex"]
};

},{}]},{},[1]);
