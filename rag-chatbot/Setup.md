create the qdrant cloud cluster

get the cluster name and cluster end point and the qdrant api key

run the ingest.py to make the vectordatabase

for the add these dependencies: unstructed[md] , llama-parse

check the groq api is not yet expired
get a new api key and paste it in the env variables


------ steps to regenerate sshkey github

ssh-keygen -t rsa -b 4096 -C "<your_email@example.com>"

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa

cat ~/.ssh/id_rsa.pub
Paste it into GitHub under Settings > SSH and GPG keys > New SSH key

ssh -T <git@github.com>

then push your code
