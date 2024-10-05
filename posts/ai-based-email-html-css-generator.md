---
title: Building an AI based Email HTML/CSS Generator SaaS
description: This blog post will go over the design decisions and though process while building my first AI based SaaS.
date: 2021-08-06
tags: SaaS, AI, Business
layout: layouts/post.njk

---

# 
This blog post will go over the design decisions and though process while building my first AI based SaaS.

## Problem Statement
Finding & changing email client responsive E-mail templates (HTML & CSS) is time intesneive and requires specialized skill
to make properly responsive templates. 

There are no other email tempalte generators that leverage AI.

## Pitch
Effortlessly generate email templates with AI for platforms like Mailchimp, SendGrid, and ActiveCampaign, saving you time and money."

## Requirements for MVP
1. Support Chat with AI Agent
2. Supports HTML, CSS, & Handlebars generation and follows email responsive best practices
3. Support reverts after AI instruction or user change
4. Supports live preview in same page

### Requirements after first customer
1. Support live editing
2. Support section based on commands like "Update footer section with social links"



## Let's get building! 

First step to building great softare is getting (potential) customers with minimal work. The way to do this for micro-saas is a waitlist. 

I've defined the problem I'm solving and the core features I will need for MVP. 

Let's use this to create a landing page. I like hugo landing pages so I'm going to use this one I found: [hugoplate](https://github.com/zeon-studio/hugoplate)

![hugoplate template screenshot](hugoplate-template-screenshot.png)

We've got our template, lets get it deployed and then we can customize it. 
I'll be using netlify just because I don't want to think desiging a deployment solution.

![netlify dash](hugo-dash-screenshot.png)


If this marketing site get's over 2k visitors a month, I'll make a github action to build the project and put it on a cdn (static site generators are awesome.) to reduce cost and increase speed.

---

Alright we've got our template, let's use some creativity (and AI) to write new sections! 



