---
author: Prakash Rai
pubDatetime: 2023-09-27T12:13:24Z
title: "The curious case of missing hyphens"
featured: false
draft: false
tags:
  - Encodings
description:
    Looks can be deceptive! This article discusses the bugs that arise due to different representations of similar looking symbols, and why do we need them in first place.
---

# The curious case of hyphens

So today I was working on a simple search functionality for an application. The job was simple. Given an article and a set of company names, look if the article contains any of the names. If it does, then report a match, otherwise move to the next article. Pretty simple, right? 

There I encountered an article containing the following sentence

```
XXXXXXX Corp. (“XXXXXX”; TSX‐V: XXX) today reported initial
results  ...... (rest of the article)
```

Names are masked to protect IP (anyways they are irrelevant here).

The interesting thing was, `TSX‐V: XXX` was there in our wordlist, and still I wasn’t getting any matches. And it wasn’t that I was using any fancy method of searching. I was simply using Python’s 

```python
string.find('TSX-V: XXX')
```

method.

After several brute force attempts, I found out that the hyphen present in news article `‐` , is different from the normal hyphen `-` present on our keyboard! (Now that I have typed these two hyphens independently, it is evident from their widths that both of them are different!)

The normal hyphen `-` Unicode representation is **U+002D**, while the Unicode representation of `‐` is **U+2010**.

Similarly in python interpreter,

```
ord('-') # Normal hyphen
```

gives **45**, while

```
ord('‐') # The one in the JNM article
```

gives **8208.**

Well, half an hour wasted because news agencies apparently can’t use the common ASCII symbols! Anyways, hope it helps someone else :)