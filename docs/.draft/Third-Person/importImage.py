"""

"""

from PIL import Image
import os

IMAGE_EXT_LIST = ['.png', '.jpeg', '.jpg', '.gif', '.bmp']
IMPORT_SOURCE = "./draft/gallery"
IMPORT_TARGET = "./gallery"

def isImageFile(file_path:str)->bool:
    if not os.path.isfile(file_path):
        return False
    return any(file_path.lower().endswith(ext) for ext in IMAGE_EXT_LIST)

def main():
    for dir, dirs, files in os.walk(IMPORT_SOURCE):
        for file_name in files:
            file_path = os.path.join(dir, file_name)
            if not isImageFile(file_path):
                continue
            relative_dir = os.path.relpath(dir, IMPORT_SOURCE)
            output_file_name = os.path.splitext(file_name)[0] + '.jpg'
            output_file_path = os.path.join(IMPORT_TARGET, relative_dir, output_file_name)
            if os.path.exists(output_file_path):
                print(f"Already imported, skip: {os.path.join(relative_dir, file_name)}")
            else:
                with Image.open(file_path) as img:
                    img.convert('RGB').save(output_file_path)
                print(f'Convert under "{relative_dir}": {file_name} -> {output_file_name}')
    pass

if __name__ == "__main__":
    main()
