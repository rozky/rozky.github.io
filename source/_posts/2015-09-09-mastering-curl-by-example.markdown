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

### Behind proxy

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

### POST request with JSON body
```
curl -H "Content-Type: application/json" -d "{'happy': 'yes'}" http://www.example.com/json
```

### Taking the request body from stdin

```bash
echo '{"text": "Hello **world**!"}' | curl -d @- https://api.github.com/markdown
```

