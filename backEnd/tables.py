#define aca las tablas de la base de datos
import psycopg2
import time

while True:
    try:
        conn = psycopg2.connect(
            host="postgres",
            database="testing",
            user="user",
            password="pass")
        break
    except:
        print("Waiting for postgres to be ready")
        time.sleep(1)

cur = conn.cursor()

def createTables():

    # create table users

    cur.execute("""CREATE TABLE IF NOT EXISTS users (
        id serial PRIMARY KEY,
        username varchar(50) NOT NULL,
        password varchar(50) NOT NULL,
        email varchar(50) NOT NULL,
        name varchar(50) NOT NULL);""")
    conn.commit()
    cur.execute("""CREATE TABLE IF NOT EXISTS recipes ( 
        id serial PRIMARY KEY,
        title varchar(500) NOT NULL,
        description varchar(500) NOT NULL,
        date varchar(100) NOT NULL,
        image varchar(500) NOT NULL);""")  
    conn.commit()
    cur.execute("""CREATE TABLE IF NOT EXISTS ingredients (
        id serial PRIMARY KEY,
        text varchar(500) NOT NULL,
        recipe_id integer NOT NULL,
        FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE);""")
    conn.commit()
    cur.execute("""CREATE TABLE IF NOT EXISTS steps (
        id serial PRIMARY KEY,
        text varchar(500) NOT NULL,
        recipe_id integer NOT NULL,
        FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE);""")
    conn.commit()