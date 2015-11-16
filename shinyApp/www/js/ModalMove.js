$(function(){

    // перемещение окон
    $("#myModal").draggable({
        handle: ".modal-header"
    });

    $("#colorModal").draggable({
        handle: ".modal-header"
    });

    $("#show-selection").click(function() {

        // выбираем все статусы
        var selection = $("input:checkbox:checked.selector-status");
        var statuses = new Array;
        var iterator = 0;
        for (var i=0; i < selection.length; i++) {
            var buf = $(selection[i]).attr("data").split(" ");
            for (var index=0; index < buf.length; index++) {
                statuses[iterator] = buf[index]
                iterator++
            }
        }

        // выбираем все выбранные чекбоксы с типами проектов
        var selection = $("input:checkbox:checked.selector-type");
        var types = new Array();
        for (var i=0; i < selection.length; i++) {
            types[i] = $(selection[i]).attr("data")
        }

        // выбираем все типы текстовой информации, которую нужно выводить
        var selection = $("input:checkbox:checked.selector-text");
        var textMode = new Array();
        for (var i=0; i < selection.length; i++) {
            textMode[i] = $(selection[i]).attr("data")
        }

        // выбираем виды долей
        var selection = $("input:radio:checked.shares-mode");
        var sharesMode = new Array();
        for (var i=0; i < selection.length; i++) {
            sharesMode[i] = $(selection[i]).attr("value")
        }

        console.log(types);
        console.log(statuses);
        console.log(textMode);
        console.log(sharesMode);
        ProjectManager.ChangeState(types, statuses, textMode, sharesMode[0]);

    });

}());