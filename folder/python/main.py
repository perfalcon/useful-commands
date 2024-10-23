# This program prints Hello, world!
    
import yt_dlp as youtube_dl # client to many multimedia portals

# downloads yt_url to the same directory from which the script runs
def download_audio(yt_url):
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([yt_url])

def main():
    yt_url = "https://www.youtube.com/watch?v=8OAPLk20epo"
    download_audio(yt_url)

main()


#"https://www.youtube.com/watch?v=g0sEaN8-f4o"
#https://stackoverflow.com/questions/75495800/error-unable-to-extract-uploader-id-youtube-discord-py

#cmd : yt-dlp <url>