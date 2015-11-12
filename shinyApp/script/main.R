# Potapov Anatoly 2015

source("./script/parse.R")
source("./script/create_diagrammer_graph.R")
source("./script/position.R")
source("./script/process.R")
source("./script/to_json.R")
source("./script/change_css_file.R")

CreateJSON <- function(parsed_data, output_file_path = "NA") {
  processed_data <- Process(parsed_data)
  json_data <- ToJson(processed_data)
  if (output_file_path == "NA") return(json_data)
  write(json_data, file = output_file_path)
}