from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
import pytest

@pytest.fixture()
def testSetup():
    URL = "http://3.89.112.53:3000/"
    URL_LOCAL = "http://localhost:3000"

    options = webdriver.ChromeOptions()
    options.add_experimental_option('excludeSwitches', ['enable-logging'])
    global driver
    driver = webdriver.Chrome(options=options)
    driver.get(URL)

    yield

    driver.quit()


@pytest.fixture()
def add_testing(testSetup):
    # Clickear en un elemento, usando ID.
    try:

        driver.find_element(By.ID, "Addbutton").click()

        # Testing Add Receta


        driver.find_element(By.ID, "titulo").send_keys("Completo italiano" + Keys.ENTER)
        driver.find_element(By.ID, "descripcion").send_keys("Completito" + Keys.ENTER)
        driver.find_element(By.ID, "image").send_keys("https://upload.wikimedia.org/wikipedia/commons/e/e0/Completo_italiano.jpg" + Keys.ENTER)
        driver.find_element(By.NAME, "ingrediente").send_keys("Un completo" + Keys.ENTER)
        driver.find_element(By.NAME, "paso").send_keys("Hacer un completo" + Keys.ENTER)
        driver.find_element(By.ID, "AddRecetaButton").click()

        time.sleep(2)
    except Exception as e:
        print(e)
        assert False

def test_add(add_testing):
    try:
        time.sleep(5)

        element = driver.find_elements(By.CLASS_NAME, "Tarjeta")
        found = False
        for tarjeta in element:
            if "Completo italiano" in tarjeta.text:
                found = True
                imagen = tarjeta.find_element(By.CLASS_NAME, "Imagen")
                assert imagen.get_attribute("src") == "https://upload.wikimedia.org/wikipedia/commons/e/e0/Completo_italiano.jpg"
                time.sleep(2)
                break
        if not found:
            assert False
    except Exception as e:
        print(e)
        assert False
    

@pytest.fixture()
def edit_testing(testSetup):
    try:

        time.sleep(5)

        elements = driver.find_elements(By.CLASS_NAME, "Tarjeta")
        for tarjeta in elements:
            if "Completo italiano" in tarjeta.text:
                tarjeta.find_element(By.ID, "MasButton").click()
    
                time.sleep(2)
    
                menu = driver.find_element(By.ID, "basic-menu")
    
                time.sleep(2)
    
                menu.find_element(By.ID, "EditarBoton").click()
    
                time.sleep(4)
                driver.find_element(By.ID, "titulo").send_keys(Keys.SHIFT + Keys.UP, Keys.BACKSPACE)
                driver.find_element(By.ID, "titulo").send_keys("HotDog italiano" + Keys.ENTER)
                driver.find_element(By.ID, "descripcion").send_keys(Keys.SHIFT +  Keys.ARROW_UP)
                driver.find_element(By.ID, "descripcion").send_keys(Keys.BACKSPACE)
                driver.find_element(By.ID, "descripcion").send_keys("HotDog" + Keys.ENTER)
                driver.find_element(By.ID, "image").send_keys(Keys.SHIFT + Keys.UP)
                driver.find_element(By.ID, "image").send_keys(Keys.BACKSPACE)
                driver.find_element(By.ID, "image").send_keys("https://static.onecms.io/wp-content/uploads/sites/19/2017/06/05/elcompleto.jpg" + Keys.ENTER)
                driver.find_element(By.NAME, "ingrediente").send_keys(Keys.SHIFT + Keys.UP)
                driver.find_element(By.NAME, "ingrediente").send_keys(Keys.BACKSPACE)
                driver.find_element(By.NAME, "ingrediente").send_keys("Un hotdog" + Keys.ENTER)
                driver.find_element(By.NAME, "paso").send_keys(Keys.SHIFT +  Keys.UP)
                driver.find_element(By.NAME, "paso").send_keys(Keys.BACKSPACE)
                driver.find_element(By.NAME, "paso").send_keys("Hacer un hotdog" + Keys.ENTER)
                driver.find_element(By.ID, "EditRecetaButton").click()
    
                time.sleep(4)
                break
    except Exception as e:
        print(e)
        assert False

def test_edit(edit_testing):
    try:
        time.sleep(5)
        element = driver.find_elements(By.CLASS_NAME, "Tarjeta")
        found = False
        
        for tarjeta in element:
            if "HotDog italiano" in tarjeta.text:
                found = True
                imagen = tarjeta.find_element(By.CLASS_NAME, "Imagen")
                assert imagen.get_attribute("src") == "https://static.onecms.io/wp-content/uploads/sites/19/2017/06/05/elcompleto.jpg"
                time.sleep(2)
                break
        if not found:
            assert False
    except Exception as e:
        print(e)
        assert False

@pytest.fixture()
def delete_testing(testSetup):
    try:

        time.sleep(5)

        elements = driver.find_elements(By.CLASS_NAME, "Tarjeta")
        for tarjeta in elements:
            if "HotDog italiano" in tarjeta.text:
                tarjeta.find_element(By.ID, "MasButton").click()

                time.sleep(2)

                menu = driver.find_element(By.ID, "basic-menu")

                time.sleep(2)

                menu.find_element(By.ID, "BorrarBoton").click()

                time.sleep(4)
    except Exception as e:
        print(e)
        assert False


def test_delete(delete_testing):
    try:
        time.sleep(5)
        element = driver.find_elements(By.CLASS_NAME, "Tarjeta")

        for tarjeta in element:
            assert "HotDog italiano" not in tarjeta.text
            time.sleep(2)
    except Exception as e:
        print(e)
        assert False
