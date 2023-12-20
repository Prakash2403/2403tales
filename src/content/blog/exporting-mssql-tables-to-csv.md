---
author: Prakash Rai
pubDatetime: 2023-12-20T19:27:24
title: "Exporting MSSQL tables to CSV/JSON"
featured: true
draft: false
tags:
  - Databases
  - MSSQL
  - Parquet
  - Snippets
  - Polars
description:
    MSSQL doesn't provides any straightforward CLI utilties to export data in common formats like CSV or JSON. To tackle this, I developed a script using polars library in Python.
---

MSSQL doesn't provides any straightforward CLI utilties to export data in common formats like CSV or JSON. To tackle this, I developed a script using `polars` library in Python.

```python
import polars as pl

HOST = "172.17.0.2" # URL/IP Address of your server
PORT = 1433
DB = "master" # Add your DB name here

# === Sensitive Info ===
# Ensure that your username and password are URL encoded.
# See the following issue.
# https://github.com/pola-rs/polars/issues/12645
#
# Example: If your password is User#123, then you have to ensure that # is encoded
# Ultimately, you'll set
# PASS = "User%23123"
# where %23 is URL encoding of #
USER = "your username here"
PASS = "your password here"
# === Sensitive Info ===

conn_str = f"mssql+pymssql://{USER}:{PASS}@{server}/{database}"

query = "SELECT *  FROM Mytable";

out = pl.read_database_uri(query=query, uri=conn_str)
out.write_parquet('merged-view.parquet')
out.write_csv('merged-view.csv')
out.write_json('merged-view.json', row_oriented=True)
```
