from pygooglenews import GoogleNews
import newspaper

def get_results():
    gn = GoogleNews(lang='en')

    search_results = gn.search('Covid lab leak')

    count = 0

    contents = []
    links = []
    for entry in search_results['entries']:
        try:
            links.append(entry.link)

            # Retrieve HTML content of the article
            # article = newspaper.Article(entry.link)
            # article.download()
            # article.parse()
            # paras = []
            # for para in article.text.split("\n\n"):
            #     if para.endswith('.'):
            #         paras.append(para)
            # contents.append(paras)

            count += 1
        
        except:
            pass

        if count == 10:
            break
    return links