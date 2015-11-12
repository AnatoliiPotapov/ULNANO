require(rjson)

ToJson <- function(data) {
  dataset <- list()
  for ( i in 1:nrow(data)) {
    dataset[[i]] <- data[i,]
  }
  json <- toJSON(dataset)
  json
}