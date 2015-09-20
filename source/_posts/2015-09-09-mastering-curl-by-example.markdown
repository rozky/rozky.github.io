---
layout: post
title: "Mastering cURL by example"
date: 2015-09-09 19:13:57 +0100
comments: true
published: true
categories: curl bash cli http proxy example 
---

This is a list of cURL commands I found myself using regularly. More examples with deeper explanation can be 
found [here](http://curl.haxx.se/docs/httpscripting.html) 

### If you find yourself sitting behind a proxy

If you find yourself on a computer that is sitting behind a proxy:

```bash
curl --proxy http://proxy.example.org:4321 http://remote.example.org/
```

### Form submit with data url-encoded manually

Simulates a form submission by `POST` with `application/x-www-form-urlencoded` content type and data url-encoded by you. 

```
curl -d "year=1905&name=You+Me" http://www.example.com/form-submit
```

### Form submit with data url-encoding automatically

Simulates a form submission by `POST` with `application/x-www-form-urlencoded` content type and data url-encoded by curl itself. 

```
curl --data-urlencode "name=Joe Me" http://www.example.com/form-submit
```

### POST with JSON body
```
curl -H "Content-Type: application/json" -d "{'happy': 'yes'}" http://www.example.com/json
```

### Take a body from stdin

```bash
echo '{"text": "Hello **world**!"}' | curl -d @- https://api.github.com/markdown
```

### Output HTTP status only

```bash
curl  http://www.google.com -sL -w "%{http_code}\\n" -o /dev/null
```

The key flat here is ```-w``` which prints the report using a custom format. Here is a list of available custom variables:

    url_effective
    http_code
    http_connect
    time_total
    time_namelookup
    time_connect
    time_pretransfer
    time_redirect
    time_starttransfer
    size_download
    size_upload
    size_header
    size_request
    speed_download
    speed_upload
    content_type
    num_connects
    num_redirects
    ftp_entry_path

### Check status of multiple URLs

```bash
for i in gumtree bbc; do curl  http://www.$i.com -sL -w "%{http_code} %{url_effective}\\n" -o /dev/null; done
```

Outputs:
```
200 https://www.gumtree.com/
200 http://www.bbc.com/
```

