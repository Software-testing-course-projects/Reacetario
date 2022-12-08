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
    driver.get(URL_LOCAL)

    yield

    driver.quit()


@pytest.fixture()
def add_testing(testSetup):
    # Clickear en un elemento, usando ID.

    driver.find_element(By.ID, "Addbutton").click()

    # Testing Add Receta


    driver.find_element(By.ID, "titulo").send_keys("Exo del Destiny" + Keys.ENTER)
    driver.find_element(By.ID, "descripcion").send_keys("webdriver" + Keys.ENTER)
    driver.find_element(By.ID, "image").send_keys("https://d.furaffinity.net/art/twistedbones/1667661408/1667661408.twistedbones_ic9n_butcher.png" + Keys.ENTER)
    driver.find_element(By.NAME, "paso").send_keys("webdriver1" + Keys.ENTER)
    driver.find_element(By.NAME, "ingrediente").send_keys("webdriver1" + Keys.ENTER)
    driver.find_element(By.ID, "AddRecetaButton").click()

    time.sleep(2)

def test_add(add_testing):

    element = driver.find_elements(By.CLASS_NAME, "Tarjeta")
    for tarjeta in element:
        if "Exo del Destiny" in tarjeta.text:
            assert "Exo del Destiny" in tarjeta.text
            time.sleep(2)
            break

@pytest.fixture()
def delete_testing(testSetup):

    time.sleep(10)

    elements = driver.find_elements(By.CLASS_NAME, "Tarjeta")
    print(f"CHUPALO TESTING QLO DE MIERDA\n")
    print(f"{elements}\n")
    for tarjeta in elements:
        print(f"{tarjeta.text}\n")
        if "Exo del Destiny" in tarjeta.text:
            print(f"CHUPALO TESTING QLO DE MIERDA\n")
            tarjeta.find_element(By.ID, "MasButton").click()

            time.sleep(2)

            menu = driver.find_element(By.ID, "basic-menu")

            time.sleep(2)

            menu.find_element(By.ID, "BorrameLaWea").click()

            time.sleep(4)


def test_delete(delete_testing):
    
    element = driver.find_elements(By.CLASS_NAME, "Tarjeta")

    for tarjeta in element:
        assert "Exo del Destiny" not in tarjeta.text
        time.sleep(2)