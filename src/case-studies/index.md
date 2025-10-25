---
layout: layouts/base.njk
title: Projects | Tanner Byers Portfolio
description: Real projects and technical builds from Tanner Byers. AWS architectures, fullstack applications, and lessons learned from production systems.
templateClass: tmpl-post
eleventyNavigation:
  key: Projects
  order: 8
---

# Projects

Real builds, real code, real lessons. Here's what I've shipped and what I learned along the way.

---

## MogulPlex: Building a Collaborative Platform from Scratch

**Timeline:** 6 weeks  
**Stack:** React, Node.js, WebSockets, AWS

### What I Built
Collaborated on a fullstack web application for business collaboration, taking it from concept to working MVP that placed in a competition and got accepted into an accelerator.

**Key Technical Features:**
- Full-stack web application with JWT authentication
- Real-time collaboration using WebSockets
- Responsive React UI optimized for desktop and mobile
- Automated testing and CI/CD pipeline

### What I Learned
- Balancing rapid development with maintainable architecture
- Building real-time features that scale
- The importance of automated testing when moving fast
- How to scope an MVP that delivers value quickly

---

## Healthcare Platform: Infrastructure as Code Migration

**Timeline:** 4 weeks  
**Stack:** Terraform, AWS (EC2, RDS, CloudWatch), GitLab CI/CD

### The Challenge
Manual deployments taking 2+ hours, AWS costs climbing 40% month-over-month, and production deployments that felt like Russian roulette. Time to rebuild the foundation.

### What I Built
- Complete Infrastructure as Code setup with Terraform
- Automated CI/CD pipeline with proper staging environment
- AWS resource optimization and cost monitoring
- Centralized logging and alerting with CloudWatch

### The Impact
- **Deployment time:** 2+ hours → 8 minutes
- **AWS costs:** Reduced by 35% monthly
- **Incident response:** Rollbacks in under 2 minutes
- **Developer confidence:** Team could deploy without anxiety

### What I Learned
- How to audit and optimize AWS infrastructure systematically
- The value of staging environments that actually mirror production
- Cost optimization strategies for startup-scale AWS usage
- Building deployment pipelines that developers trust

---

## Enterprise Spring Boot Modernization

**Timeline:** 3 weeks  
**Stack:** Java, Spring Boot, JUnit, Maven

### The Challenge
A 5-year-old Spring Boot application with a 45-minute test suite. Developers were afraid to make changes, and "works on my machine" was the unofficial deployment strategy.

### What I Did
- Refactored to clean architecture with proper separation of concerns
- Optimized test suite (45 minutes → 8 minutes)
- Set up automated code formatting and linting
- Created comprehensive documentation and runbooks

### The Impact
- **Test execution:** 82% faster
- **Development velocity:** 40% more features shipped per sprint
- **Bug reports:** Down 60%
- **Team confidence:** Developers comfortable making significant changes

### What I Learned
- How to identify and eliminate slow tests systematically
- Strategies for refactoring legacy code without breaking everything
- The importance of automated standards for team consistency
- Documentation that actually helps the next developer

---

Questions about any of these projects? Email **programtanner@gmail.com**
