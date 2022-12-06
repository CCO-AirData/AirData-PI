FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends build-essential r-base r-cran-randomforest python3.6 python3-pip python3-setuptools python3-dev

WORKDIR /app

COPY bibliotecas.txt /app/bibliotecas.txt

RUN pip3 install -r bibliotecas.txt

RUN Rscript -e "install.packages('data.table')"

COPY . /app
