from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time
import pytest

URL = "http://44.202.138.175:3000/"

options = webdriver.ChromeOptions()
options.add_experimental_option('excludeSwitches', ['enable-logging'])
driver = webdriver.Chrome(options=options)
driver.get(URL)

# Clickear en un elemento, usando ID.

time.sleep(1) 

elemento = driver.find_element(By.ID, "Addbutton").click()

time.sleep(1) 

# Testing Add Receta


driver.find_element(By.ID, "titulo").send_keys("webdriver" + Keys.ENTER)
driver.find_element(By.ID, "descripcion").send_keys("webdriver" + Keys.ENTER)
driver.find_element(By.ID, "image").send_keys("https://d.furaffinity.net/art/twistedbones/1667661408/1667661408.twistedbones_ic9n_butcher.png" + Keys.ENTER)
driver.find_element(By.ID, "AddRecetaButton").click()
driver.find_element(By.ID, "paso").send_keys("webdriver" + Keys.ENTER)
# Verificación de ADD Correcto



time.sleep(1) 



time.sleep(10)         