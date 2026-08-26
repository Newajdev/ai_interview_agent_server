# AI Interview Backend

The backend API for the AI Interview Project. It is built with Express, TypeScript, Prisma, PostgreSQL, Groq, Cloudinary, and Nodemailer.

## Responsibilities

- Candidate and candidate profile persistence
- PDF CV extraction and image OCR
- Cloudinary CV storage
- Interview sessions, messages, timers, and completion
- Groq speech-to-text and text-to-speech
- Interview evaluation persistence
- SMTP interview report email delivery

## Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run dev
```

The server runs on the configured `PORT` and exposes `GET /health`.

## API Modules

- CV: `POST /api/cv/upload`, `POST /api/cv/analyze`
- Candidates: `GET|POST /api/candidates`, `GET|PATCH|DELETE /api/candidates/:id`
- Interviews: `POST /api/interviews`, `POST /api/interviews/:id/start`, `GET /api/interviews/:id`, `POST /api/interviews/:id/messages`, `POST /api/interviews/:id/answer`, `POST /api/interviews/:id/complete`
- Voice: `POST /api/voice/transcribe`, `POST /api/voice/synthesize`, `POST /api/voice/interview-response`
- Evaluation: `POST|GET /api/evaluations/:interviewId`
- Email: `POST /api/email/interview-report`

## Verification

```bash
npm run build
npx prisma validate
npx prisma migrate status
```

See the root [README](../README.md) for the complete project overview, environment variables, API table, and run instructions.
