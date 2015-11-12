require(DiagrammeR)

CreateDiagrammeRGraph <- function(data) {
  # Create a nodes
  nodes <-
    create_nodes(nodes = data$name,
                 height = data$size,
                 width = data$size,
                 type = "lower",
                 fixedsize=TRUE,
                 shape = "circle"
    )
  
  edges <-
    create_edges(from = data$name,
                 to = data$parent,
                 relationship = "leading_to",
                 penwidth = 2)
  
  
  # Инициализируем граф
  graph <- create_graph(nodes_df = nodes, edges_df = edges, graph_attrs = "layout = circo")
  return(graph)
}