from pygooglenews import GoogleNews
import newspaper

def get_results(keywords):
    gn = GoogleNews(lang='en')

    query = ""
    for k in keywords:
        query += k
    search_results = gn.search(query)

    count = 0

    contents = []
    links = []
    for entry in search_results['entries']:
        try:
            links.append(entry.link)
            count += 1
        
        except:
            pass

        if count == 10:
            break
    print(len(links))
    return links