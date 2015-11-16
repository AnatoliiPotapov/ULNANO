$(function() {

    // Показываем окно логина
    Shiny.addCustomMessageHandler("auth", function (message) {
        if (message == "TRUE") {
            $("#login-overlay").modal("hide");
        }
        if (message == "FALSE") {
            $("#login-overlay").modal({backdrop: "static"});
        }
    });

    // Если нажата кнопка залогиниться, то посылаем на сервер привет
    $("#auth-btn").click(function(){
        var data = new Object();
        data.login = $("#login-input").val();
        data.password = $("#password-input").val();
        Shiny.onInputChange("auth", data);
    })

}());