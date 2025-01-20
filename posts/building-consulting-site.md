---
title: Building my consulting site
description: A documented thought process behind how I build websites.
date: 2024-04-24
tags: [learning, consulting]
layout: layouts/post.njk
---

# Choosing the Tech Stack and Deployment Strategy for My Consulting Business Landing Page

## Introduction
Building a landing page is one of the first steps to establishing an online presence for any business. For my tech consulting business, the goal was to create a simple, cost-effective, and professional site that could grow with my needs (currently 0 but can grow to atleast 1000's of requests). Here's how I approached selecting the tech stack, deployment strategy, and management process.

---

## Defining the Requirements
Before choosing the tech stack, I outlined the primary requirements:
- **Accessible**: This is a priority for me as someone who builds tech every day. Color contrast, simple design, keyboard navigatable, sound-off design.   
- **Performance**: Fast load times for better user experience and SEO. We're going for under 1 second but we'll optimize throughout as needed.
- **Scalability**: Handle traffic growth with minimal adjustments. Big on the minimal adjustments. I dont want to mess with any UI's other than allowing certain charge thresholds to be allowed, which shouldn't happen with only 1000's of site visitors on a static site (ty caching).
- **Mobile-First Design**: Optimized for all screen sizes. This is a must for any public facing site.
- **Cost-Effectiveness**: Affordable yet robust solutions. No brainer for landing page site. 
- **Integration**: Compatibility with analytics and marketing tools. Although I highly value priacy, a website without analytics is a personal site. If you're running a business, you must know your customers, BUT only as much as they reasonably woud like to share. I like to track # of visits, locale of visitor, duration on page, & CTA clicked. 
- **Enjoyable Development Feedback**: I wanted development be simple and the time from deploy to updated content to be fast and update cache

---

## Choosing the Tech Stack

### Development & Deploy
- **Decision**: Store code in github with github actions to deploy terraform to AWS for S3 hosting and cloudfront for caching. 
- **Reasoning**: 
  - AWS is my preferred compute and storage provider and the services used should be fast and within free tier.

### Frontend
- **Decision**: Gatsby. 
- **Reasoning**:
  - Usually would pick HTML for landing page but I have a lot of accessibility and integrations I would like to use and not a lot of time so I decided to go with Gatsby due to it's huge plugin support.

### Hosting
- **Decision**: AWS S3 + CloudFront
- **Reasoning**:
  - Scalable and low-cost distribution with caching and auditing, included.

### Security Considerations
- Ensuring HTTPS with CloudFront.
- IAM policies for managing access during deployment.
- Audit log and live monitoring for all interactions with infrastructure and exceeding performance, error & cost thresholds.

---
Will add architecture diagrams soon
---

### Analytics Integration
- Posthog looks really cool so I'll be trying it for monitoring performance and user traits. 

### Future Scalability
- Gatsby support makes it easy to extend this in many directions (blogging or maybe authentication)!

## Conclusion
A thoughtfully designed tech stack and deployment strategy are critical for any project, especially for a business landing page. This approach ensures scalability, performance, and maintainability, aligning with the needs of a growing consulting business.

If you're looking for a similar setup or need help modernizing your tech stack, feel free to reach out!

