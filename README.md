# Quiz Site

A site that allows you to easily gather answers from your participants

## Installing
It's not really meant to be a 1-click install as I was developing this for myself
You will need a Supabse account. 
- Go create a database and note your Supabse project link and public api key. 
- Add them to your `.env` file under `VITE_PUBLIC_SUPABASE_URL` and `.VITE_PUBLIC_SUPABASE_ANON_KEY`
### Upload database dump to your server [here](https://github.com/4Lajf/quiz-site/blob/master/dump-postgres-202305301432)
- Create tables `quiz`, `quizEvents`, `ps`, `psEvents`, `JTM`, `JTMEvents`
- quiz schema `id: int8`, `team: text`, `answer: text`,`misc: text`, `points: numeric`, `canAnswer: bool`
- quizEvents schema `id: int8`, `name: text`, `event: text`
- ps schema 
(more robust version of quiz, will implement there soon too) 
`id: int8`, `team: text`, `answer: text`,`misc: text`, `points: numeric`, `canAnswer: bool`, `isTurn: text`, `roundNumber: numeric`, `isTakeover: text`, `takeoverDate: text`, `seconds: numeric`, `timeChosen: bool`
- psEvents schema `same as quizEvents`
- JTM schema `id: int8`, `team: text`, `notes: numeric`, `points: numeric`, `canAnswer: bool`, `date: numeric`
- JTMEvents schema `same as quizEvents`
## Routes
*You can append each route (except `/api`) with `/admin` for admin console or `/scores` for public scores
You will need to create an account with Supabase and modify the code to allow your email to be able to use the admin console*

- `/quiz` - normal quiz
- `/ps` - created for specific contest where participants give host a number of seconds the media will be played for. It has more features than the standard quiz but they are planned to be copied there as well. 
- `/jakatomelodia` - UI for a song guessing contest where participants can bid on how many notes a song will play.
- `/wof` - Wheel of Fortune kind of game. Guess the anime names (or whatever really) by missing letters. 
- `/api/autocomplete` - API for my other repo `amq-scripts/amqBetterSongArtist.js`. It serves as a database so the autocomplete (dropdown) that is used in this script can be automatically updated.
