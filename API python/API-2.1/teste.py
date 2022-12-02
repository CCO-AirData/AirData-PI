import requests
import datetime
def reportarAlerta(mac, erro, horario):
    url = "https://api.pipefy.com/graphql"

    payload = {"query": "mutation {createCard(input: {pipe_id: 302843636,title: \"Problema na maquina\",fields_attributes:[{field_id: \"Qual o seu problema?\", field_value: \"" + f"A maquina {mac} apresentou um erro de {erro} às {horario}" + "\"}]}) {card {title}}}"}
    headers = { 
        "accept": "application/json",
        "content-type": "application/json",
        "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VyIjp7ImlkIjozMDIyMTE4NDUsImVtYWlsIjoiMjIyLTFjY28tZ3J1cG84QGJhbmR0ZWMuY29tLmJyIiwiYXBwbGljYXRpb24iOjMwMDIxNjM0N319.jSLkT6f8zxLjfQSM9v033CcMIIOfldcJ9pvqaS8Hwy-XV2T9i7tdf-sB7-ndq-vOp-TtQFbh4BFj5Oy4juZDYQ"
    }
    

    response = requests.post(url, json=payload, headers=headers)

    print(response.text)


data = datetime.datetime.now().strftime("%d/%m/%Y %H:%M:%S")

reportarAlerta("00:00:00:00:00:00", "Erro de conexão", data)