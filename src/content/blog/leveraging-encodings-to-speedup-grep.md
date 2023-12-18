---
author: Prakash Rai
pubDatetime: 2023-03-22T12:13:24Z
title: Leveraging Encodings to speedup grep
featured: true
draft: false
tags:
  - grep
  - shell scripting
description:
    A guide on how to use grep efficiently (if your data allows it)
---

# Leveraging encodings to speedup grep

## Target Audience

- You know what a FASTA file looks like
- You know the *bits and bytes* of storage (pun intended 😛)

## TL;DR

Run 

```bash
export LC_ALL=C
```

before running your grep statement. Based on your system settings, this might give you a speedup of **>500%.**

**Caution:** Do this only if your data is ASCII encoded. Things will be messy if you run above export when your data is in some encoding other than ASCII.

## A quick intro to `grep`

`grep` is a GNU utility used for searching files for lines that match a given set of patterns. For example, if you wish to retrieve all the headers in a FASTA file, you can do

```bash
grep ‘>’ in.fasta
```

This will retrieve all the lines that contain the character `>`. Since all the FASTA headers start with `>`, this will retrieve all the FASTA headers. 

Note that `>` can’t occur anywhere else in the FASTA file, apart from the header. Hence, it is guaranteed that only headers will be returned. We can specify a better search pattern, which will restrict the search to return only the lines which start with `>`, but that’s out of scope for this article.

## A quick intro to encodings

Encodings are a way to represent characters in numbers so that they can be understood by a machine. For example, Assume you (arbitrarily) declare that

- `A` is represented as 65
- `H` is represented as 72
- `a` is represented as 97
- `h` is represented as 104

Then, your computer will understand `HahA` as `72 97 104 65`

Note:

- Spaces around numbers are just for illustrative purposes
- The computer will finally store the values in binary format, as it only understands `0s` and `1s`. How to calculate binary representation of a given integer is a topic for a separate day.

## ASCII Encoding

ASCII is one of the simplest and most common encodings currently in use. It encodes 128 different characters i.e. assigns integer values to 128 different characters. 

[Click here to see the whole table](https://www.cs.cmu.edu/~pattis/15-1XX/common/handouts/ascii.html)

In a nutshell,

- `A` is represented as 65, `B` as 66, `C` as 67 ..... `Z` as 90
- `a` is represented as 97, `b` as 98, `c` as 99 ...... `z` as 122
- `0` is represented as 48, `1` as 49 ...... `9` as 57
- Other numbers represent things like space, enter key, backspace, symbols (+, -, etc.) escape sequences (newlines, tabs, null character, etc).
- Every ASCII encoded character takes exactly 1 byte of memory.

## Unicode Character Set

If you’ve heard anything about encoding, then you must’ve heard about `Unicode`. The need for `Unicode` arose because `ASCII` wasn’t designed to handle more than 128 characters. 

`ASCII` worked perfectly in the 60s and 70s as there were very few computers and even fewer groups using computers. But, with the advent of the internet, and the widespread adoption of computers in different parts of the world, encoding different character sets became a major requirement. For example, computers had no way of understanding Hindi characters like अ, आ, etc. We needed a way to encode them, and `Unicode` provided just that. It simply mapped a given character to some unique number.

**P.S.**: `Unicode` doesn’t contain every character from every language.

## UTF-8 encoding

As mentioned above, `Unicode` just maps a character to a number. It has no idea of how that number is stored in the computer. For example, let’s say we decide to 

- Represent `A` as 65
- Represent `आ` as 995.

Now, assuming a byte is an absolute unit of storage, You can store

- `A` using 1 byte and `आ` using 2 bytes. (As `65 < 256`, and `256 < 995 < 256 * 256` )
- both using 2 bytes. In this case, you’ll waste 1 extra byte while storing A

The point of this example was to show that one Unicode character can be stored in multiple ways. 

> UTF-8 is one of the ways to store Unicode characters. It is designed to encode millions of characters, while ASCII only encodes 128 characters.
> 

Another thing to note about UTF-8 is it is compatible with ASCII i.e. any ASCII encoded character is a valid UTF-8 encoded character.

**P.S.:** If you’re a software engineer or are really psyched up about encodings, you should definitely read this fantastic blog post

**[The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/)**

## `LC_` variables

Ever tried copy-pasting some non-English (let’s say Hindi) characters from some webpage to your terminal, or tried printing them to your console? You’ll notice that they’ll work. 

Who tells your system to expect `UTF-8` encoded characters, and more importantly, how can you change this behavior?

Let’s try to answer these questions with an experiment. 

1. Open a new terminal instance.
2. Copy 😂 to your terminal. 
    1. You’ll notice that the emoji gets copied perfectly.
3. Run `export LC_ALL=C` in your terminal.
4. Copy 😂 again and paste it into your terminal. 
    1. This time you’ll notice that emoji doesn’t get copied.
    2. Instead, something like `�<009f><0098><0082>` shows up.

P.S.: Yes, emojis are also characters having some `Unicode` representation 😛

So, what happened when we ran `export LC_ALL=C`? 

Unix/Unix-like systems have multiple environmental variables which control settings related to locale. Things like the format to show dates, the default currency, the default address format, telephone format, etc can be controlled using by setting these environment variables.  This also includes how to interpret and print characters on your terminal. 

These variables are initialized while installing your OS. If your OS is modern, then by default, they use some UTF-8 encoding. All of these variables can be set individually or can be set at once using the `LC_ALL` variable.

The moment you set `LC_ALL=C`, your system locale got changed from `UTF-8` to `C`, which is the simplest locale. It uses ASCII for encoding the characters. And since ASCII can’t represent 😂 (an emoji), you end up seeing the mysterious values.

Run `export LC_ALL=en_GB.UTF-8` in your terminal and copy 😂 again. This time you’ll see the emoji. Why? Because you changed your system locale back to `en_GB.UTF-8`, which uses UTF-8 encoding. (This assumes that you have `en_GB` locale available on your system.)

## Tying everything together: Speeding up `grep`

When you run 

```bash
grep ‘>’ in.fasta
```

without explicitly specifying any locale, `grep` assumes that the file `in.fasta` contains UTF-8 encoded characters. 

Instead, if you run

```bash
export LC_ALL=C
grep ‘>’ in.fasta
```

, `grep` assumes that `in.fasta` only contains ASCII characters, which is essentially true for most of the use cases in bioinformatics.

You may ask what’s the difference between these two cases? The answer lies in the number of characters encoded by UTF-8 and ASCII. UTF-8 encodes over a million characters, while ASCII encodes only 128. And hence, `grep` has to do a lot less processing when it knows that the file contains only ASCII data.

And due to this, just by simply adding an `export` statement, you can speed up your grep execution by over **500%**

In order to get a detailed benchmark report, you can [visit this link](https://www.inmotionhosting.com/support/website/speed-up-grep-searches-with-lc-all/)