import pandas
import pymongo

uri = 'mongodb://wecloud:riQjoBDxr09fnyu8yCa9FeP19Op8UNB1ZFVkxEw3a1cQy25YrPnTzHx460TWBp8vaWIm5ciDRGh6ACDbZ5nHeg==@wecloud.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@wecloud@'
client = pymongo.MongoClient(uri)
DATABASE_NAME = "wegame"
COLLECTION = "wegame"
USER_COLLECTION = "user"
DATASET_PATH = "games2.csv"


def read_dataset():
    data = pandas.read_csv(DATASET_PATH, encoding='gbk')
    data = data.fillna("")
    data = data.to_dict(orient="records")
    database = client[DATABASE_NAME]
    list_data = []
    for item in data:
        list_data.append(item)
    database[COLLECTION].insert_many(list_data)
    return data


def get_db():
    try:
        _collection = client[DATABASE_NAME]
        is_exist = _collection[COLLECTION].count()
        print(f"{COLLECTION} is exist: {is_exist}")
        return is_exist != 0
    except Exception as e:
        raise e


if __name__ == "__main__":
    if not get_db():
        read_dataset()
