# Railway Backend Deployment Instructions

## 1. Prerequisites
- Ensure you have a Railway account: https://railway.app/
- Install Railway CLI (optional, for local dev): https://docs.railway.app/develop/cli
- Your backend code is in the `liljr-backend` folder

## 2. Project Initialization
1. Go to https://railway.app/
2. Click "New Project" > "Deploy from GitHub repo"
3. Connect your GitHub account and select your repo
4. Set the root directory to `liljr-backend` if prompted

## 3. Environment Variables
- Add all variables from `liljr-backend/.env` to the Railway project settings:
  - `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `OWNER_UNLOCK_PHRASE`, `OWNER_EMAIL`, `SMTP_USER`, `SMTP_PASS`, etc.
- Use Railway’s PostgreSQL plugin or connect your own DB
- Update `DB_HOST` to Railway’s internal host for production

## 4. Deploy
- Railway will auto-detect and deploy on push to `master` (or main)
- Confirm build logs show success
- Test endpoints using the deployed Railway URL

## 5. Local Development
- Use Railway CLI or `.env` with public DB URL for local dev

## 6. Monitoring & Alerts
- Ensure email alerts are configured (see `.env`)
- Watchdog will send alerts to `OWNER_EMAIL`

## 7. Troubleshooting
- Check Railway logs for errors
- Confirm all env vars are set
- Test health endpoint `/health` for status

---

**After deployment, update the checklist and mark this step complete.**
