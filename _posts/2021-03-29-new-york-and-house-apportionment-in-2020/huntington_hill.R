library(tidyverse)
library(tidycensus)


#generates hunhill base on sequences

source("apportion_functions.R")

hist_pop <- "data/hist_pop_revised.csv"
population_main <- read_csv(hist_pop)

for (i in seq(1920, 2020, by = 10)) {
  year <- as.character(i)
  population_df <- population_main %>%
    select(stcd, population = !!year)
  
  if (i <= 1950) {
    seats_to_allocate <- 387
  } else {
    seats_to_allocate <- 385
  }
  
  hunt_hill_sequence_df <- init_population_list(population_df)
  
  for (i in 1:seats_to_allocate) {
    hunt_hill_sequence_df <- apportion_and_log(hunt_hill_sequence_df)
  }
  
  hunt_hill_sequence_2 <- hunt_hill_sequence_df
  
  for (i in 1:5) {
    hunt_hill_sequence_2 <- apportion_and_log(hunt_hill_sequence_2)
  }
  
  priority_435 <- hunt_hill_sequence_2$b$priority[435]
  priority_436 <- hunt_hill_sequence_2$b$priority[436]
  
  five_winners <- hunt_hill_sequence_2$b[431:435, ] %>%
    mutate(population_margin = population - priority_436 / multiplier) %>%
    mutate(population_margin_pct = population_margin / population)
  
  five_losers <- hunt_hill_sequence_2$b[436:440, ] %>%
    mutate(population_margin = -(population - priority_435 / multiplier)) %>%
    mutate(population_margin_pct = population_margin / population)
  
  hunt_hill_sequence_df$a <- hunt_hill_sequence_df$a %>%
    mutate(quota = population / sum(population) * 435) %>%
    mutate(seats_minus_quota = seat_counter - quota - 1) %>%
    mutate(quota = population / sum(population) * 435) %>%
    mutate(seats_minus_quota = seat_counter - quota) %>%
    mutate(geom_mean = sqrt(floor(quota) * (floor(quota) + 1)),
           seats_minus_gm = seat_counter - geom_mean)
  
  assign(str_c("hunt_hill_sequence_df_", year),
         hunt_hill_sequence_df)
  assign(str_c("five_winners_", year), five_winners)
  assign(str_c("five_losers_", year), five_losers)
}


# model the observed small state bias
hunt_hill_sequence_result <- bind_rows(
  hunt_hill_sequence_df_1920$a,
  hunt_hill_sequence_df_1930$a,
  hunt_hill_sequence_df_1940$a,
  hunt_hill_sequence_df_1950$a,
  hunt_hill_sequence_df_1960$a,
  hunt_hill_sequence_df_1970$a,
  hunt_hill_sequence_df_1980$a,
  hunt_hill_sequence_df_1990$a,
  hunt_hill_sequence_df_2000$a,
  hunt_hill_sequence_df_2010$a,
  hunt_hill_sequence_df_2020$a
) %>%
  
  filter(as.numeric(year) >= 1940) %>%
  mutate(s_display = ifelse(seat_counter < 6, seat_counter, 7))

hunt_hill_sequence_result %>%
  ggplot(aes(x = log(pop_pct), seats_minus_quota, col = s_display)) +
  geom_point() +
  geom_smooth(method = lm)

model_hhill <-
  lm(seats_minus_quota ~ log(pop_pct), data = hunt_hill_sequence_result)
summary(model_hhill)

#locate different seats_minus_quota values in the distribution; which ones are worse?  Are they worse for big states?

hunt_hill_sequence_result <- hunt_hill_sequence_result %>%
  group_by(stcd) %>%
  mutate(rank = rank(seats_minus_quota)) %>%
  filter(rank == 7) %>%
  ungroup()

hunt_hill_sequence_2_all <- hunt_hill_sequence_result %>%
  group_by(stcd) %>%
  slice_min(seats_minus_quota, n = 1) %>%
  ungroup()
