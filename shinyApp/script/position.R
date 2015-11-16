require(XML)
require(htmltools)
source("./script/create_diagrammer_graph.R")

GetPosition <- function(data) {
  gr_dot <- CreateDiagrammeRGraph(data)
  dot <- render_graph(gr_dot, output = "DOT", width = 15000, height = 15000)
  gr_svg <- exportSVG(DiagrammeR::grViz(dot, engine = "circo", width = 15000, height = 15000))
  #write(HTML(gr_svg),"./svg.svg")
  doc <- xmlTreeParse(gr_svg)
  r <- xmlRoot(doc)
  
  position <- as.list(1:dim(data)[1])
  names(position) <- data$name
  
  for (i in 1:xmlSize(r[[1]])) {
    if (xmlName(r[[1]][[i]]) == "g" && xmlAttrs(r[[1]][[i]])['class'] == "node") {
      # print(position[[xmlValue(xmlChildren(r[[1]][[i]][[1]])$text)]])
      if (xmlValue(xmlChildren(r[[1]][[i]][[1]])$text) %in% names(position)) {
        position[[xmlValue(xmlChildren(r[[1]][[i]][[1]])$text)]] <- xmlAttrs(r[[1]][[i]][[2]])
      }
    }
  }
  position <- unname(position, force = TRUE)
  cx <- c()
  cy <- c()
  r <- c()
  for (i in 1:length(position)) {
    cx[i] <- position[[i]]['cx']
    cy[i] <- position[[i]]['cy']
    r[i] <- position[[i]]['rx']
  }
  position <- data.frame(
    cx = abs(as.numeric(cx)),
    cy = abs(as.numeric(cy)),
    r = abs(as.numeric(r))
  )
  return(position)
}