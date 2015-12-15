library(shiny)
source("./script/main.R")

# дирректории для данных
xlsx_dir = "./data/"
data_dir = "./data/"

# имя для сохранения эксельки
xlsx_name = "projects.xlsx"

AUTH_NEEDED = FALSE
LOGIN = "admin"
PASSWORD = "123456"


shinyServer(function(input, output, session) {
  
  if (AUTH_NEEDED == TRUE) session$sendCustomMessage(type="auth","FALSE")
  
  AUTH <- reactiveValues(Logged = FALSE)
  # Если аунтефикация не нужна то отдаем данные, если они конечно у нас есть
  if (AUTH_NEEDED == FALSE) {
    if ( "json.json" %in% list.files("./")) {
      session$sendCustomMessage(type="jsondata",readLines("./json.json"))    
    }
  }
  
  # если аунтефикация нужна, то сначала проверим
  observeEvent(AUTH$Logged, {
    if (AUTH$Logged == TRUE && AUTH_NEEDED == TRUE) {
      if ( "json.json" %in% list.files("./")) {
        session$sendCustomMessage(type="jsondata",readLines("./json.json"))    
      }
    }
  })

  # Диалог скачивания предыдущего файла с данными о проектах
  output$fileDownload <- renderUI({
    ui <- list()
    ui[[1]] <- downloadButton('downloadData', 'Скачать .xlsx')
    expr <- ui
  })
  
  # Загрузка файла с данными
  output$fileUpload <- renderUI({
    ui <- list()
    ui[[1]] <- fileInput('xlsxFile', 'Choose .xlsx File',
                                  accept=c('.xlsx'))
    expr <- ui
  })
  
  # Обработчик скачивания
  output$downloadData <- downloadHandler(
    filename = function() {
      paste("projects", "xlsx", sep = ".")
    },
    
    content = function(file) {
      file.copy("./script/data/projects.xlsx", file)
    }
  )
  
  # Парсим эксельку с данными
  data <- reactive({
    infile <- input$xlsxFile
    # Если файл еще не загрузили, то используем предыдущий
    if (is.null(infile)) {
      if ("projectsData.R" %in% list.files(data_dir))
        return(dget(paste0(data_dir,"projectsData.R")))
      else return(NULL)
    }
    file.copy(infile$datapath,paste0(xlsx_dir, xlsx_name))
    parsedData <- ParseXLSData(infile$datapath) 
    dput(parsedData,paste0(data_dir,"projectsData.R"))
    return(parsedData)
  })  
  
  # Генерируем конфики с координатами и размерами узлов
  
  # Делаем маленький процессинг 
  observeEvent(input$button, {
    data = CreateJSON(data())
    write(data,"./json.json")
    session$sendCustomMessage(type="jsondata",data)
  })
  
  # Сохраняем цвета в json файл
  observeEvent(input$color, {
    for (i in 1:length(input$color)) {
      ChangeCssFile("./www/style.css",names(input$color)[i],"  fill", input$color[[names(input$color)[i]]])
    }
  })
  
  # Логинимся
  observeEvent(input$auth, {
    AUTH$Logged = FALSE
    login = input$auth$login
    password = input$auth$password
    dput(list(login,password),"login.txt")
    if (login == LOGIN && password == PASSWORD) {
      AUTH$Logged = TRUE
      session$sendCustomMessage(type="auth","TRUE")
    }
  })
  
})
