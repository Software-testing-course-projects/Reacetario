from selenium import webdriver
from selenium.webdriver.common.by import By
import time
import pytest

@pytest.fixture()

def testSetup():

    global driver
    # Using Chrome to access web
    driver = webdriver.Chrome()
    # Open the website
    driver.get('http://localhost:3000/')

    element = driver.find_elements(By.CLASS_NAME, "Tarjeta")
    for tarjeta in element:
        print(tarjeta.text)
        if "Exo del Destiny" in tarjeta.text:
            time.sleep(2)
            botonMenu = tarjeta.find_element(By.ID, "MasButton")
            botonMenu.click()
            time.sleep(6)

    
    

def testGet(testSetup):
    driver.get('http://localhost:3000/')
    element = driver.find_elements(By.CLASS_NAME, "Tarjeta")
    for tarjeta in element:
        print(tarjeta.text)
        if "Exo del Destiny" in tarjeta.text:
            time.sleep(10)
            botonMenu = tarjeta.find_element(By.ID, "MasButton")
            botonMenu.click()
            time.sleep(10)