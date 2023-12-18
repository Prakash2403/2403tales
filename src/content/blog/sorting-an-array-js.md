---
author: Prakash Rai
pubDatetime: 2023-10-22T12:13:24Z
title: "JS Quirks: Sorting array of numbers"
featured: true
draft: false
tags:
  - JS
description:
    Sorting numbers in JS isn't as straightforward as you think. You'll have to explicitly pass a comparator.
---


**TL;DR:** If you’re trying to sort an array of numbers in JS, pass a comparison function. Otherwise, it will consider the datatype of elements as a `string` and will sort based on the first character (So basically, `12` will come before `2`). Here’s how you pass a comparison function

```jsx
idx =  [12, 3, 1,2, 9]
idx.sort((a, b) => a - b) // Sorts in ascending order
```

## Background

Imagine sitting on your chair, developing a UI for your client. Work is progressing at a steady pace, and you’re trying to figure out a way to optimize the rendering of a component.

Suddenly it hits you that if you sort the array you’re sending to your component, then you might be able to reduce the rendering time and improve the UX simultaneously. So you fold your shirt and get started on the task.

## Problem Statement

The task is very simple. Given an array

```jsx
ids = [12, 3, 1, 2, 9]
```

Sort it and pass it to your component

```jsx
<YourComponent id_list={ids.sort()}/>
```

The above snippet should do the job. Right? The code looks intuitive, and I checked `sort` function returns the sorted array. So it should work. But it doesn’t! Something fishy happens. For some reason, `12` comes between `1` and `2`. I should also mention that most of my inputs were in the range 1 - 10, and it was unlikely to encounter a number greater than 10 (they were page numbers if you’re curious).

## The hustle

Based on the output, it was obvious that the array was sorted in lexicographic order. But why? I double-checked the API response, and it was returning integers. I double-checked the code fetching the API response, it wasn’t doing any explicit `type` conversions. I checked the involved components and didn’t find any explicit `type` conversions there too.

Finally, being frustrated after 2 hours of debugging, I just opened by browser console and ran these

```jsx
idx =  [12, 3, 1,2, 9]
new_idx = idx.sort()
console.log(new_idx)
```

To my awful surprise, I found this as output

```jsx
[1, 12, 2, 3, 9] 
```

WTF JS! WTF. Why tf you are sorting an integer array lexicographically?

## Solution

I never got the answer to the `Why?` JS chooses to do this, but I found out the way to sort numerical arrays correctly. While calling the `sort` function, you have to pass a comparator (The good old `Java` way). So, the correct syntax would be

```jsx
idx = [12, 3, 1,2, 9]
new_idx = idx.sort((a, b) => a - b)
console.log(new_idx)
```

which gives the correct output

```jsx
[1, 2, 3, 9, 12]
```

### Comparator

As the name suggests, Comparator is a function used to *compare* the elements of the array. In the above example, the comparator was 

```jsx
(a, b) => a - b
```

If the output of the comparator is negative, then it means that `a` is lesser than `b`, and hence `a` should come before `b` in the sorted array. Conversely, if it is positive, then `a` is greater than `b`, and `a` should come after `b` in the sorted array.

E.g.: Consider

```jsx
x = [1, 12, 2]
```

as input, and 

```jsx
(a, b) => a - b
```

as our comparator. Here are the possible comparisons

```jsx
// Showing all comparisons for sake of clarity. 
// Under the hood, sorting algorithm won't run the comparator on all possible pairs
(1, 12) => -11
(2, 12) => -10
(1, 2) => -1
```

The above comparisons tell us that 

- 1 will come before 12
- 2 will come before 12
- 1 will come before 12

Hence, the final answer you will get is

```jsx
[1, 2, 12]
```

Now, just for fun, let’s tweak the comparator to this

```jsx
(a, b) => b - a // Any guesses on how it will affect the output?
```

For the same input, we will get the following comparisons

```jsx
(1, 12) => 11
(2, 12) => 10
(1, 2) => 1
```

Based on this, we can conclude that

- 1 will come after 12
- 2 will come after 12
- 1 will come after 2

Hence the final answer, in this case, will be

```jsx
[12, 2, 1]
```

which is the input array sorted in descending order.

## Conclusion

Ideally, JS should’ve sorted an array numerically if all the elements were numbers. But that’s not something in our control. So we have to work with the tools we have. Comparators give us a powerful way of controlling the order of elements after sorting. Knowing how (and when) to use them may save you from writing a few extra lines of code, and maybe a few hours of debugging and cursing at JS.