---
layout: post
title: "Git basic usage"
date: 2015-08-30 23:02:57 +0100
comments: true
categories: git 
published: false
---

For a purpose of this blog post I have create a git repository with single file in it which should provide me enough 
complexity to play with. `git clone https://github.com/rozky/git-basics.git`

### Clean up unused local branches
### Clean up unused remote branches

### Unstage staged files

### Squash commits

### Discard locally committed change that were not pushed 

### Discard all uncommitted changes
***Given:*** An working directory with 2 modified files ***unstagged***

``` bash mark:1
git-basics$ git status -s
 M one.txt
 M two.txt
```

***When:*** You want to discard changes made to those files

***Do:*** ***`git checkout .`***
``` bash
git-basics$ git checkout .
git-basics$ git status -s
On branch master
Your branch is up-to-date with 'origin/master'.

nothing to commit, working directory clean
```

