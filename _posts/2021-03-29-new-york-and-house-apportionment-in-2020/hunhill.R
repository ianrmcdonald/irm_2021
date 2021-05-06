library(tidyverse)


#Generates hunhill based on basic algorithm

source("apportion_functions.R")

hist_pop <- "data/hist_pop_revised.csv"
population_main <- read_csv(hist_pop) 

for (i in seq(1940, 2020, by=10)) {
  
  year <- as.character(i)  
  
  hunhill_df <- population_main %>% select(stcd, population = all_of(year))
  
  if(i <= 1950) {
    hunhill_df <- hunhill_df %>% 
      filter(!stcd %in% c("AK", "HI"))
  }
  
  #need to fix the popsum function parameter in webster and webster_calc
  
  popsum_input <- sum(hunhill_df$population)
  
  hunhill_df1 <- hunhill(hunhill_df) %>% mutate(year = year)
  
  #this isn't good
  if (i == 1940) {
    hunhill_result <- hunhill_df1
  } else {
    hunhill_result <- bind_rows(hunhill_result, hunhill_df1)
  }
  
}
 


