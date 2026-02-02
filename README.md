# Job Portal

This is simple Job Portal application built using Express ts and React js

## Required Features

- The portal should allow sign ups for new recruiters and candidates.

- The existing users (both recruiters and candidates) should be able to sign in.

- The sign up process should be different for recruiters and candidates, asking relevant information depending upon the role.

- The sign up can be email and password enabled, but sign in can also be done using email OTP.

- There should be different dashboards for recruiters and candidates (landing page).

- The recruiters should be able to create new postings allowing them to enter details like job title, eligibility, experience required, job description, etc.

- The candidates should be able to apply to job postings.

- The recruiter should have a separate dashboard to shortlist candidates who have applied, and mark the candidates as shortlisted/not shortlisted.

- The candidates should have a separate dashboard to get a list of applications submitted so far along with the current status of their application.

## Backend

### Database Entities

1. Users

2. Recruiter Specific Details (One to One Relationship with Users)

3. Candidate Specific Details (One to One Relationship with Users)

4. Job Postings (One to Many Relationship with Users)

5. Job Applications (Many to Many Relationship between Job Postings ans Users)

### APIs

1. Sign Up (for both Recruiters & Candidates)

2. Login via Password

3. Request OTP on Email for Login

4. Resend OTP

5. Verify OTP

6. Create Job Postings (for Recruiters)

7. .
