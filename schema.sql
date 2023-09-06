CREATE TABLE 'ETH_USD_2018' (
  t_stamp timestamp,
  Open DOUBLE,
  High DOUBLE,
  Low DOUBLE,
  Close DOUBLE,
  AdjClose DOUBLE,
  Volume LONG
) timestamp (t_stamp) PARTITION BY DAY WAL;