---
author: Prakash Rai
pubDatetime: 2023-09-27T12:13:24Z
title: Efficiently grouping SAM/BAM file by reference name using Awk
featured: true
draft: false
tags:
  - awk
  - biotech
  - shell scripting
description:
    A simple Awk oneliner to group SAM/BAM contents by reference names (or other fields).
---

## Target audience

- You must know what SAM/BAM file looks like
- You should know how `|` (pipe) works in `bash`
- You should know how `>` (output redirection) works in `bash`

## A quick introduction to awk

`awk` is a program which can be used to efficiently slice and dice structured tabular data. By default,

- It reads one record at a time and processes it. The default record separator is `\n` (newline). Though this can be changed, we won’t be discussing that here.
- It splits each record by `space`, which is default `Field Separator`. You can change `Field Separator` by providing `F` flag. This is useful to us, as records in a SAM file are separated by `\t`(tabs).

These two points are enough to get you started with `awk`. There are a couple of other things you should know too. I’ll use examples to demonstrate them.

## Example

### Input

Lets use following SAM file as input. Lets call it `sample.sam`.

```
@SQ SN:ref  LN:45
@SQ SN:ref2 LN:40
r001    163 ref 7   30  8M4I4M1D3M  =   37  39  TTAGATAAAGAGGATACTG *   XX:B:S,12561,2,20,112
r002    0   ref 9   30  1S2I6M1P1I1P1I4M2I  *   0   0   AAAAGATAAGGGATAAA   *
r001    83  ref 37  30  9M  =   7   -39 CAGCGCCAT   *
x1  0   ref2    1   30  20M *   0   0   aggttttataaaacaaataa    ????????????????????
x2  0   ref2    2   30  21M *   0   0   ggttttataaaacaaataatt   ?????????????????????
x3  0   ref2    6   30  9M4I13M *   0   0   ttataaaacAAATaattaagtctaca  ??????????????????????????
```

### Output

We expect our script to create two files * `ref.sam` which contains all the records where reference name is `ref` * `ref2.sam` which contains all the records where reference name is `ref2`

## Minimal hands on with `awk`

As mentioned earlier, `awk` reads and processes one record at a time. For each record, you use `$N` to refer to `Nth` field in your record.

Say if you want to extract the CIGAR string for each of the records in the above SAM file, you’ll use `$6`. Here’s a snippet for the same:

```
samtools view sample.sam | awk -F'\t' '{print $6}' > all-cigars
```

- `print` is an instruction which simply prints whatever arguments are passed to it.
- As mentioned earlier, `F` is a parameter used to specify the `Field Separator` for each record.

The above snippet will extract all the CIGAR strings and put them in a file named `all-cigars`

### Another important thing

As mentioned above, `$1` refers to 1st column, `$2` to second column etc.

**Similarily, `$0` refers to whole record**

## Final Code

**Tested on Ubuntu**

```
export samfile="sample.sam" # Replace sample.sam with whatever your SAM/BAM file name is.samtools view ${samfile} | awk -F'\t' '{print $0 > $3".sam"}'
```

### Explanation

- We have moved the `>` (output redirection) inside `awk`.
- We are redirecting the output to `$3.sam`.
    - Notice the double quotes around `.sam`.
    - They’re just a marker for `awk` to treat `$3` and `.sam` as different entities.

So ultimately, we’re simply writing `$0`, which represents the whole record (a whole line in this case), to `$3.sam`. Hence, * All the records where `$3` is `ref` will be written to a file named `ref.sam` * All records where `$3` is `ref2` will be written to a file named `ref2.sam`.

## Benchmarks

- It takes ~45 minutes to split a BAM file of 61GB on Intel® Xeon® E5-2698 v3, having clock speed 2.3GHz and turbo speed 3.0GHz. Number of cores doesn’t matter, as `awk` uses only one core at a time.
- Your I/O device might make a difference in runtime. SSDs will give you lower runtime as compared to traditional HDDs.
