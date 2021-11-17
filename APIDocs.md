# Octacool API Documentation

## Endpoints :

List of available endpoints :

- `POST /login`
- `POST /register`
- `GET /getAnime/:subtype`
- `GET /getManga`
- `GET /getDetail/:type/:id`  
Endpoints below require authentication :
- `POST /addToMyList/:type/:id`
- `GET /myList`

&nbsp;

## 1. POST /register

Request:

- body:

```json
{
  "username": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "username": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Please input Username and Password"
}
OR
{
  "message": "Username already exists"
}
```

&nbsp;

## 2. POST /login

Request:

- body:

```json
{
  "username": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Please provide Username and Password"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "User or Password is Incorrect"
}
```

&nbsp;

## 3. GET /getAnime/:subtype

Description:
- Get anime from MAL API

Request:

- params:
```json
{
  "subtype" : "airing" OR "upcoming"
}
```
- query: 

```json
{
  "title": "string" (optional)
}
```

_Note_: When using query the subtype is ignored but it is still  
     required to put in either "airing" or "upcoming"

_Response (200 - OK)_

```json
[
  {
    "MalId": 40834,
    "title": "Ousama Ranking",
    "imageUrl": "https://cdn.myanimelist.net/images/anime/1347/117616.jpg?s=1fc7d9cfcad3dfca1cee2e11b5b74ef4"
  },
  {
    "MalId": 45576,
    "title": "Mushoku Tensei: Isekai Ittara Honki Dasu Part 2",
    "imageUrl": "https://cdn.myanimelist.net/images/anime/1028/117777.jpg?s=99ecca20cac2345fc956fda60a5e025f"
  },
  ...,
]
```

_Response (503 - Service Unavailable)_
```json
{
  "message": "Anime fetching failed please try again later"
}
```

&nbsp;

## 4. GET /getManga

Description:
- Get manga from mangadex API

Request:

- query: 

```json
{
  "title": "string" (optional)
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "89daf9dc-075a-4aa5-873a-cc76bb287108",
    "title": "Gokushufudou: The Way of the House Husband",
    "imageUrl": "https://uploads.mangadex.org/covers/89daf9dc-075a-4aa5-873a-cc76bb287108/062b1fed-cd7b-4983-b321-69a46e65302c.jpg",
    "status": "ongoing"
  },
  {
    "id": "26dd4eae-1bf7-4834-986b-40914cbd5816",
    "title": "Boukensha License wo Hakudatsu Sareta Ossan Dakedo, Manamusume ga Dekita no de Nonbiri Jinsei wo Oukasuru",
    "imageUrl": "https://uploads.mangadex.org/covers/26dd4eae-1bf7-4834-986b-40914cbd5816/97b71b2c-a9d3-4d29-8f35-ba4908407c78.jpg",
    "status": "ongoing"
  },
  ...,
]
```

&nbsp;

## 5. GET /getDetail/:type/:id

Description:
- Get detail from Mangadex or MAL dependings on the type

Request:

- params:
```json
{
  "type" : "anime" OR "manga",
  "id": "string" OR "integer"
}
```
_notes_ the id string or integer depends on the subtype

| type  |  id |  
|---|---|
| Manga  |  string |   
| Anime  |  integer |  

_Response (200 - OK)_

```json
{
    "id": "d86cf65b-5f6c-437d-a0af-19a31f94ec55",
    "type": "manga",
    "title": "Ijiranaide, Nagatoro-san",
    "imageUrl": "https://uploads.mangadex.org/covers/d86cf65b-5f6c-437d-a0af-19a31f94ec55/3f37ee5d-4d08-49ad-a0a6-9af7d937c5e7.png",
    "status": "ongoing",
    "synopsis": "Our nameless—and spineless—hero (only known as \"Senpai\") is a second year high school student and loner who spends his afternoons at the Arts Club room. He attracts the attention of one of his schoolmates, a sadistic freshman girl named Nagatoro. However, in between the bullying and teasing, something else begins to blossom. A lovey dovey(…?) story between a shy nerd and an S-Dere (Sadistic Tsundere) begins.",
    "genreList": [
        "Romance",
        "Comedy",
        "Slice of Life"
    ]
}
```
OR
```json
{
    "id": 5,
    "type": "anime",
    "title": "Cowboy Bebop: Tengoku no Tobira",
    "imageUrl": "https://cdn.myanimelist.net/images/anime/1439/93480.jpg",
    "status": "Finished Airing",
    "synopsis": "Another day, another bounty—such is the life of the often unlucky crew of the Bebop. However, this routine is interrupted when Faye, who is chasing a fairly worthless target on Mars, witnesses an oil tanker suddenly explode, causing mass hysteria. As casualties mount due to a strange disease spreading through the smoke from the blast, a whopping three hundred million woolong price is placed on the head of the supposed perpetrator. With lives at stake and a solution to their money problems in sight, the Bebop crew springs into action. Spike, Jet, Faye, and Edward, followed closely by Ein, split up to pursue different leads across Alba City. Through their individual investigations, they discover a cover-up scheme involving a pharmaceutical company, revealing a plot that reaches much further than the ragtag team of bounty hunters could have realized. [Written by MAL Rewrite]",
    "genreList": [
        "Action",
        "Drama",
        "Mystery",
        "Sci-Fi"
    ]
}
```
_Response (400 - Bad Request)_
```json
{
  "message": "Undefined type parameter"
}
```
_Response (404 - Not Found)_
```json
{
  "message": "Manga/anime not found"
}
```

&nbsp;

## 6. POST /addToMyList/:type/:id


Description:
- Add Manga/anime into MyList

Request:

- headers:
```json
{
  "access_token": "string"
}
```

- params:
```json
{
  "type" : "anime" OR "manga",
  "id": "string" OR "integer"
}
```
_notes_ the id string or integer depends on the subtype

| type  |  id |  
|---|---|
| Manga  |  string |   
| Anime  |  integer |  


_Response (200 - OK)_

```json
{
    "id": "integer",
    "UserId": "integer",
    "DexId": "string",
    "animeId": "integer"
}
```

_Response (400 - Bad Request)_
```json
{
  "message": "Undefined type parameter"
}
```
_Response (404 - Not Found)_
```json
{
  "message": "Manga/anime not found"
}
```

&nbsp;

## 7. GET /myList


Description:
- get MyList

Request:

- headers:
```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
{
    "myMangas": [
        {
            "id": "d8a959f7-648e-4c8d-8f23-f1f3f8e129f3",
            "title": "One Punch-Man",
            "imageUrl": "https://uploads.mangadex.org/covers/d8a959f7-648e-4c8d-8f23-f1f3f8e129f3/f91e6a2e-a11b-4326-a615-a70dd24d604b.jpg",
            "synopsis": "After rigorously training for three years, the ordinary Saitama has gained immense strength which allows him to take out anyone and anything with just one punch. He decides to put his new skill to good use by becoming a hero. However, he quickly becomes bored with easily defeating monsters, and wants someone to give him a challenge to bring back the spark of being a hero.  \n  \nUpon bearing witness to Saitama's amazing power, Genos, a cyborg, is determined to become Saitama's apprentice. During this time, Saitama realizes he is neither getting the recognition that he deserves nor known by the people due to him not being a part of the Hero Association. Wanting to boost his reputation, Saitama decides to have Genos register with him, in exchange for taking him in as a pupil. Together, the two begin working their way up toward becoming true heroes, hoping to find strong enemies and earn respect in the process.  \n  \n\n\n---"
        },
        ...
    ],
    "myAnimes": [
        {
            "id": 9,
            "title": "One Piece",
            "imageUrl": "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
            "status": "Gol D. Roger was known as the \"Pirate King,\" the strongest and most infamous being to have sailed the Grand Line. The capture and execution of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King. Enter Monkey D. Luffy, a 17-year-old boy who defies your standard definition of a pirate. Rather than the popular persona of a wicked, hardened, toothless pirate ransacking villages for fun, Luffy's reason for being a pirate is one of pure wonder: the thought of an exciting adventure that leads him to intriguing people and ultimately, the promised treasure. Following in the footsteps of his childhood hero, Luffy and his crew travel across the Grand Line, experiencing crazy adventures, unveiling dark mysteries and battling strong enemies, all in order to reach the most coveted of all fortunes—One Piece. [Written by MAL Rewrite]"
        },
        ...
    ]
}
```


&nbsp;


## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```