from questdb.ingress import Sender, IngressError, TimestampNanos
from datetime import datetime, timezone
import sys
import requests
import csv
import os
from datetime import datetime

def insert_data(data, table_name):
    try:
        with Sender('localhost', 9009) as sender:
            i = 0
            for row in data_to_insert:
                datetime_obj = datetime.strptime(row['Date'], "%Y-%m-%dT%H:%M:%S.%fZ")
                tstamp = int(datetime_obj.timestamp() ) * 1000000000
                sender.row(
                    table_name,
                    columns={
                        't_stamp': tstamp,
                        'Open': float(row['Open']),
                        'High': float(row['High']),
                        'Low': float(row['Low']),
                        'Close': float(row['Close']),
                        'AdjClose': float(row['AdjClose']),
                        'Volume': int(row['Volume'])
                    }
                )
            sender.flush()
    except (IngressError, IngestError) as e:
        sys.stderr.write(f'Got error: {e}\n')

if __name__ == '__main__':
    questdb_url = "http://127.0.0.1:9000/imp"
    table_name = "ETH_USD_2018"
    csv_file = os.path.join("data", "ETH_USD_upd.csv")
    #print(csv_file)
    #create_database(questdb_url)
    # Read the CSV file and convert it into a list of dictionaries
    with open(csv_file, 'r') as file:
        csv_reader = csv.DictReader(file)
        data_to_insert = list(csv_reader)
    #print(data_to_insert)
    insert_data(data_to_insert, table_name)

