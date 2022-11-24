from tables import createTables
from re import S
import time
import psycopg2
from pydantic import BaseModel

from fastapi import FastAPI, Response, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

description = """
Este es el backend de Reacetario

## **Integrantes**

"""

tags_metadata = [
    {
        "name": "recipes",
        "description": "Operations with recipes.",
    },
]
app = FastAPI(title="BackEnd reacetario",
              description=description,
              version="0.1", openapi_tags=tags_metadata)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# connect to database
while True:
    try:
        conn = psycopg2.connect(
            host="postgres",
            database="testing",
            user="user",
            password="pass")
        createTables()
        break
    except:
        print("Waiting for postgres to be ready")
        time.sleep(1)

# create a cursor
cur = conn.cursor()

# Definir status code en definición es el estado por defecto.
# CRUD de usuarios

@app.get("/recipes", tags=["recipes"], status_code=200)
def get_recipes():
    # execute query
    try:
        cur.execute('SELECT * FROM recipes')
        # fetch the result
        result = cur.fetchall()

        # create a list of dictionaries
        recipes = []
        for row in result:
            recipes.append({"id": row[0], "title": row[1], "description": row[2], "date" : row[3], "image": row[4]})
        
        # get steps and ingredients
        for recipe in recipes:
            cur.execute('SELECT text FROM ingredients WHERE recipe_id = %s', (recipe["id"],))
            ingredients = cur.fetchall()
            recipe["ingredients"] = [ingredient[0] for ingredient in ingredients]
            cur.execute('SELECT text FROM steps WHERE recipe_id = %s', (recipe["id"],))
            steps = cur.fetchall()
            recipe["steps"] = [step[0] for step in steps]
        return {"message": recipes}
    except:
        return {"message": "Error"}


@app.delete("/recipes/{id}", tags=["recipes"], status_code=200)
def delete_recipe(id):
    # execute query
    try:
        cur.execute(f'SELECT * FROM recipes WHERE id = %s', (id,))
        result = cur.fetchone()
        if result:
            cur.execute(f'DELETE FROM recipes WHERE id = %s', (id,))
            conn.commit()
            cur.execute('SELECT * FROM recipes')
            # fetch the result
            result = cur.fetchall()

            # create a list of dictionaries
            recipes = []
            for row in result:
                recipes.append({"id": row[0], "title": row[1], "description": row[2], "date" : row[3], "image": row[4]})
            
            # get steps and ingredients
            for recipe in recipes:
                cur.execute('SELECT text FROM ingredients WHERE recipe_id = %s', (recipe["id"],))
                ingredients = cur.fetchall()
                recipe["ingredients"] = [ingredient[0] for ingredient in ingredients]
                cur.execute('SELECT text FROM steps WHERE recipe_id = %s', (recipe["id"],))
                steps = cur.fetchall()
                recipe["steps"] = [step[0] for step in steps]
            return {"message": recipes}
        else:
            return {"message": "Recipe not found"}
        # fetch the result
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK")
        return {"message": "Error deleting recipe"}



class Recipe(BaseModel):
    ingredients: list = []
    steps: list = []
    title: str
    date: str
    description: str
    image: str


@app.post("/recipes", status_code=201, tags=["recipes"])
async def add_recipe(item: Recipe):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM recipes WHERE title = %s',
                    (item.title,))
        result = cur.fetchone()
        if result:
            return JSONResponse(status_code=400, content={"message": "Recipe already exists"})
        cur.execute('INSERT INTO recipes (title, description, image, date) VALUES (%s, %s, %s, %s)',
                    (item.title, item.description, item.image, item.date))
        cur.execute('SELECT * FROM recipes WHERE title = %s',
                    (item.title,))
        result = cur.fetchone()
        recipe_id = result[0]
        for ingredient in item.ingredients:
            cur.execute('INSERT INTO ingredients (text, recipe_id) VALUES (%s, %s)',
                        (ingredient, recipe_id))
        for step in item.steps:
            cur.execute('INSERT INTO steps (text, recipe_id) VALUES (%s, %s)',
                        (step, recipe_id))
        conn.commit()
        cur.execute('SELECT * FROM recipes')
        # fetch the result
        result = cur.fetchall()

        # create a list of dictionaries
        recipes = []
        for row in result:
            recipes.append({"id": row[0], "title": row[1], "description": row[2], "date" : row[3], "image": row[4]})
        
        # get steps and ingredients
        for recipe in recipes:
            cur.execute('SELECT text FROM ingredients WHERE recipe_id = %s', (recipe["id"],))
            ingredients = cur.fetchall()
            recipe["ingredients"] = [ingredient[0] for ingredient in ingredients]
            cur.execute('SELECT text FROM steps WHERE recipe_id = %s', (recipe["id"],))
            steps = cur.fetchall()
            recipe["steps"] = [step[0] for step in steps]
        return {"message": recipes}
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK")
        return JSONResponse(status_code=500, content={"message": "Internal server error"})

@app.put("/recipes/{id}", status_code=200, tags=["recipes"])
async def update_recipe(id, item: Recipe):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM recipes WHERE id = %s',
                    (id,))
        result = cur.fetchone()
        if result:
            cur.execute('UPDATE recipes SET title = %s, description = %s, image = %s, date = %s WHERE id = %s',
                        (item.title, item.description, item.image, item.date, id))
            cur.execute('DELETE FROM ingredients WHERE recipe_id = %s',
                        (id,))
            cur.execute('DELETE FROM steps WHERE recipe_id = %s',
                        (id,))
            for ingredient in item.ingredients:
                cur.execute('INSERT INTO ingredients (text, recipe_id) VALUES (%s, %s)',
                            (ingredient, id))
            for step in item.steps:
                cur.execute('INSERT INTO steps (text, recipe_id) VALUES (%s, %s)',
                            (step, id))
            conn.commit()
            cur.execute('SELECT * FROM recipes')
            # fetch the result
            result = cur.fetchall()

            # create a list of dictionaries
            recipes = []
            for row in result:
                recipes.append({"id": row[0], "title": row[1], "description": row[2], "date" : row[3], "image": row[4]})
            
            # get steps and ingredients
            for recipe in recipes:
                cur.execute('SELECT text FROM ingredients WHERE recipe_id = %s', (recipe["id"],))
                ingredients = cur.fetchall()
                recipe["ingredients"] = [ingredient[0] for ingredient in ingredients]
                cur.execute('SELECT text FROM steps WHERE recipe_id = %s', (recipe["id"],))
                steps = cur.fetchall()
                recipe["steps"] = [step[0] for step in steps]
            return {"message": recipes}
        else:
            return JSONResponse(status_code=400, content={"message": "Recipe not found"})
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK")
        return JSONResponse(status_code=500, content={"message": "Internal server error"})