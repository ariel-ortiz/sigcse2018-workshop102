#
#  Solution to exercise D.
#
#  Copyright © 2016-2018 by Ariel Ortiz.
#
#  Free use of this source code is granted under the terms of the
#  GPL version 3 License.
#
 
from http.client import HTTPConnection
from sys import stderr
from json import loads

conn = HTTPConnection('localhost:8080')

try:
    conn.request('GET', '/quotations')
    res = conn.getresponse()
    body = res.read().decode('utf-8')
    if res.status != 200:
        raise Exception(str(res.status) + ' '
            + res.reason + '. ' + body)
    for q in loads(body):
        print('{0} - {1}: {2}'.format(q['id'], q['author'], q['prelude']))
except Exception as err:
    print('ERROR: ' + str(err), file=stderr)
