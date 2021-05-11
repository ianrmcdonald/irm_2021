#functions for use in the apportioment scripts



pull_maximum_priority <- function(df) {
  maxvalue <- df %>% 
    top_n(1, priority)
}


apportion_update <- function(df) {
  maximum_value <- pull_maximum_priority(df) %>% 
    mutate(seat_counter = seat_counter + 1,
           multiplier = 1/sqrt(seat_counter * (seat_counter + 1)),
           priority = population * multiplier)
  df <- df %>% rows_update(tibble(maximum_value), by = "stcd")
  return(df)
}

init_population_list <- function(population_df)  {
  population_df <- population_df %>%
    filter(stcd != "DC" & population > 0) %>% 
    mutate(seat_counter = 1,
           multiplier = 1/sqrt(2),
           priority = population * multiplier,
           pop_pct = population / sum(population) * 100,
           year = year,
           app = "hunhill_seq"
    )
  c_log <- population_df
  return(list(a = population_df, b = c_log))
}

apportion_and_log <- function(p_list){
  p_list$b <- rbind(p_list$b, pull_maximum_priority(p_list$a))
  p_list$a <- apportion_update(p_list$a)
  return(list(a = p_list$a, b = p_list$b))
}

webster_calc <- function(df, popsum = popsum_input, SEATS = 435) {
  
  
  df1 <- df %>%
    mutate(quota = population/popsum * SEATS,
           #geom_mean = sqrt(floor(quota)*(floor(quota)+1)),
           residual = quota - floor(quota))
  
  df1 <- df1 %>%  
    mutate(seat_counter = case_when(
      quota <= .5 ~ 1,
      residual >= .5 ~ floor(quota) + 1,
      residual < .5 ~ floor(quota)
    )
    )
  df1 <- df1 %>% mutate(app = "hun_hill_seq", year = year)
  return(df1)
}

webster <- function(df, ADJUST = TRUE, TEST_CHANGE = 0) {
  
  popsum_input <- sum(df$population)
  df1 <- webster_calc(df, popsum = popsum_input, SEATS = 435) 
  seat_sum <- sum(df1$seat_counter)
  #print(str_c(year,":",seat_sum))

  if(ADJUST) {
    popsum_adj <- popsum_input
    oseats <<- df1
    while(seat_sum < 435) {
      popsum_adj <- popsum_adj - 1000
      df1 <- webster_calc(df1, popsum = popsum_adj)
      seat_sum <- sum(df1$seat_counter)
    }
    
    while(seat_sum > 435) {
      popsum_adj <- popsum_adj + 1000
      df1 <- webster_calc(df1, popsum = popsum_adj)
      seat_sum <- sum(df1$seat_counter)
    }
  }
  df1 <- df1 %>% 
    mutate(quota = population / sum(population) * 435,
           seats_minus_quota = seat_counter - quota,
           pop_pct = population / sum(population) * 100) %>% 
    select(stcd, quota, seats_minus_quota, seat_counter, pop_pct) %>% 
    mutate(app = "webster", year = year)
  return(df1)
}    

hunhill_calc <- function(df, popsum = popsum, SEATS = 435) {
  df <- df %>%
    mutate(quota = population/popsum * SEATS,
           geom_mean = sqrt(floor(quota)*(floor(quota)+1)),
           residual = quota - floor(quota),
           seat_counter = case_when(
             quota >= geom_mean ~ floor(quota) + 1,
             quota < geom_mean ~ floor(quota)
           )
    )
  
  return(df)
}

hunhill <- function(df, ADJUST = TRUE, TEST_CHANGE = 0) {
  popsum_input <- sum(df$population)
  df1 <- hunhill_calc(df, popsum = popsum_input, SEATS = 435) 
  seat_sum <- sum(df1$seat_counter)
  
  if(ADJUST) {  
    popsum_adj <- popsum_input
    while(seat_sum < 435){
      popsum_adj <- popsum_adj - 1000
      df1 <- hunhill_calc(df1, popsum = popsum_adj)
      seat_sum <- sum(df1$seat_counter)
    }
    
    while(seat_sum > 435){
      popsum_adj <- popsum_adj + 1000
      df1 <- hunhill_calc(df1, popsum = popsum_adj)
      seat_sum <- sum(df1$seat_counter)
    }
  }
  df1 <- df1 %>% select(stcd, seat_counter, quota) %>% 
    mutate(app = "hunhill")
  
  return(df1)
}    
