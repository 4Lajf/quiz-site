# Currently broken and not maintained
Maybe I will replace it with a better version someday, that code is from my early days in tech and was quite bad.

# Quiz Site

A site that allows you to easily gather answers from your participants

## Installing

Once you've downloaded this project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

It's not really meant to be a 1-click install as I was developing this for myself
You will need a Supabse account. 
- Go create a database and note your Supabse project link and public api key. 
- Add them to your `.env` file under `VITE_PUBLIC_SUPABASE_URL` and `.VITE_PUBLIC_SUPABASE_ANON_KEY`
### Upload database dump to your server [here](https://github.com/4Lajf/quiz-site/blob/master/dump-postgres-202305301432)
## Routes
*You can append each route (except `/api`) with `/admin` for admin console or `/scores` for public scores
You will need to create an account with Supabase and modify the code to allow your email to be able to use the admin console*

- `/quiz` - normal quiz
- `/ps` - created for specific contest where participants give host a number of seconds the media will be played for. It has more features than the standard quiz but they are planned to be copied there as well. 
- `/jakatomelodia` - UI for a song guessing contest where participants can bid on how many notes a song will play.
- `/wof` - Wheel of Fortune kind of game. Guess the anime names (or whatever really) by missing letters. 
- `/api/autocomplete` - API for my other repo `amq-scripts/amqBetterSongArtist.js`. It serves as a database so the autocomplete (dropdown) that is used in this script can be automatically updated.
