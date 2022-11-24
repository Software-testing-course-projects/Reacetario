from tables import createTables, populateTables
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
        "name": "users",
        "description": "Operations with users. The **login** logic is also here.",
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
        populateTables()
        break
    except:
        print("Waiting for postgres to be ready")
        time.sleep(1)

# create a cursor
cur = conn.cursor()

# Definir status code en definición es el estado por defecto.
# CRUD de usuarios

@app.get("/users", tags=["users"], status_code=200, responses={
    200: {
        "description": "List of users",
        "content": {
            "application/json": {
                "example": {
                    "message": [{
                        "id": 1,
                        "username": "user",
                        "password": "pass",
                        "email": "user@usm.cl",
                        "name": "user",
                    }]
                }
            }
        }
    }})
def read_users():
    # execute query
    cur.execute('SELECT * FROM users')
    # fetch the result
    result = cur.fetchall()
    return {"message": result}


@app.delete("/user/{id}", tags=["users"], status_code=200, responses={
    200: {
        "description": "Se borró el usuario",
        "content": {
            "application/json": {
                "example": {
                    "message": "Se ha borrado el usuario con éxito"
                }
            }
        }
    },
    400: {
        "description": "El usuario no existe",
        "content": {
            "application/json": {
                "example": {
                    "message": "El usuario no existe"
                }
            }
        }
    },
    500: {
        "description": "Error interno del servidor",
        "content": {
            "application/json": {
                "example": {
                    "message": "Error interno del servidor"
                }
            }
        }
    }
})
def delete_user(id):
    # execute query
    try:
        cur.execute(f'SELECT * FROM users WHERE id = {id}')
        result = cur.fetchone()
        if result:
            cur.execute(f'DELETE FROM users WHERE id = {id}')
            conn.commit()
        # fetch the result
    except:
        cur.execute("ROLLBACK")
        return JSONResponse(status_code=400, content={"message": "El usuario no existe"})
       
    return {"message": "Se ha borrado el usuario"}



class Register(BaseModel):
    username: str
    password: str
    email: str
    name: str


@app.post("/register", status_code=201, tags=["users"], responses={
    201: {
        "description": "User created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "User created successfully"
                }
            }
        }
    },
    400: {
        "description": "User already exists",
        "content": {
            "application/json": {
                "example": {
                    "message": "User already exists"
                }
            }
        }
    },
    500: {
        "description": "User created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }


})
async def register_user(item: Register):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM users WHERE username = %s',
                    (item.username,))
        result = cur.fetchone()
        if result:
            return JSONResponse(status_code=400, content={"message": "User already exists"})
        cur.execute('INSERT INTO users (username, password, email, name) VALUES (%s, %s, %s, %s)',
                    (item.username, item.password, item.email, item.name))
        conn.commit()
        return JSONResponse(status_code=201, content={"message": "User created successfully"})
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK")
        return JSONResponse(status_code=500, content={"message": "Internal server error"})


class Login(BaseModel):
    username: str
    password: str


@app.post("/login", status_code=200, tags=["users"], responses={
    200: {
        "description": "User logged in successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "User logged in successfully"
                }
            }
        }
    },
    400: {
        "description": "User not found",
        "content": {
            "application/json": {
                "example": {
                    "message": "User not found"
                }
            }
        }
    },
    500: {
        "description": "Internal server error",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def login_user(item: Login, response: Response):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM users WHERE username = %s AND password = %s',
                    (item.username, item.password))
        result = cur.fetchone()
        if result:
            return {"message": result}
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "User not found"}
    except Exception as e:
        print(e)
        cur.execute("ROLLBACK")
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error"}

