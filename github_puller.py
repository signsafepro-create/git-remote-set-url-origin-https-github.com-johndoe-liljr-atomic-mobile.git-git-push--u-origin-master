from github import Github
import os

class MyGitHubConnection:
    def __init__(self, token, repo_name):
        self.token = token
        self.gh = Github(self.token)
        self.repo = self.gh.get_repo(repo_name)

    def scan_directory(self, path=""):
        contents = self.repo.get_contents(path)
        for item in contents:
            if item.type == "dir":
                self.scan_directory(item.path)
            else:
                file_content = item.decoded_content.decode("utf-8")
                print(f"Pulled: {item.path}")
                self.analyze_code(item.path, file_content)

    def analyze_code(self, file_path, content):
        print(f"Analyzing {file_path} ({len(content)} chars)")
        # Add your code analysis/optimization logic here

    def watch_for_push(self):
        latest = self.repo.get_commits()[0]
        print(f"Watching {self.repo.full_name}, latest commit: {latest.sha}")
        # Extend: Poll or use webhook for auto-pull on new commit

# --- Quick setup ---
# Replace with your GitHub token
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "YOUR_GITHUB_TOKEN")
REPO_NAME = "signsafepro-create/git-remote-set-url-origin-https-github.com-johndoe-liljr-atomic-mobile"

if __name__ == "__main__":
    conn = MyGitHubConnection(GITHUB_TOKEN, REPO_NAME)
    conn.scan_directory()
    conn.watch_for_push()
