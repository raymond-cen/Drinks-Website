def search_tags(con, data):
    search_string = '%' + data.get('text') + '%'

    cur = con.cursor()
    query = 'select * from tags where lower(name) like ?'
    cur.execute(query, (search_string,))

    return [dict(x) for x in cur.fetchall()]
