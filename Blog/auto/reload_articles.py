import os, json
class Config:
	ROOT_PATH = r"D:\workspace\Projects_web\Blog\leawind.github.io\Blog"
	article_path = r"markdown"
	txt_path = r"html"
	list_path = r"script/list.txt"

	def __init__(self):
		pass


def main():
	con = Config()
	os.chdir(con.ROOT_PATH)
	file = open(con.list_path, mode="w", encoding="utf-8")
	for path, dirs, files in os.walk(con.article_path):
		for fileName in files:
			filePath = os.path.join(path, fileName)
			assert os.path.isfile(filePath)
			fileTitle, fileType = fileName.rsplit('.', 1)
			dfPath = filePath.replace(con.article_path, con.txt_path) + ".txt"
			ddirPath = os.path.dirname(dfPath)
			print(ddirPath)
			if not os.path.exists(ddirPath):
				os.makedirs(ddirPath)
			os.system("copy %s %s" % (filePath, dfPath))
			file.write(dfPath+'\n')
	file.close()



if __name__ == "__main__":
	main()
