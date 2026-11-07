from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os, webbrowser
os.chdir(Path(__file__).resolve().parent)
server=ThreadingHTTPServer(('127.0.0.1',8765),SimpleHTTPRequestHandler)
print('Beit Midrash: http://127.0.0.1:8765\nCtrl+C to stop.')
webbrowser.open('http://127.0.0.1:8765')
try: server.serve_forever()
except KeyboardInterrupt: server.server_close()
