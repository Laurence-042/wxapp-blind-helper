import secrets
import string
from urllib.parse import quote, unquote

if __name__ == '__main__':

    data = ["speaker","format","volume","speed","text","aht","apc"]
    for d in data:
        print("{0} = data['{0}']".format(d))
