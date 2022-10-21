library(tidyverse) # Core R Tools
library(sf) # Core Spatial Package. Pretty much replaces ArcGIS for most spatial tasks.
sf::sf_use_s2(FALSE)

#install.packages("mapboxapi")
library(mapboxapi)
mb_access_token("pk.eyJ1IjoiaWFucm1jZG9uYWxkIiwiYSI6ImNsOG8zNmR6ejAzczEzb21xcWpkY2p0ZGYifQ.-oA4bt8OIxJOLhjPtEG4nw", install = TRUE)

options(rdeck.mapbox_access_token ="pk.eyJ1IjoiaWFucm1jZG9uYWxkIiwiYSI6ImNsOG8zNmR6ejAzczEzb21xcWpkY2p0ZGYifQ.-oA4bt8OIxJOLhjPtEG4nw")
url <- "https://services1.arcgis.com/Ua5sjt3LWTPigjyD/arcgis/rest/services/Public_School_Location_201819/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson"

data <- read_sf(url) |>
     drop_na(geometry) |>
     st_as_sf(crs = st_crs(4326))

#remotes::install_github("qfes/rdeck@*release")
remotes::install_github("qfes/rdeck")

library(rdeck) # Loads rdeck library 


rdeck(map_style = NULL,
      theme = "light") |>
     add_scatterplot_layer(data = data,
                           name = "Public Schools (SY21-22)",
                           get_position = geometry)


rdeck(map_style = NULL,
      theme = "light") |>
     add_scatterplot_layer(data = data,
                           name = "Public Schools (SY21-22)",
                           get_position = geometry,
                           get_fill_color = "#bf5700",
                           radius_min_pixels = 2,
                           opacity = 0.3)


rdeck(map_style = NULL,
      theme = "light") |>
     add_scatterplot_layer(data = data |> select(Name=NAME, Location = NMCBSA),
                           name = "Public Schools (SY21-22)",
                           get_position = geometry,
                           get_fill_color = "#b57000",
                           radius_min_pixels = 2,
                           opacity = 0.3,
                           tooltip = c(Name, Location),
                           pickable = TRUE)


rdeck(map_style = mapbox_gallery_le_shine(),
      theme = "light") |>
     add_scatterplot_layer(data = data |> select(Name=NAME, Location = NMCBSA),
                           name = "Public Schools (SY21-22)",
                           get_position = geometry,
                           get_fill_color = "#b57000",
                           radius_min_pixels = 2,
                           opacity = 0.3,
                           tooltip = c(Name, Location),
                           pickable = TRUE)


devtools::install_github("hrbrmstr/nominatim")
get_bbox <- function(place) {
     
     df_bbox <- nominatim::bb_lookup(place)
     
     btlr <- df_bbox[1,c("bottom", "top", "left", "right")]
     
     v <- as.numeric(btlr)
     cmat <- matrix(v[c(3, 3, 4, 4, 1, 2, 1, 2)], nrow = 4)
     spobj <- sp::SpatialPoints(coords = cmat)
     sfobj <- sf::st_as_sfc(spobj)
     sf::st_crs(sfobj) <- 4326
     bbox <- sf::st_bbox(sfobj)
     
     bbox
     
}

texas_bbox <- get_bbox("Texas")


rdeck(map_style = mapbox_gallery_minimo(),
      initial_bounds = texas_bbox,
      theme = "light") |>
     add_scatterplot_layer(data = data |> select(Name=NAME, Location = NMCBSA),
                           name = "Public Schools (SY21-22)",
                           get_position = geometry,
                           get_fill_color = "#bf5700",
                           radius_min_pixels = 2,
                           opacity = 0.3,
                           tooltip = c(Name, Location),
                           pickable = TRUE
     )
