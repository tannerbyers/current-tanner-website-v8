---
title: "2026 Coding Workflow "
description: >
  I've used a lot of different coding tools over the years, some by choice, most
  forced by companies to improve my productivity. I've used Kiro, Github
  Copilot, Warp, Aider, and am preparing to try out Open Code. This post is a
  collection of my thoughts and what I look for to improve my dev experience (my
  highest priority) 
date: 2026-03-21
tags:
  - development
  - ai
lastModified: 2026-03-21
draft: true
---
## What I look for 



### Separation of concerns via agent/model selection

When tools handle multiple task types in the development process with one agent, you get expensive token usage and subpar coding output. This is a result of bad coding practice. The context fills up quickly and this causes the subsequent code changes to become worse and worse (introducing more bugs).\
\
 It's much better to keep **code edit agents** small, dumb, and cheap where possible. They should only edit file contents and should not need lots of context for things like docs, project structure, etc. \
The **architect or chat agent** should use a more expensive and smarter model to determine acceptances criteria, identify gaps and break down tasks. This is what you will use to get your idea or ticket into a workable requirement for an ai coding agent to execute. \
I also like to have
