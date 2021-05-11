library(tidyverse)


post_dir <- ("_posts/2021-05-10-new-york-and-house-apportionment-in-2020_update/")

source(str_c(post_dir, "apportion_functions.R"))

hist_pop <- str_c(post_dir, "data/hist_pop_revised.csv")
population_main <- read_csv(hist_pop) 

for (i in seq(1920, 2020, by=10)) {
  
  year <- as.character(i)  
  
  webster_df <- population_main %>% select(stcd, population = all_of(year))
  
  if(i <= 1950) {
    webster_df <- webster_df %>% 
      filter(!stcd %in% c("AK", "HI"))
  }
  
  #need to fix the popsum function parameter in webster and webster_calc
  
  popsum_input <- sum(webster_df$population)
  
  webster_df1 <- webster(webster_df)
  
  #this isnt' good
  if (i == 1920) {
    webster_result <- webster_df1
  } else {
    webster_result <- bind_rows(webster_result, webster_df1)
  }
  
}
 
webster_result <- webster_result %>% 
  mutate(s_display = ifelse(seats_to_allocate < 6, seats_to_allocate, 7),
         tiny = ifelse(quota < .5, TRUE, FALSE)) %>% 
  filter(as.numeric(year) >= 1940)

webster_result %>% 
  ggplot(aes(x = log(pop_pct), seats_minus_quota, col=s_display)) + 
  geom_point() +
  geom_smooth(method = lm)

model_webster <- lm(seats_minus_quota ~ log(pop_pct), data = webster_result)
summary(model_webster)


