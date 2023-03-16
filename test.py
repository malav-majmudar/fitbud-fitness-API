from pymongo import MongoClient

# Requires the PyMongo package.
# https://api.mongodb.com/python/current

print("Hello World")
client = MongoClient('mongodb+srv://shivamp3:nemqor-7qEkxo-jywmij@cluster0.okra1n3.mongodb.net/Fitness?retryWrites=true&w=majority')
if client:
    print("Connected")
else:
    print("Connection Failed")

result = client['Fitness']['foods'].aggregate([
    {
        '$search': {
            'index': 'foodSearch',
            'compound': {
                'should': [
                    {
                        'autocomplete': {
                            'path': 'name',
                            'query': 'SHAKE PREMIER PROTEIN',
                            'score': {
                                'boost': {
                                    'value': 7
                                }
                            }
                        }
                    }, {
                        'text': {
                            'path': 'name',
                            'query': 'SHAKE PREMIER PROTEIN',
                            'score': {
                                'boost': {
                                    'value': 10
                                }
                            }
                        }
                    }, {
                        'text': {
                            'path': {"value": "name", "multi": "standard"},
                            'query': 'SHAKE PREMIER PROTEIN',
                            'score': {
                                'boost': {
                                    'value': 1
                                }
                            }
                        }
                    }, {
                        'text': {
                            'path': ['brandName', 'brandOwner'],
                            'query': 'SHAKE PREMIER PROTEIN',
                            'score': {
                                'boost': {
                                    'value': 5
                                }
                            }
                        }
                    }, {
                        'text': {
                            'path': [{"value": "brandName", "multi": "standard"}, {"value": "brandOwner", "multi": "standard"}],
                            'query': 'SHAKE PREMIER PROTEIN',
                            'score': {
                                'boost': {
                                    'value': 1
                                }
                            }
                        }
                    },
                ]
            }
        }
    }, {
        '$project': {
            '_id': 1,
            'name': 1,
            'brandName': 1,
            'brandOwner': 1,
            'score': {
                '$meta': 'searchScore'
            }
        }
    }, {
        '$limit': 250
    }
])

with open("test.txt", "w") as f:
    for r in result:
        print(r)
        f.write(str(r) + '\n')
