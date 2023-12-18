---
author: Prakash Rai
pubDatetime: 2023-08-11T12:13:24Z
title: Chromedriver v/s Geckodriver
featured: false
draft: false
tags:
  - web scraping
description:
    Managing PDF downloads with Geckodriver is easier than Chromedriver
---

# Chromedriver v/s GeckoDriver: Dealing with PDF URLs

## Background

Recently, I was working on a simple scraping task. I had to write a program that goes through a bunch of URLs and for every URL,

- Click on a button that redirects to a PDF
- Download the final PDF

Here’s the piece of code I was using

```python
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless")
driver = webdriver.Chrome('./chromedriver', options=options)

def save_pdf(url, fname):
	response = requests.get(url)
	with open(fname, 'wb') as f:
	  f.write(response.content)

def main(urls: List[str]):
	for url in urls:
		# Navigate browser to URL containing relevant button
		driver.get(url)
	try:
		# If the button exists, click it
	  x = driver.find_element(By.XPATH, '''//input[@value='Click here']''')
	  x.click()
	except NoSuchElementException:
		# If it doesn't, we're on PDF page
    pass
	# Finally, save the PDF at the current URL to a file named xxxx.pdf
	save_pdf(driver.current_url, 'xxxx.pdf')
```

## Problem Statement

The code is straightforward, and it worked fine when the headless mode was off. However, the moment headless mode was turned on, something spooky started to happen. Plain HTML pages containing the `Click here` button were being downloaded instead of PDFs. Given this fact, one might conclude that `x.click()` was not executing properly.

But astonishingly, PDFs were getting downloaded, just with some gibberish names (like `3487938nfhabalkvt.pdf`). I was confused , because if my `save_pdf` module was downloading the HTML pages, who tf was downloading the PDFs??

And after 8 hours of debugging and researching, I concluded that `chromedriver` was the culprit! It was the one downloading the PDFs. The next question was why? And the closest answer I could find after hours of research was that `chromedriver` doesn’t support opening the PDFs, and hence the default behavior is to download the PDF whenever it encounters a link containing a PDF.

And the worst part, `driver.current_url` still points to the link which redirects you to the PDF, not the actual PDF link 😖. So that’s why, when `save_pdf` was getting called, it actually downloaded the HTML page, and since `x.click()` happened, the `chromedriver` was downloading the PDFs separately, and assigning the name which it got from the server.

## Solution

On a hunch, I just changed `chromedriver` to `geckodriver` (Webdriver for Firefox), and everything worked. Here’s the new snippet which worked

P.S.: To get `geckodriver` to work, you need to add directory containing `geckodriver` to `PATH`.

```python
from selenium.webdriver.firefox.options import Options # This changed

options = Options()
options.add_argument("--headless")
# Ensure that geckodriver executable is in PATH
driver = webdriver.Firefox(options=options) # This changed

def save_pdf(url, fname):
	response = requests.get(url)
	with open(fname, 'wb') as f:
	  f.write(response.content)

def main(urls: List[str]):
	for url in urls:
		# Navigate browser to URL containing relevant button
		driver.get(url)
	try:
		# If the button exists, click it
	  x = driver.find_element(By.XPATH, '''//input[@value='Click here']''')
	  x.click()
	except NoSuchElementException:
		# If it doesn't, we're on PDF page
    pass
	# Finally, save the PDF at the current URL to a file named xxxx.pdf
	save_pdf(driver.current_url, 'xxxx.pdf')
```

## Related links

There were tons of links that I visited, but this one gives you enough information to diagnose the problem

https://github.com/puppeteer/puppeteer/issues/1872