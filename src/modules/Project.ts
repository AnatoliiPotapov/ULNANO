import Render = require('./Render');
import Sys = require('./Sys');

// Сюда складываем классы, редоставляющие методы работы с отдельным проектом


// определяем свойства и методы узла - проекта Наноцентра
interface ProjectTemplate {
    name: string;
    parent: string;
    type:string;
    status:string;
}

class Project implements ProjectTemplate {
    // основные данные
    name: string;
    parent: string;
    type:string;
    status:string;

    // Текущие координаты ноды
    currentPosition;

    // данные, которые приходят при инициализации
    private data;

    // ссылка на d3 представление
    svgElement;
    // ссылка на кольцо статуса
    statusRing;
    // ссылка на текстовую информацию
    textLabel;
    // ссылка на доли
    svgShares;

    constructor(parent, data){

        // инициализируем данные
        this.data = data;

        this.name = data.name;
        this.parent = data.parent;
        this.type = Sys.excludeSpaces(data.type);
        this.status = Sys.excludeSpaces(data.status);

        this.currentPosition = {"cx":data.position[0],"cy":data.position[1],"r":data.position[2]};

        // создаем вершину
        this.svgElement = parent
            .append("g")
            .attr("class", "project")
            .attr("name", this.name)
            .attr("parent", this.parent)
            .attr("type", this.type)
            .attr("status", this.status)
            .attr("transform", "translate(" + (this.currentPosition.cx) + "," + (this.currentPosition.cy) + ")");

        // создаем pie
        this.svgShares = new Render.ProjectPieChart(
            this.svgElement,
            data.share,
            Sys.SHARES_NAMES.share,
            this.currentPosition.r
        );

        // создаем кольцо статуса
        this.statusRing = new Render.ProjectStatusRing(
            this.svgElement,
            this.currentPosition.r,
            1.05 * this.currentPosition.r,
            this.status)
        ;

        // создаем текстовое поле
        this.textLabel = new Render.ProjectLabel(
            this.svgElement,
            this.currentPosition.r,
            data
        );

        var this_name = this.name;
    }

    private GetPersentFromMode(sharesMode) {
        var persent:any;
        if (sharesMode === "Доли") {
            persent = (this.data.share[0] + this.data.share[1]) / (this.data.share.reduce(function(a, b){return a+b;}));
        }
        if (sharesMode === "Деньги") {
            persent = (this.data.money[0]) / (this.data.money.reduce(function(a, b){return a+b;}));
        }
        if (sharesMode === "CapexOpex") {
            persent = (this.data.capexopex[0]) / (this.data.capexopex.reduce(function(a, b){return a+b;}));
        }
        console.log(persent);
        if ((persent == 0) || (isNaN(persent)) ) persent = "";
        else persent = (persent*100.0).toFixed(2).toString() + "%";
        return persent;
    }
    private GetSharesFromMode(sharesMode) {
        var output = {names:[],data:[]};

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
    }
    private SetRadiusFromMode(positionMode) {
        if (positionMode === 1) { this.currentPosition = {
            "r":this.data.position[2]};
        }
        if (positionMode === 2) { this.currentPosition = {
            "r":this.data.position[5]};
        }

    }
    Hide() {
        this.svgElement = this.svgElement.style("visibility", "hidden");
    }
    Show() {
        this.svgElement = this.svgElement.style("visibility", "visible");
    }
    Remove() {
        this.svgElement = this.svgElement
            .remove();
    }
    SetMode(textMode, sharesMode) {
        // обновляем текст
        var text = new Array;
        text.push(this.name);
        if (  textMode.indexOf("Сумма") >= 0 ) {
            var moneyAmount = this.data.money.reduce(function(a, b){return a+b;});
            if (moneyAmount == 0) text.push(" --- ");
            else text.push(this.data.money.reduce(function(a, b){return a+b;}).toFixed(2).toString())
        };
        if (  textMode.indexOf("Процент") >= 0) { text.push(this.GetPersentFromMode(sharesMode))};
        this.textLabel.SetText(text);
        // обновляем доли
        var newShares = this.GetSharesFromMode(sharesMode);
        this.svgShares.SetProperty(newShares.data, newShares.names);
    }
    UpdateLayout(Mode) {

        // обновляем радиус ноды
        this.SetRadiusFromMode(Mode);

        // обновляем радиусы элементов
        this.statusRing.SetRadius(this.currentPosition.r, this.currentPosition.r * 1.05);
        this.svgShares.SetRadius(this.currentPosition.r);
        this.textLabel.SetRadius(this.currentPosition.r);

    }
    // Update position according to Layout
    UpdatePosition(cx,cy) {
      this.svgElement
          .transition()
          .attr("transform", "translate(" + (cx) + "," + (cy) + ")");
    }
}

export = Project;
