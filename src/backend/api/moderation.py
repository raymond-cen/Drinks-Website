import sqlite3


def is_admin(con, data):
    userid = data.get('userid')
    if not userid:
        raise ValueError('Need userid to check if admin')
    cur = con.cursor()

    query = 'select * from admins where userid=?'
    cur.execute(query, (userid,))

    row = cur.fetchone()
    if row is None:
        return False
    return True

def promote_to_admin(con, data):
    admin = data.get('userid')
    new_admin = data.get('newuserid')

    if not new_admin:
        raise ValueError('Require userid of new admin')

    cur = con.cursor()
    if is_admin(con, data):
        try:
            query = 'insert into admins (userid) values (?)'
            cur.execute(query, (new_admin,))
        except sqlite3.IntegrityError:
            raise ValueError('User is already an admin')

    else:
        raise ValueError('Only admins can create new admins')
    
    con.commit()
    return 