from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os

GITHUB_USERNAME = 'adityarp3'
GITHUB_API_URL = "https://api.github.com/users/"
BIO_TEXT = ''
GITHUB_TIMEOUT = 10

app = Flask(__name__)
CORS(app)

def github_fetch():
    try:
        user_response = requests.get(GITHUB_API_URL + GITHUB_USERNAME, timeout=GITHUB_TIMEOUT)
        if user_response.status_code == 200:
            user_data = user_response.json()
        else:
            user_data = {}

        repo_response = requests.get(GITHUB_API_URL + GITHUB_USERNAME + "/repos?sort=updated&per_page=12",
                                     timeout=GITHUB_TIMEOUT)
        if repo_response.status_code == 200:
            repo_data = repo_response.json()
        else:
            repo_response = {}

        projects = []
        for repo in repo_data:
            if not repo.get('fork', False):
                projects.append({
                    'name': repo.get('name', ''),
                    'description': repo.get('description', 'No Description Available.'),
                    'html_url': repo.get('html_url', ''),
                    'homepage': repo.get('homepage', ''),
                    'language': repo.get('language', 'Unknown'),
                    'stars': repo.get('stargazers_count', 0),
                    'forks': repo.get('forks_count', 0),
                    'topics': repo.get('topics', [])
                })
        total_stars = sum(p['stars'] for p in projects)
        total_repos = user_data.get('public_repos', 0)

        return {
            'name': user_data.get('name', GITHUB_USERNAME),
            'bio': user_data.get('bio', 'Developer passionate about creating amazing applications'),
            'location': user_data.get('location', ''),
            'avatar_url': user_data.get('avatar_url', ''),
            'github_url': user_data.get('html_url', f'https://github.com/{GITHUB_USERNAME}'),
            'followers': user_data.get('followers', 0),
            'public_repos': total_repos,
            'total_stars': total_stars,
            'projects': projects
        }
    except Exception as e:
        print(f'Fetching GitHub Data Error: {e}')
        return {
            'name': GITHUB_USERNAME,
            'bio': BIO_TEXT,
            'location': '',
            'avatar_url': '',
            'github_url': f'https://github.com/{GITHUB_USERNAME}',
            'followers': 0,
            'public_repos': 0,
            'total_stars': 0,
            'projects': []
        }

@app.route("/api/portfolio")
def get_portfolio():
    github_data = github_fetch()

    portfolio = portfolio = {
        **github_data,
        'title': 'Computer Science/Math Student',
        'email': 'apardeshi134@gmail.com',
        'skills': [
            'Python', 'C', 'C++', 'Flask', 'Java'
            'Git', 'NumPy', 'SciKitLearn', 'Pandas',
            'Matplotlib', 'SQL', 'PostgreSQL', 'FastAPI',
            'React'
        ]
    }

    return jsonify(portfolio)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join('build', path)):
        return send_from_directory('build', path)
    else:
        return send_from_directory('build', 'index.html')

if __name__ == '__main__':
    app.run(debug=True)