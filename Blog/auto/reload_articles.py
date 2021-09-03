import os, json
class Config:
	article_path = r"markdown"
	def __init__(self, homePath):
		self.article_path = os.path.join(homePath, self.article_path)


def main():
	con = Config(r"D:\workspace\Projects_web\Blog\leawind.github.io\Blog")
	articles = os.listdir(con.article_path)
	for atc in articles:
		atcDir = os.path.join(con.article_path, atc)
		if not os.path.isdir(atcDir):
			continue
		print(atc)

if __name__ == "__main__":
	main()
