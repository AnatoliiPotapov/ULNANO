source("./script/position.R")

GetSizeNormal <- function(money) {
  return(sqrt(money))
}

GetSizeView <- function(type, money) {
  output <- c()
  for (i in 1:length(type)) {
    if (type[i] == "ULNANOTECH") output[i] <- 30.0
    else if (type[i] == "ТК") output[i] <- 20.0
    else output[i] <- 10.0
  }
  return(output);
}

Process <- function(data) {
  data$size <- GetSizeNormal(data$MAIN_capex + data$MAIN_opex)
  xdata <- data.frame(
    name = as.character(data$name),
    parent = as.character(data$parent),
    size = as.numeric(data$size))
  
  data$size <- GetSizeView(data$type, data$MAIN_capex + data$MAIN_opex)
  vdata <- data.frame(
    name = as.character(data$name),
    parent = as.character(data$parent),
    size = as.numeric(data$size))

  

  proportional <-  GetPosition(vdata)
  view <- GetPosition(xdata)
  
  # модифицируем capex / opexvie
  position <- matrix(ncol = 6, nrow = 85)
  for (i in 1:dim(data)[1]) {
    position[i,] <- c(unlist(proportional[i,]),unlist(view[i,]))
  }
  data$position <- position
  
  # модифицируем capex / opexvie
  capexopex <- matrix(ncol = 2, nrow = 85)
  for (i in 1:dim(data)[1]) {
    capexopex[i,] <- c(data[i,]$MAIN_capex,
                   data[i,]$MAIN_opex)
  }
  data$capexopex <- capexopex
  
  # модифицируем деньги
  money <- matrix(ncol = 3, nrow = 85)
  for (i in 1:dim(data)[1]) {
    money[i,] <- c(data[i,]$UCTT_capex + data[i,]$UCTT_opex,
                   data[i,]$PARTNER_capex + data[i,]$PARTNER_opex,
                   data[i,]$MULT_capex + data[i,]$MULT_opex)
  }
  data$money <- money
  
  # модифицируем доли
  share <- matrix(ncol = 7, nrow = 85)
  for (i in 1:dim(data)[1]) {
    share[i,] <- c(data[i,]$UCTT_SHARE, 
                    data[i,]$TK_SHARE,
                    data[i,]$partner1_SHARE,
                    data[i,]$partner2_SHARE,
                    data[i,]$partner3_SHARE,
                    data[i,]$partner4_SHARE,
                    data[i,]$partner5_SHARE)
  }
  data$share <- share
  
  
  data$UCTT_SHARE <- NULL
  data$TK_SHARE <- NULL
  data$partner1_SHARE <- NULL
  data$partner2_SHARE <- NULL
  data$partner3_SHARE <- NULL
  data$partner4_SHARE <- NULL
  data$partner5_SHARE <- NULL
  
  return(data)
}