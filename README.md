
how to install in python
pip install -r requirements.txt

docker 
    docker run  -p 9000:9000 -p 9009:9009 -p 8812:8812 -p 9003:9003 questdb/questdb:7.3.1


WINDOWS:
    How to install questdd:
    1) downolad the binaries and follow the instructions in:
    https://questdb.io/docs/get-started/binaries/

    unpack the file
    tar -xvf questdb-7.3.1-no-jre-bin.tar.gz

    -- To run the instance as a windows service (preferably as a privileged account):
    questdb.exe install
    questdb.exe start

    ______________________________________________________

