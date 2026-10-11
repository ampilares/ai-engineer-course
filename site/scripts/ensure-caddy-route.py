#!/usr/bin/env python3
"""Maintain only the course routes in amp-vps's existing Caddy API config."""
import fcntl
import json
import pathlib
import urllib.error
import urllib.request

root = pathlib.Path(__file__).resolve().parent.parent
lock = (root / '.caddy-route.lock').open('w')
fcntl.flock(lock, fcntl.LOCK_EX)
api = 'http://127.0.0.1:2019'
host = 'course.allenpilares.com'
routes = {
    'srv0': {
        '@id': 'ai-engineer-course-https',
        'match': [{'host': [host]}],
        'handle': [{'handler': 'reverse_proxy', 'upstreams': [{'dial': '127.0.0.1:3025'}]}],
        'terminal': True,
    },
    'srv1': {
        '@id': 'ai-engineer-course-http',
        'match': [{'host': [host]}],
        'handle': [{'handler': 'static_response', 'status_code': 308,
                    'headers': {'Location': ['https://' + host + '{http.request.uri}']}}],
        'terminal': True,
    },
}
for server, route in routes.items():
    try:
        with urllib.request.urlopen(api + '/id/' + route['@id']) as response:
            current = json.load(response)
        if current != route:
            raise RuntimeError('Course route has changed; review it before updating')
    except urllib.error.HTTPError as error:
        if error.code != 404:
            raise
        backup = root / 'caddy-before-course.json'
        if not backup.exists():
            with urllib.request.urlopen(api + '/config/') as response:
                backup.write_bytes(response.read())
            backup.chmod(0o600)
        request = urllib.request.Request(
            api + '/config/apps/http/servers/' + server + '/routes',
            data=json.dumps(route).encode(),
            headers={'Content-Type': 'application/json'}, method='POST')
        with urllib.request.urlopen(request) as response:
            response.read()
        print('Added ' + route['@id'])
