import requests
#pip install requests

def jiraSlack():
    url = "https://xxxxx.atlassian.net/rest/api/2/issue"
    token = 'PPV2MdZKDPL7jtdFuJwL7F63'
    responseJira = requests.post(url, json={
        "fields": {
        "project":
        {
            "id": "10000"
        },
        "summary": "Teste","description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum","issuetype": {"name": "bug","id": "10001" }}
},  auth=('gustavo.antonio@sptech.school',token)) 
    json = responseJira.json()["key"]
    texto = "https://xxxxx.atlassian.net/jira/servicedesk/projects/AD/queues/custom/16/"+json
    url = "https://hooks.slack.com/services/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"
    responseSlack = requests.post(url, json={"text":str(texto)})  

