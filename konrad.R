#https://www.r-bloggers.com/2021/03/simplifying-geospatial-features-in-r-with-sf-and-rmapshaper/

library(ggplot2)
library(magrittr)
library(sf)


mv <- st_read('data/mv.geojson') %>%
     st_geometry() %>%
     st_transform(crs = '+proj=aeqd +lat_0=53.6 +lon_0=12.7')
# centered at input data for low distortion