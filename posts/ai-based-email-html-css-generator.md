---
title: Building an AI based Email HTML/CSS Generator SaaS
description: This blog post will go over the design decisions and thought process while building my first AI based SaaS.
date: 2021-08-06
tags: SaaS, AI, Business
layout: layouts/post.njk

--- 

Follow my thought process while building my first AI based SaaS (a custom email html template generator)!

## Start with a Problem

Creating & changing email templates (HTML & CSS) requires coding knowledge as well as up to date specialized knowledge (email client limitations, responsive, & accessible design).

## My Pitch

Generate *good* email templates by chatting with specialized AI agent, saving you time and money.

## Requirements for MVP

1. Support Chat with AI Agent
2. Supports HTML, CSS, & Handlebars generation and follows email responsive best practices
3. Supports live preview in same page

### Features after first customer (if we get there)

1. Support live editing
2. Support customized assets (logos, company names, company products/features, company events, company socials)
3. Support section based commands like "Update 'left footer' section with our social links"
4. Revert last command
5. Change Tracking

## Let's get building

Normally I would jump straight to building the mvp because that's the most fun thing to do. However my previous experience building SaaS (thanks payfortime.io) tells me I should validate my market before spending hours building a lame product no one may wants. 

The quickest way to do this is a landing page w/ waitlist sign up page.

I like static site generators for this (I used [hugo](https://gohugo.io/)) since they're (usually) FREE, open source, and have lots of really nice templates with common web app patterns (landing page, blog, contact form, comments, analytics, themes) all set up for you. 

I'm going to use [hugoplate](https://github.com/zeon-studio/hugoplate)

![hugoplate template screenshot](hugoplate-template-screenshot.png)

We've got our template, lets get it deployed and then we can customize it.
I'll be using netlify just because it's free and I don't want to write code for deployment on a side project.

Easy setup, just import and run with default configurations found in template.

> **_NOTE:_**  If this marketing site get's over 2k visitors a month, I'll make a github action to build the project and put it on a cdn (static site generators are awesome.) to reduce cost and latency.

## Let's get configuring

Alright we've got our template, let's configure the base services. here's the ones I use:

- [Google analytics](analytics.google.com)
- [Formspree.io](www.formspree.io)

## Let's write some landing page sales copy

Now we use some creativity (and AI) to rewrite the placeholder landing page content with new text!

We can give a prompt like so and update the template content by reusing our requirements and success criteria

Before:

After:

You'll notice we added some illustrations as well. I have a few sites I use for free illustrations:

But make sure to check attributions and such.

### Adding Attribution page

Have to shout out the awesome work done by these folks who made this website so easy to look good.

template: <https://github.com/zeon-studio/hugoplate>
images: <https://storyset.com/email>

### Now we use the AI to make the AI

We'll use chatgpt to create basic project for mvp purposes. I provide the stack and it provdes the commands & code.

Chat gpt prompt

```

```

Modify MVP as needed to get working example.

Let's record a demo and post on twitter:

[screen recording]()

---

## Let's dive into metrics/analytics

**Key Metrics I'll Be Tracking**

To validate demand and gauge whether I’m on the right track, I'll closely monitor these metrics. They’ll inform whether to proceed with development or pivot the approach if needed.

| Metric                    | Description                                            | Formula                                      |
|----------------------------|--------------------------------------------------------|----------------------------------------------|
| Visitors                   | Total landing page visitors                            | Sum(Visitors)                                |
| Conversion Rate            | % of visitors who sign up                              | (Sign-ups / Visitors) * 100                  |
| Referral Rate              | % of users who referred others                         | (Referrals / Sign-ups) * 100                 |
| CTA Conversion Rate        | % of clicks on CTAs leading to sign-ups                | (CTA Clicks / Visitors) * 100                |
| Bounce Rate                | % of visitors leaving without interacting              | (Bounces / Visitors) * 100                   |

These metrics will give me a clear picture of whether the product’s value proposition resonates with the people who would actually pay for it.

---

**Timeline for Validation**

I'll validate the MVP over a 30-day period, aiming to achieve 250 visitors per week with 20-50 signups overall. This structured timeline ensures I gather enough data to make informed decisions about the product’s future. Here’s how I’m breaking it down:

| Week | Target Visitors | Target Signups (Low) | Target Signups (High) |
|------|-----------------|----------------------|-----------------------|
| 1    | 250             | 5                    | 13                    |
| 2    | 500             | 10                   | 25                    |
| 3    | 750             | 15                   | 38                    |
| 4    | 1000            | 20                   | 50                    |

If I’m trending below these sign-up numbers, I’ll assess the product positioning and outreach strategies before building more features. If signups exceed 50, I’ll dive into the next phase of feature development with confidence, knowing I’m building for a validated need.

---

**Next Steps: Feedback Loops and Iteration**

Once I hit the target signups, I’ll begin opening the product up to the waitlist in small batches, ensuring that I collect detailed feedback. These users will help me refine core features before expanding further.

- **Collect qualitative feedback**: I'll focus on in-depth feedback from the initial users. Understanding what they like, what’s missing, and where they hit friction will help prioritize feature iterations.
  
- **Measure usage patterns**: I'll track which features users engage with most to inform which parts of the product to scale up. A key lesson in micro-SaaS is staying lean—only building what users actually need and will pay for.

## Conclusion

I had fun building this mvp and got to feel the power of AI in quickly building a PoC. This may not be production ready but it works and its deployed and I had fun doin it.
