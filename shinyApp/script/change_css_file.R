ChangeCssFile <- function(file, selector=NULL, property=NULL, value=NULL) {
  css_data <- readLines(file)
  start_index <- grep(as.character(selector), css_data)
  as.character(selector)
  slice <- css_data[start_index:length(css_data)]
  property_index <- start_index + grep(as.character(selector),slice)
  css_data[property_index] <- paste0(property,":",value,";")
  write(css_data,file)
}