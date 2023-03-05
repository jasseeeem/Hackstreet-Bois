import requests
from bs4 import BeautifulSoup

def get_website_score(url, keywords):
    """
    Returns a score for a news website based on the number of times the input keywords appear in its homepage.
    """
    html = requests.get(url, timeout=10).text
    soup = BeautifulSoup(html, 'html.parser')
    text = soup.get_text().lower()
    score = 0
    print(keywords)
    for i in range(len(keywords)):
        weight = 1 + 0.1 * i
        count = text.count(keywords[i].lower())
        score += weight * count
    return score

def get_youtube_score(url, keywords):
    """
    Returns a score for a YouTube video based on the number of times the input keywords appear in its title and description.
    """
    api_key = 'AIzaSyDVBc-1gOsGEL5akl5xiR3FNBVBKAfSVFE'
    video_id = url.split('=')[1]
    response = requests.get(f'https://www.googleapis.com/youtube/v3/videos?id={video_id}&key={api_key}&part=snippet')
    data = response.json()
    snippet = data['items'][0]['snippet']
    title = snippet['title'].lower()
    description = snippet['description'].lower()
    score = sum([title.count(keyword.lower()) + description.count(keyword.lower()) for keyword in keywords])
    return score

def rank_media(media_list, keywords):
    """
    Ranks a list of news websites and YouTube videos based on the number of times the input keywords appear in their content.
    """
    scores = {}
    for media in media_list:
        try:
            score = get_website_score(media, keywords)
            scores[media] = score
        except Exception as e:
                print(f"Error processing {media}: {e}")
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:5]
    sorted_scores = [x[0] for x in sorted_scores]
    return sorted_scores

def rank_media_yt(media_list, keywords):
    """
    Ranks a list of news websites and YouTube videos based on the number of times the input keywords appear in their content.
    """
    scores = {}
    _media_list=[]
    for media in media_list:
        try:
            score = get_youtube_score(media[1], keywords)
            _media_list.append([media[0],media[1],score])
        except Exception as e:
                print(f"Error processing {media}: {e}")
    sorted_scores =sorted(_media_list, key = lambda person: person[2])
    return sorted_scores