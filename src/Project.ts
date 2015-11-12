import Render = require('./Render');
// Сюда складываем классы, редоставляющие методы работы с отдельным проектом

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

export = Project;