FROM python:3

ADD main.py /

COPY bibliotecas.txt ./

RUN pip install --no-cache-dir -r bibliotecas.txt

CMD [ "python", "./main.py" ]