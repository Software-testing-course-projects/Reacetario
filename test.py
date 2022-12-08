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
    yield
    driver.quit()
    

def testGet(testSetup):
    driver.get('http://3.89.112.53:3000/')
    element = driver.find_element(By.CLASS_NAME, "Tarjeta").text
    assert "Prueba de carne" in element