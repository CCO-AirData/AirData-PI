FROM python:3

ADD etl.py /

COPY bibliotecas.txt ./

RUN pip install --no-cache-dir -r bibliotecas.txt

CMD [ "python", "./etl.py" ]