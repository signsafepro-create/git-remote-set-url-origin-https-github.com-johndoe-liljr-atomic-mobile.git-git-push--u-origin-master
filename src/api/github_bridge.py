from fastapi import APIRouter, Request, HTTPException
import requests
import os

router = APIRouter()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # Set this in your .env file

@router.post("/api/github-webhook")
async def github_webhook(request: Request):
    payload = await request.json()
    # Basic validation (add more as needed)
    if not payload.get("repository"):
        raise HTTPException(status_code=400, detail="No repository info")
    repo_url = payload["repository"]["html_url"]
    branch = payload.get("ref", "").split("/")[-1]
    commits = payload.get("commits", [])
    # Example: print info (replace with your logic)
    print(f"Received push to {repo_url} on branch {branch}")
    for commit in commits:
        print(f"Commit: {commit['id']} - {commit['message']}")
    # Respond OK
    return {"status": "received", "repo": repo_url, "branch": branch}

# Example: function to push code back to GitHub (use requests or PyGithub)
def push_code_to_github(repo, branch, file_path, content, commit_message):
    url = f"https://api.github.com/repos/{repo}/contents/{file_path}"
    headers = {"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}
    data = {
        "message": commit_message,
        "content": content,  # base64-encoded
        "branch": branch
    }
    r = requests.put(url, headers=headers, json=data)
    return r.json()
