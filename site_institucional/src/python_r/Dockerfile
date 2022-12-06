FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends build-essential python3.6 python3-pip python3-setuptools python3-dev

RUN echo "deb http://lib.stat.cmu.edu/R/CRAN/bin/linux/ubuntu precise/" > /etc/apt/sources.list.d/sources.list

RUN apt-get update && apt-get install r-base && apt-get install r-cran-randomforest

RUN apt install libcurl4-openssl-dev && apt-get install libxml2-dev

WORKDIR /app

COPY bibliotecas.txt /app/bibliotecas.txt

RUN pip3 install -r bibliotecas.txt

RUN Rscript -e "install.packages('data.table')"

COPY . /app
