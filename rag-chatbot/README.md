
# llama-index

# RAG-chat-with-documents
Chainlit app for advanced RAG. Uses llamaparse, langchain, qdrant and models from groq.



### Links 
- [LlamaCloud](https://cloud.llamaindex.ai/)
- [Qdrant Cloud](https://cloud.qdrant.io/)
- [Groq Cloud](https://console.groq.com/)

### create virtualenv
```
python -m venv .venv
```
```
.venv/Scritps/activate
```

### Install packages
```
pip install -r requirements.txt
```

### Environment variables
All env variables goes to .env ( cp `.env.sample` to `.env` and paste required env variables)

### Run the python files (following the video to run step by step is recommended)
```
py ingest.py
chainlit run app.py
```

### Any Errors while pip install like this
```
error: subprocess-exited-with-error

× pip subprocess to install build dependencies did not run successfully.
│ exit code: 1
╰─> See above for output.
```
## Download Cmake and install it
- [Cmake download](https://cmake.org/download/)

## Additional helper documents
- [LlamaIndex blogpost about Llamaparse](https://www.llamaindex.ai/blog/launching-the-first-genai-native-document-parsing-platform)
- [Parsing instructions Llamaparse](https://colab.research.google.com/drive/1dO2cwDCXjj9pS9yQDZ2vjg-0b5sRXQYo#scrollTo=dEX7Mv9V0UvM)

