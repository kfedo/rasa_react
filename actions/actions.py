# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/core/actions/#custom-actions/


# This is a simple example for a custom action which utters "Hello World!"
# from abc import ABC

import requests, json
from typing import Any, Dict, List, Text, Optional
from rasa_sdk import Action, Tracker

from rasa_sdk.events import (
    SlotSet,
    UserUtteranceReverted,
    EventType,
)

import wikiquote


# ---------- API area ----------------------
WEATHER_FILE_PATH = 'actions/weather_city.list.json'

class SearXAPI(object):
    def __init__(self):
        self.url = "https://metasearch.outstep.com/"

    def general_query(self, search_string: Text):
        print(f"SearXAPI : url:{self.url}")
        print(f"SearXAPI : search_text:{search_string}")
        params = {"q": search_string,
                  "categories": "general",
                  "format": "json",
                  "lang": "en",
                  "image_proxy": 1,
                  "pageno": 1}
        res = requests.get(url=f"{self.url}", params=params)
        print(f"result of get request :{res}")
        return res

    def image_query(self, search_string: Text):
        print(f"SearXAPI : url:{self.url}")
        print(f"SearXAPI : search_text:{search_string}")
        params = {"q": search_string,
                  "categories": "images",
                  "format": "json",
                  "lang": "en",
                  "image_proxy": 1,
                  "pageno": 1}
        res = requests.get(url=f"{self.url}", params=params)
        print(f"result of get request :{res}")
        return res


# ------------------ Action area ------------------
class ActionTodayQuote(Action):
    def name(self) -> Text:
        return 'action_qotd'

    def run(self, dispatcher, tracker, domain):
        print()
        print("======Inside Action Today Quote ====")
        print()
        print(len(wikiquote.qotd()))
        qotd = '~'.join(wikiquote.qotd())
        print(qotd)
        dispatcher.utter_message(
            text="Here is the Quote of the Day.",
            json_message={"payload": "wikiquote", "text": qotd})

        return []


class ActionGreetUser(Action):
    """Revertible mapped action for utter_greet"""

    def name(self):
        return "action_greet"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message(template="utter_greet")
        return [UserUtteranceReverted()]


class ActionImageSearch(Action):
    def name(self) -> Text:
        return 'action_image_search'

    def run(self, dispatcher, tracker, domain):
        print()
        print("======Inside Action ImageSearch====")
        print()
        search_text = tracker.latest_message.get("text")
        print(f"last_text:{search_text}")
        if 'show' in search_text:
            if 'show ' in search_text:
                search_text = search_text.split(' ')[1]
            else:
                search_text = search_text.split('show')[1]
                if 'images' in search_text:
                    search_text = search_text.split('images')[0]
        if 'display' in search_text:
            search_text = search_text.split(' ')[1]
        search_text = search_text.replace('?', '')
        search_text = search_text.replace('.', '')
        search_text = search_text.strip()
        print(f"search_text:{search_text}")
        searX = SearXAPI()
        res = searX.image_query(search_text)
        res = res.json()
        if res:
            res = res['results']
        dispatcher.utter_message(
            text="Here are " + '"' + search_text + '"' + " images.",
            json_message={"payload": "cardsCarousel", "data": res, "keyword": search_text}
        )
        return []


class ActionFind(Action):
    def name(self):
        return "action_find"

    def run(self, dispatcher, tracker, domain):
        print()
        print("======Inside Action Find ====")
        print()

        search_text = tracker.latest_message.get("text")
        if 'search for' in search_text:
            search_text = search_text.split('search for')[1]
        elif 'search' in search_text:
            search_text = search_text.split('search')[1]
        elif 'find' in search_text:
            search_text = search_text.split('find')[1]
        search_text = search_text.replace('?', '')
        search_text = search_text.strip()

        print(f"search_text:{search_text}")

        searX = SearXAPI()
        res = searX.general_query(search_text)
        res = res.json()
        result = {}
        if res and res['infoboxes']:
            result['info_boxes'] = res['infoboxes']
            temp = res['suggestions']
            temp.insert(0, search_text)
            result['suggestions'] = temp
        else:
            print(f"no infoboxes ")
            dispatcher.utter_message(text="Sorry, I can't answer your question.")
            return []
        dispatcher.utter_message(
            text="Here is some information about " + '"' + search_text + '"',
            json_message={"payload": "findSearch", "data": result}
        )
        return []


class ActionGeneralSearch(Action):

    def name(self):
        return "action_general_search"

    def run(self, dispatcher, tracker, domain):
        print()
        print("======Inside Action GeneralSearch====")
        print()
        search_text = tracker.latest_message.get("text")
        if ' are ' in search_text:
            search_text = search_text.split(' are ')[1]
        if ' was ' in search_text:
            search_text = search_text.split(' was ')[1]
        if ' is ' in search_text:
            search_text = search_text.split(' is ')[1]
        search_text = search_text.replace('?', '')
        search_text = search_text.strip()

        print(f"search_text:{search_text}")
        if not search_text:
            dispatcher.utter_message(text="Sorry, I can't answer your question.")
            return []
        searX = SearXAPI()
        res = searX.general_query(search_text)
        res = res.json()
        result = {}
        if res and len(res['infoboxes']) > 0:
            result['info_boxes'] = res['infoboxes']
            result['suggestions'] = res['suggestions']
            temp = res['suggestions']
            temp.insert(0, search_text)
            result['suggestions'] = temp
        else:
            dispatcher.utter_message(text="Sorry, I can't answer your question.")
            return []

        dispatcher.utter_message(
            text="Here is some information about " + '"' + search_text + '"',
            json_message={"payload": "generalSearch", "data": result}
        )
        return []


class ActionWeatherSearch(Action):
    def name(self) -> Text:
        return "action_weather_search"

    def run(self, dispatcher, tracker, domain):
        print()
        print("======Inside Action WeatherSearch====")
        print()

        lat = tracker.get_slot("latitude")
        lon = tracker.get_slot("longitude")
        print("lat:", lat)
        print("lon:", lon)
        search_text = tracker.latest_message.get("text")
        if ' in ' in search_text:
            search_text = search_text.split(' in ')[1]
        else:
            search_text = search_text.split(' ')[-1]

        search_text = search_text.replace('?', '')
        search_text = search_text.strip().lower()
        print(f"search_text:{search_text}")
        weather_city_id = None
        with open(WEATHER_FILE_PATH, encoding="utf-8") as json_file:
            data = json.load(json_file)
            weather_city_id_list = [d['id'] for d in data if d['name'].lower() == search_text and d['state'] == '']
            if len(weather_city_id_list) > 0:
                weather_city_id = weather_city_id_list[0]
                print(weather_city_id)

        if not weather_city_id:
            dispatcher.utter_message(text="Sorry, I can't find that city.")

        if not search_text:
            dispatcher.utter_message(text="Sorry, I can't answer your question.")

        dispatcher.utter_message(
            text="Here is the current weather for " + '"' + search_text + '".',
            json_message={"payload": "weather", "weather_city_name": search_text, 'weather_city_id': weather_city_id}
        )
        return []


class ActionOpenSite(Action):
    def name(self):
        return "action_open_site"

    def run(self, dispatcher, tracker, domain):
        print()
        print("======Inside Action OpenSite ====")
        print()
        search_text = tracker.latest_message.get("text")
        search_text = search_text.strip().lower()
        if 'goto' in search_text:
            search_text = search_text.split('goto')[1]
        if 'go to' in search_text:
            search_text = search_text.split('go to')[1]
        if 'open' in search_text:
            search_text = search_text.split('open')[1]

        search_text = search_text.replace('?', '')
        search_text = search_text.strip().lower()
        print(f"search_text:{search_text}")
        dispatcher.utter_message(
            text="Opening up the website " + search_text,
            json_message={"payload": "open_site", 'url': search_text}
        )
        return []

