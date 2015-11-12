library(gdata)
library(dplyr)
library(DiagrammeR)
library(xml2)

# Путь к исполняемому файлу perl
perlPath <- "/usr/bin/perl"

ParseXLSData <- function(xlsPath) {
  # Чтение данных
  readSheet <- function(sheet) read.xls(xls = xlsPath, sheet = sheet, perl = perlPath, encoding = "UTF-8")
  xlsx <- readSheet(1)
  xlsx <- xlsx[4:nrow(xlsx),c(1,2,3,5,6,7,8,17,18,19,20,21,22,23,24,33:39)]
  names(xlsx) <- c("project", "status", "type", "initiator", "partner1", "partner2", "partner3",
                   "UCTT_capex", "UCTT_opex", "PARTNER_capex", "PARTNER_opex",
                   "MULT_capex", "MULT_opex", "MAIN_capex", "MAIN_opex",
                   "UCTT", "TK", "part1", "part2", "part3", "part4", "part5")
  
  # Формирование вершин по категориям (uctt, tks, projects)
  uctt <- as.character(xlsx[1,]$project)
  tks <- unique(as.character(xlsx$initiator))
  tks <- tks[tks != uctt]
  tks <- tks[tks != ""]
  projects <- as.character(xlsx$project)
  projects <- projects[!(projects %in% tks)]
  projects <- projects[!(projects %in%  uctt )]
  
  # Начальное формирование фрейма данных
  df <- data.frame(
    name = as.character(c(uctt, tks, projects)), 
    type = c(uctt, rep("ТК", length(tks)), rep("Проект", length(projects))),
    parent = c("NA", rep(uctt, length(tks)), rep("", length(projects))), 
    stringsAsFactors=FALSE)
  names(df) <- c("name", "type", "parent")
  df$status <- NA
  df$partner1 <- ""
  df$partner2 <- ""
  df$partner3 <- ""
  df$UCTT_capex <- 0.0
  df$UCTT_opex <- 0.0
  df$PARTNER_capex <- 0.0
  df$PARTNER_opex <- 0.0
  df$MULT_capex <- 0.0
  df$MULT_opex <- 0.0
  df$MAIN_capex <- 0.0
  df$MAIN_opex <- 0.0
  df$UCTT_SHARE <- 0.0
  df$TK_SHARE <- 0.0
  df$partner1_SHARE <- 0.0
  df$partner2_SHARE <- 0.0
  df$partner3_SHARE <- 0.0
  df$partner4_SHARE<- 0.0
  df$partner5_SHARE <- 0.0
  
  df[1,]$MAIN_capex <- ifelse(tn(as.character(xlsx[1,]$MAIN_capex)) == "", 0.0, as.numeric(tn(as.character(xlsx[1,]$MAIN_capex))))
  df[1,]$MAIN_opex <- ifelse(tn(as.character(xlsx[1,]$MAIN_opex)) == "", 0.0, as.numeric(tn(as.character(xlsx[1,]$MAIN_opex))))
  df[1,]$UCTT_SHARE <- parsePercent(as.character(xlsx[1,]$UCTT))
  
  # Установка родителей проектов
  for (i in 2:nrow(xlsx)) {
    project <- as.character(xlsx[i,]$project)
    parent <- as.character(xlsx[i,]$initiator)
    status <- as.character(xlsx[i,]$status)
    # Установка типов проектов
    df[df$name == project,]$type <- as.character(gsub(" ","",xlsx[i,]$type))
    # Финансовые данные
    df[df$name == project,]$UCTT_SHARE <- parsePercent(xlsx[i,]$UCTT)
    df[df$name == project,]$TK_SHARE <- parsePercent(xlsx[i,]$TK)
    df[df$name == project,]$partner1_SHARE <- parsePercent(xlsx[i,]$part1)
    df[df$name == project,]$partner2_SHARE <- parsePercent(xlsx[i,]$part2)
    df[df$name == project,]$partner3_SHARE <- parsePercent(xlsx[i,]$part3)
    df[df$name == project,]$partner4_SHARE <- parsePercent(xlsx[i,]$part4)
    df[df$name == project,]$partner5_SHARE <- parsePercent(xlsx[i,]$part5)
    if (!(parent %in% tks) || (project %in% tks))
      parent <- uctt
    df[df$name == project,]$parent <- parent
    df[df$name == project,]$status <- status
    df[df$name == project,]$MAIN_capex <- ifelse(as.character(xlsx[i,]$MAIN_capex) == "", 0.0, as.numeric(tn(as.character(xlsx[i,]$MAIN_capex))))
    df[df$name == project,]$MAIN_opex <- ifelse(as.character(xlsx[i,]$MAIN_opex) == "", 0.0, as.numeric(tn(as.character(xlsx[i,]$MAIN_opex))))
    df[df$name == project,]$UCTT_capex <- ifelse(as.character(xlsx[i,]$UCTT_capex) == "", 0.0, as.numeric(tn(as.character(xlsx[i,]$UCTT_capex))))
    df[df$name == project,]$UCTT_opex <- ifelse(as.character(xlsx[i,]$UCTT_opex) == "", 0.0, as.numeric(tn(as.character(xlsx[i,]$UCTT_opex))))
    df[df$name == project,]$MULT_capex <- ifelse(as.character(xlsx[i,]$MULT_capex) == "", 0.0, as.numeric(tn(as.character(xlsx[i,]$MULT_capex))))
    df[df$name == project,]$MULT_opex <- ifelse(as.character(xlsx[i,]$MULT_opex) == "", 0.0, as.numeric(tn(as.character(xlsx[i,]$MULT_opex))))
    df[df$name == project,]$PARTNER_capex <- ifelse(as.character(xlsx[i,]$PARTNER_capex) == "", 0.0, as.numeric(tn(as.character(xlsx[i,]$PARTNER_capex))))
    df[df$name == project,]$PARTNER_opex <- ifelse(as.character(xlsx[i,]$PARTNER_opex) == "", 0.0, as.numeric(tn(as.character(xlsx[i,]$PARTNER_opex))))
    df[df$name == project,]$partner1 <- as.character(xlsx[i,]$partner1)
    df[df$name == project,]$partner2 <- as.character(xlsx[i,]$partner2)
    df[df$name == project,]$partner3 <- as.character(xlsx[i,]$partner3)
  }
  return(df)
}

# Вспомогательные функции
parsePercent <- function(s) {
  s <- as.character(s)
  s <- substr(s, 1, nchar(s) - 1)
  value <- as.numeric(s)
  if (is.na(value))
    value <- 0
  value
}

transformName <- function(s) {
  gsub("\\\\", "", s)
}

tn <- function(number) {
  gsub(",","",number)
}

