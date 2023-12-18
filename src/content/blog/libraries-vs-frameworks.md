---
author: Prakash Rai
pubDatetime: 2023-09-27T12:13:24Z
title: Libraries v/s Frameworks
featured: false
draft: false
tags:
  - software engineering
description:
    An attempt to explain the difference between libraries and frameworks
---
# Libraries v/s Frameworks

I have been professionally developing software for ~4 years now. And never ever I have worked on a project which was complete in itself. Directly or indirectly, there was a dependency on some code written by some kind of OSS developer(s).

While using those dependencies, one thing that intrigued me in my initial days was "Why do people call X a library, and Y a framework?" This post is the answer to that question.

While reading this post, keeping a framework and a library in mind will be helpful. If you're a Python developer, I'll suggest `flask` as a framework and `requests` as a library. I'll give examples in Python, wherever required.

### Example Code

---

Let's define a function that fetches the latest time from a given server.

### Library

```
import requests

def get_latest_server_time(server_url: str):
    resp = requests.get(server_url)
    if resp.status_code == 200:
        return resp.json()
    raise Exception('Unable to get latest time from server')

```

Simple code, right? Your function utilizes `requests` "library", which provides a super-helpful method `get`, which abstracts the details like creating a connection to a server, sending the request, unmarshalling the response, etc.

### Framework

Let's define a simple API endpoint that returns "Hello World"

```
from flask import Flask

app = Flask(__name__)

@app.route("/hello")
def hello_world():
    return "Hello World"

if __name__ == '__main__':
    app.run()

```

Here, we defined a function `hello_world` and then instructed the `flask` to call that function if any request hits at the `/hello` endpoint. Simple enough? Cool, let's move to the crux of the article

### Difference b/w library and framework

---

Examine the `get_latest_server_time` function we defined in the `Library` example. You're calling the `requests.get` function. It does something under the hood and returns you a `Response` object. Then, you process the `Response` object and take appropriate action. The key thing to note here is

> You are controlling the flow of execution. You are responsible for invoking the code written by some 3rd party.
> 

Now, let's move to our framework example. Let's assume that we started our API server locally, and it is running on port `5000`. What happens when you do the following curl?

```
$ curl -X GET http://127.0.0.1:5000/hello

```

You'll get the following response

```
Hello World

```

Let's walk through step-by-step how we got the response.

- We started a server by calling `app.run()`
- The server is listening to any request which is hitting at `http://127.0.0.1:5000/`
- If someone requests `http://127.0.0.1:5000/hello`, the server executes the `hello_world` method, defined by us.
- Finally, the server wraps the output of `hello_world` into a `Response` object and sends it to whoever made that request.

The key thing to note here is

> The flask server is controlling the flow of execution. It is responsible for invoking the code written by you.
> 

The moment `python` executes `app.run()` in our example, the flow of control is transferred to  `flask`. And after that, `flask` is responsible for executing the code written by us.

And that folks, is the difference between a framework and a library. **It's all about the flow of control.**

---

> While using libraries, you control when a third party module gets invoked.
> 
> While using frameworks, the 3rd party module controls when your code gets invoked. 

---

It doesn't matter which language you use, the above-mentioned distinction will always hold.

### Some technical tidbits

- The technical term for the transfer of flow control to framework is called **Inversion of Control**. It is a very important principle in software engineering and demands an article of its own. I'll write one describing it soon.
- This may be controversial, but if you think about it, all Operating Systems are frameworks :)