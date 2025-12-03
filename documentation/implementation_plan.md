# Awwwards Upgrades Implementation Plan

## Goal
Elevate the website's visual appeal and functionality to "Awwwards" standards.

## Proposed Changes

### 1. Visual Polish (Animations)
#### [NEW] [animations.ts](file:///c:/Users/USER/Dev/tiktok%20website/d.o.c-wash/utils/animations.ts)
- Create reusable GSAP animation utilities:
    - `fadeUp`: Standard fade-in from bottom.
    - `staggerChildren`: Staggered reveal for lists.
    - `magneticButton`: Mouse-following effect for buttons.
    - `textReveal`: Character/Word reveal animation.

#### [MODIFY] [App.tsx](file:///c:/Users/USER/Dev/tiktok%20website/d.o.c-wash/App.tsx)
- Wrap main sections in animation triggers.

#### [MODIFY] [Hero.tsx](file:///c:/Users/USER/Dev/tiktok%20website/d.o.c-wash/components/Hero.tsx)
- Enhance existing animations with more sophisticated easings and text reveals.

### 2. Social Proof (Testimonials)
#### [NEW] [Testimonials.tsx](file:///c:/Users/USER/Dev/tiktok%20website/d.o.c-wash/components/Testimonials.tsx)
- Create a new section component.
- Features:
    - Infinite scroll or carousel of reviews.
    - Star ratings.
    - Client avatars (using placeholders or generated images).

#### [MODIFY] [App.tsx](file:///c:/Users/USER/Dev/tiktok%20website/d.o.c-wash/App.tsx)
- Import and render `Testimonials` component.

### 3. Functionality (Email Notifications)
#### [MODIFY] [SmartQuote.tsx](file:///c:/Users/USER/Dev/tiktok%20website/d.o.c-wash/components/SmartQuote.tsx)
- Integrate `emailjs-com` (or similar client-side library) to send quote details to the business owner.
- *Note: Will require User to provide EmailJS service ID/template ID, or we can mock it for now.*

### 4. Content (Service Pages)
#### [NEW] [ServiceDetail.tsx](file:///c:/Users/USER/Dev/tiktok%20website/d.o.c-wash/components/ServiceDetail.tsx)
- Template for individual service pages.
- *Note: Requires setting up React Router if not already present, or simple conditional rendering.*

## Execution Order
1.  **Animations**: High visual impact, relatively low risk.
2.  **Testimonials**: Adds content and trust.
3.  **Email**: Functional improvement.
4.  **Service Pages**: Content expansion.

## Verification
- Visual check of animations in browser.
- Verify testimonial carousel functionality.
- Test email sending (mock or real).
