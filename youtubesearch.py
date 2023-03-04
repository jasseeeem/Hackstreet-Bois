from youtubesearchpython import VideosSearch

query=('ATM,Robbery')

query = query.replace(',',' ')
query=query+' news'
print(query)
videosSearch = VideosSearch(query, limit = 2)
print(videosSearch.result())