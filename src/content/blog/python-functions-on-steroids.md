---
author: Prakash Rai
pubDatetime: 2022-09-22T12:13:24Z
title: "Python functions on steroids"
featured: true
draft: false
tags:
  - Python
description:
    TIL that you can attach custom properties to a function in Python. I tried to explore its usecases.
---


# Python Functions on steroids

TIL that you can attach custom properties to a function in python. E.g.

```python
def sample(x):
	return x

print(sample(5)) # prints 5

# However, you can do this too, to a function
sample.custom_attribute = 10

print(sample.custom_attribute) # prints 10
```

This seems simple, but can be used to build useful things.

For example, if you want to run a function only once, here’s how you can do it.

```python
def run_only_once():
	if hasattr(run_only_once, 'called'):
		raise ValueError('Can only be called once')
	# Your business logic here
	run_only_once.called = True # Could be any value. The only condition is property should exist.
	return 42

print(run_only_once()) # prints 42
print(run_only_once()) # raises ValueError
```

This approach can be used to implement singleton pattern.

Or, if you wish to cache the results

```python
import time
def some_expensive_computation(x: int):
		if not hasattr(some_expensive_computation, 'cache'):
			some_expensive_computation.cache = {}
		y = some_expensive_computation.cache.get(x)
		if y:
			return y
		# Do your business calculation here
		time.sleep(1)
		some_expensive_computation.cache[x] = 42
		return 42

some_expensive_computation(5) # returns 42 after a second
some_expensive_computation(5) # returns 42 immediately
```

Note that caching functionality can be better achieved using decorators. Using the above approach will expose your underlying variables to everyone which is understandably undesirable in most cases, but might be helpful in certain cases. A practical use case is:

Let’s say you are developing a Machine Learning Pipeline to summarize the contents of a news article, and you don’t want to parse the same news article twice. So you cached the results of your parsing module.

However, later in your pipeline, you identify that some of the summaries are incorrect, and you want to update them manually in the cache itself so that the next time the same article is passed to the parser, the correct summaries come out.

Now if you have access to the cache contents, someone can go update the summaries in a web portal, and you can inject the updated summaries back into the cache!

(Any sane developer would (and should) switch to some standard caching service at this point in time (say Redis), but if your use case is simple, and you don’t want to introduce yet another service to your infrastructure, you can use this hack.)

Of course, You can use this to do silly simple things, like storing how many times a function runs (This might come in handy in profiling)

```python
def i_am_thanos():
	if hasattr(i_am_thanos, 'times_ran'):
		i_am_thanos.times_ran += 1
	else:
		i_am_thanos.times_ran = 1
	# Your code here
	return 42

i_am_thanos()
i_am_thanos()
i_am_thanos()
print(i_am_thanos.times_ran)  # prints 3
```

Or how much time did each function call take, or what buckets your integer arguments fall in etc.

One downside of attaching custom properties on top of functions is, the code responsible for attaching the properties lives inside the function definition, which kind of pollutes the actual logic. Sure you can attach the properties after you’ve defined the functions, but then your function logic isn’t self-contained anymore(which is also the case with decorators, but they have become a standard practice by now).

Anyways, the idea behind this article was to tell you about the ability to attach custom attributes to functions. Now that you know this, you might end up using it in a completely different scenario.

JS also has this ability, and it utilizes it in a much more amazing way. Did you know, a `class` in JS is nothing but a function on steroids, and unlike we doing almost all of the tooling here by ourselves, JS does it under the hood!

Going to write an article on JS functions soon! Stay tuned!