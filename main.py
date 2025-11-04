from bottle import route, run, static_file

@route('/')
def server_index():
    return static_file('index.html', root='.')

@route('/static/<filename:path>')
def server_static(filename):
    return static_file(filename, root='./static')


@route('/api/temperature')
def get_all_users():
    return {"temperature": 25.5}


run(host='localhost', port=8080, debug=True)