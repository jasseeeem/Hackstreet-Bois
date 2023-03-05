from pygooglenews import GoogleNews
import praw
from youtubesearchpython import VideosSearch


def get_results(keywords):
    gn = GoogleNews(lang='en')
    query = ""
    for k in keywords:
        query += k
    search_results = gn.search(query)

    reddit = praw.Reddit(client_id='byCXCGILzTve4EqH6-7noQ', client_secret='97_Du9zOMBbyF3iFy5z52b27JCiXAA', username='Player2er0', password='Batman1234', user_agent="testscript by u/Player2er0")

    subreddit = reddit.subreddit('news')

    search_results_reddit = subreddit.search(query)

    redditlinks = []
    youtubelinks = []
    links = []
    count = 0

    videosSearch = VideosSearch(query, limit = 5)

    for videos in videosSearch.result()['result']:
        youtubelinks.append([videos['title'], videos['link']])

    for entry in search_results_reddit:
        try:
            redditlinks.append([entry.title, "https://www.reddit.com" + entry.permalink])
            count += 1
        except:
            pass
        if count == 5:
            break
    
    for entry in search_results['entries']:
        try:
            links.append([entry.title,entry.link])
            count += 1
        except:
            pass
        if count == 12:
            break
    return links, redditlinks, youtubelinks